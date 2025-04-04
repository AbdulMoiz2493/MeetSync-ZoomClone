import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Video, Mic, MicOff, VideoOff, Settings, Users, User, Info } from "lucide-react";

export default function MeetingSetup({ setIsSetupComplete }) {
  const [isMicOff, setIsMicOff] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [username, setUsername] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const call = useCall();

  if (!call) {
    throw new Error("useCall must be used within stream component.");
  }
  
  useEffect(() => {
    // Get user's name from local storage or generate a default
    const storedName = localStorage.getItem("username") || "";
    setUsername(storedName);
    
    // Handle camera state
    if (isCamOff) {
      call?.camera.disable();
    } else {
      call?.camera.enable();
    }
    
    // Handle microphone state
    if (isMicOff) {
      call?.microphone.disable();
    } else {
      call?.microphone.enable();
    }
  }, [isCamOff, isMicOff, call?.camera, call?.microphone]);

  const handleJoin = async () => {
    setIsJoining(true);
    
    // Save username for next time
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
    }
    
    try {
      await call.join();
      setIsSetupComplete(true);
    } catch (error) {
      console.error("Failed to join meeting:", error);
      setIsJoining(false);
    }
  };

  return (
    <main className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header with Logo and Meeting Info */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-600 p-1.5 rounded mr-2">
              <Video className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-white">MeetSync</span>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-white">Ready to join?</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Info size={12} className="text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">Meeting about to start</span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column - Video Preview */}
              <div className="md:w-2/3 h-8">
                <div className="relative bg-gray-900 rounded-xl border border-gray-700 overflow-hidden h-80 md:h-95 shadow-inner">
                  <VideoPreview className="w-full h-full object-cover" />
                  
                  {isCamOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 rounded-full p-4 mb-3">
                          <User size={36} className="text-gray-400" />
                        </div>
                        <span className="text-gray-400 font-medium">Camera is off</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                    <button 
                      onClick={() => setIsMicOff(!isMicOff)}
                      className={`p-3 rounded-full flex items-center justify-center shadow-lg ${
                        isMicOff 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      {isMicOff ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    
                    <button 
                      onClick={() => setIsCamOff(!isCamOff)}
                      className={`p-3 rounded-full flex items-center justify-center shadow-lg ${
                        isCamOff 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      {isCamOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </button>
                    
                    <DeviceSettings
                      TriggerButton={() => (
                        <button className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center shadow-lg">
                          <Settings size={20} />
                        </button>
                      )}
                    />
                  </div>
                  
                  {/* Meeting Name Tag */}
                  <div className="absolute top-4 left-4 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Ready to join
                  </div>
                </div>
              </div>
              
              {/* Right Column - User Info */}
              <div className="md:w-1/3">
                <div className="space-y-6">
                  
                  
                  {/* Join Status */}
                  <div className="text-sm text-gray-300 border-l-2 border-blue-500 pl-3 py-2 bg-blue-500/5">
                    {isMicOff && isCamOff 
                      ? "You'll join with camera and microphone off" 
                      : isMicOff 
                        ? "You'll join with microphone off" 
                        : isCamOff 
                          ? "You'll join with camera off" 
                          : "You're all set to join the meeting"}
                  </div>
                  
                  {/* Join Button */}
                  <button
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-3 text-white font-medium transition-all flex items-center justify-center shadow-lg"
                  >
                    {isJoining ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining Meeting...
                      </>
                    ) : (
                      "Join Now"
                    )}
                  </button>
                  
                  {/* Meeting Tips */}
                  <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-gray-300 font-medium text-sm mb-2">Meeting Tips</h3>
                    <ul className="text-xs text-gray-400 space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5">•</span>
                        Find a quiet space with minimal background noise
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5">•</span>
                        Use headphones for better audio quality
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5">•</span>
                        Ensure good lighting for better visibility
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          By joining, you agree to MeetSync's Terms of Service and Privacy Policy
        </div>
      </div>
    </main>
  );
}