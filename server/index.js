import 'dotenv/config';
import express from "express";
import cors from "cors";
import { StreamClient } from '@stream-io/node-sdk';
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// Express app setup
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/meetsync";

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// User Schema and Model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// JWT Token Generation
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || "your_jwt_secret", {
        expiresIn: '1d'
    });
};

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed" });
    }
};

// Stream.io Integration
const apiKey = process.env.STREAM_API_KEY;
const secret = process.env.STREAM_SECRET_KEY;

if (!apiKey || !secret) {
    console.error("Error: STREAM_API_KEY or STREAM_SECRET_KEY is not set in the environment variables.");
    process.exit(1);
}

// Generate Stream.io token
async function generateStreamToken(id, name, role) {
    try {
        let client = new StreamClient(apiKey, secret, { timeout: 3000 });

        const newUser = {
            id,
            role,
            name,
            image: 'link/to/profile/image',
        };

        await client.upsertUsers({
            users: {
                [newUser.id]: newUser,
            },
        });

        const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
        const token = client.createToken(id, exp);
        return token;
    } catch (error) {
        console.error("Error in generateStreamToken:", error.message);
        throw new Error(`Failed to generate token: ${error.message}`);
    }
}

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        res.status(201).json({ 
            success: true, 
            message: "User registered successfully" 
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/auth/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Generate tokens
        const token = generateToken(user._id);
        
        // Generate Stream token
        const streamToken = await generateStreamToken(
            user._id.toString(),
            user.name,
            user.role
        );
        
        // Set JWT as cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        // Send user data (excluding password)
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        res.status(200).json({
            success: true,
            token,
            streamToken,
            user: userData
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/auth/signout", (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: "Signed out successfully" });
});

// Protected route for testing
app.get("/api/user/profile", authMiddleware, (req, res) => {
    res.status(200).json({ user: req.user });
});

// Original Stream.io token route
app.post("/tokenProvider", async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id || !name) {
            return res.status(400).send({ success: false, message: "ID and name are required" });
        }

        const role = name === "Moiz" ? "admin" : "user";
        const user = { id, name, role };
        const token = await generateStreamToken(id, name, role);

        return res.status(200).send({ success: true, token, user });
    } catch (err) {
        console.error("REQUEST FAILED:", err.message);
        return res.status(500).send({ success: false, message: err.message });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).send({ status: "OK", message: "Server is running" });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});