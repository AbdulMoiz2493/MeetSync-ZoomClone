import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateMeeting from "./CreateMeeting";
import JoinMeeting from "./JoinMeeting";
import { Video, Users, MessageSquare, Shield, Clock, Menu, X, LogOut, User as UserIcon } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("join");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Check for user authentication on component mount
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/signout", {
        method: "POST",
        credentials: "include"
      });
      
      // Clear local storage
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      
      // Update user state
      setUser(null);
      
      // Close user menu
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigateToSignIn = () => {
    navigate("/signin");
  };

  const navigateToSignUp = () => {
    navigate("/signup");
  };
  
  return (
    <section className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 min-h-screen w-full">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-4 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-50 bg-gray-900/80">
        <div className="flex items-center">
          <Video className="text-blue-500 mr-2" size={28} />
          <span className="text-xl font-bold text-white">MeetSync</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <button className="text-gray-300 hover:text-white transition font-medium">Features</button>
          <button className="text-gray-300 hover:text-white transition font-medium">Solutions</button>
          <button className="text-gray-300 hover:text-white transition font-medium">Plans</button>
          <button className="text-gray-300 hover:text-white transition font-medium">Contact</button>
        </div>
        
        <div className="flex items-center">
          {user ? (
            <div className="relative">
              <button 
                className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition font-medium shadow-md border border-gray-700"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <UserIcon className="mr-2" size={18} />
                <span>{user.name}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <LogOut className="mr-2" size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={navigateToSignIn}
                className="bg-transparent hover:bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-md transition font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={navigateToSignUp}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition font-medium shadow-md"
              >
                Sign Up
              </button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="ml-4 text-gray-300 md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="bg-gray-800 p-4 md:hidden border-b border-gray-700 shadow-lg">
          <div className="flex flex-col space-y-3">
            <button className="text-gray-300 hover:text-white transition font-medium py-2 hover:bg-gray-700/50 rounded-md px-3">
              Features
            </button>
            <button className="text-gray-300 hover:text-white transition font-medium py-2 hover:bg-gray-700/50 rounded-md px-3">
              Solutions
            </button>
            <button className="text-gray-300 hover:text-white transition font-medium py-2 hover:bg-gray-700/50 rounded-md px-3">
              Plans
            </button>
            <button className="text-gray-300 hover:text-white transition font-medium py-2 hover:bg-gray-700/50 rounded-md px-3">
              Contact
            </button>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column - Text Content */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Professional video meetings. <span className="text-blue-500">Simplified.</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-300 leading-relaxed">
              Secure, reliable, and high-quality video conferencing for teams of all sizes. Connect anywhere, anytime.
            </p>
            
            {/* Meeting Actions */}
            <div className="mt-8 sm:mt-10 bg-gray-800/90 p-5 sm:p-6 rounded-xl border border-gray-700/70 shadow-lg backdrop-blur-sm">
              <div className="flex border-b border-gray-700/70 mb-6">
                <button 
                  className={`pb-3 px-4 font-medium text-base sm:text-lg transition-colors ${activeTab === "new" 
                    ? "text-blue-400 border-b-2 border-blue-500" 
                    : "text-gray-400 hover:text-gray-300"}`}
                  onClick={() => setActiveTab("new")}
                >
                  New Meeting
                </button>
                <button 
                  className={`pb-3 px-4 font-medium text-base sm:text-lg transition-colors ${activeTab === "join" 
                    ? "text-blue-400 border-b-2 border-blue-500" 
                    : "text-gray-400 hover:text-gray-300"}`}
                  onClick={() => setActiveTab("join")}
                >
                  Join Meeting
                </button>
              </div>
              
              <div className="flex justify-center transition-all">
                {activeTab === "new" ? (
                  <div className="w-full flex justify-center">
                    <CreateMeeting />
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <JoinMeeting />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Image or Illustration */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 w-full max-w-md lg:max-w-none mx-auto">
            <div className="bg-gray-800/90 rounded-xl border border-gray-700/70 shadow-xl overflow-hidden backdrop-blur-sm transform transition hover:scale-[1.02] hover:shadow-2xl">
              <div className="bg-gray-900 p-3 border-b border-gray-700/70">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-2">
                <div className="bg-gray-700 w-full pt-[56.25%] relative rounded-md overflow-hidden">
                  {/* Placeholder for video preview/illustration */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="relative">
                      <div className="absolute -inset-12 bg-blue-500/10 rounded-full animate-pulse"></div>
                      <Video className="text-blue-400 relative z-10" size={64} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/50 p-4 border-t border-gray-700/70">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-400">Live</span>
                  </div>
                  <span className="text-sm text-gray-400">HD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-900/80 py-16 backdrop-blur-sm border-y border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
            Why choose <span className="text-blue-500">MeetSync</span>?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: <Video className="text-blue-500" size={24} />,
                title: "HD Video",
                description: "Crystal clear audio and video for productive meetings."
              },
              {
                icon: <Users className="text-blue-500" size={24} />,
                title: "Up to 100 Participants",
                description: "Host large meetings with teammates from anywhere."
              },
              {
                icon: <MessageSquare className="text-blue-500" size={24} />,
                title: "Chat & Share",
                description: "Collaborate with integrated chat and file sharing."
              },
              {
                icon: <Shield className="text-blue-500" size={24} />,
                title: "Secure Meetings",
                description: "End-to-end encryption for all your conferences."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800/90 p-6 rounded-xl border border-gray-700/70 shadow-lg transition-all hover:shadow-xl hover:border-gray-600/70 hover:translate-y-[-2px]"
              >
                <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonial Section - New */}
      <div className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Trusted by thousands of teams</h2>
          
          <div className="bg-gray-800/70 rounded-xl border border-gray-700/70 p-6 sm:p-8 shadow-lg">
            <p className="text-lg sm:text-xl text-gray-300 italic">
              "MeetSync has transformed how our distributed team collaborates. The video quality is exceptional and the interface is intuitive. It's become an essential tool for our daily operations."
            </p>
            <div className="mt-6">
              <p className="text-blue-400 font-semibold">Sarah Johnson</p>
              <p className="text-gray-400 text-sm">CTO, TechForward</p>
            </div>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-70">
            {['Company 1', 'Company 2', 'Company 3', 'Company 4'].map((company, i) => (
              <div key={i} className="text-xl font-bold text-gray-400">{company}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action - New */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to upgrade your meetings?</h2>
          <p className="text-blue-100 mb-8 text-lg">Start free and upgrade as your team grows.</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors shadow-md">
            Get Started for Free
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Video className="text-blue-500 mr-2" size={20} />
              <span className="text-lg font-bold text-white">MeetSync</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">Support</a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">Contact</a>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2025 MeetSync. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}