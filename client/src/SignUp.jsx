import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Video, Lock, User, Mail, UserPlus } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(""); // Clear error when user types
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign up failed");
      }

      // Navigate to sign in page after successful registration
      navigate("/signin");
      console.log("Successfully registered. Please sign in.");
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 min-h-screen w-full py-8">
      <div className="bg-gray-800/90 rounded-xl shadow-xl w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 p-8 border border-gray-700/70 backdrop-blur-sm">
        <div className="flex items-center justify-center mb-6">
          <Video className="text-blue-500 mr-2" size={28} />
          <span className="text-xl font-bold text-white">MeetSync</span>
        </div>
        
        <h1 className="text-2xl font-semibold text-white text-center mb-6">Create Account</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-md p-3 mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignUp} className="flex flex-col">
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 text-sm">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter your name"
                name="name"
                value={form.name}
                className="bg-gray-700/50 border border-gray-600 text-white rounded-md p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={handleInput}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 text-sm">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={form.email}
                className="bg-gray-700/50 border border-gray-600 text-white rounded-md p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={handleInput}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Create a password"
                name="password"
                value={form.password}
                className="bg-gray-700/50 border border-gray-600 text-white rounded-md p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={handleInput}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-1 text-sm">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={form.confirmPassword}
                className="bg-gray-700/50 border border-gray-600 text-white rounded-md p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={handleInput}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md w-full mb-4 flex items-center justify-center transition-colors shadow-md disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <UserPlus className="mr-2" size={18} />
                <span>Sign Up</span>
              </>
            )}
          </button>
          
          <div className="text-center text-gray-400 text-sm">
            Already have an account? <Link to="/signin" className="text-blue-400 hover:text-blue-300 transition">Sign In</Link>
          </div>
        </form>
      </div>
    </main>
  );
}