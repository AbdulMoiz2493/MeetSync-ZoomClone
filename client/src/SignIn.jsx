import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Video, Lock, User, LogIn } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(""); // Clear error when user types
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign in failed");
      }

      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      
      // Navigate to home page
      navigate("/");
      console.log("Successfully logged in");
    } catch (err) {
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 h-screen w-full">
      <div className="bg-gray-800/90 rounded-xl shadow-xl w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 p-8 border border-gray-700/70 backdrop-blur-sm">
        <div className="flex items-center justify-center mb-6">
          <Video className="text-blue-500 mr-2" size={28} />
          <span className="text-xl font-bold text-white">MeetSync</span>
        </div>
        
        <h1 className="text-2xl font-semibold text-white text-center mb-6">Sign In</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-md p-3 mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignIn} className="flex flex-col">
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 text-sm">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-1 text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={form.password}
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
              <span>Signing in...</span>
            ) : (
              <>
                <LogIn className="mr-2" size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
          
          <div className="text-center text-gray-400 text-sm">
            Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition">Sign Up</Link>
          </div>
        </form>
      </div>
    </main>
  );
}