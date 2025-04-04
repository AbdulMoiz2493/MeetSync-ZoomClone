import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import { cn } from "./lib/utils";
import { Copy, LayoutGrid, Users, X, Search, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "./Providers/StreamProvider";

export default function MeetingRoom() {
  const [layout, setLayout] = useState("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const user = useUser();
  const call = useCall();
  const navigate = useNavigate();
  const { useCallCallingState } = useCallStateHooks();
  const [copied, setCopied] = useState(false);
  const callingState = useCallCallingState();
  const meetingId = call?.id || "Unknown";

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId);
    setCopied(true);
    console.log("Meeting ID copied to clipboard");
    
    // Reset copied state after 1.5 seconds
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      case "speaker-left":
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  // This is the fixed function - ensuring we properly handle the call leaving
  const handleLeave = async () => {
    try {
      console.log("Leaving call...");
      if (call) {
        navigate("/");
        await call.leave();
        console.log("Call left successfully, navigating to Home.");
        navigate("/");
      } else {
        console.error("Call object is undefined");
        navigate("/");
      }
    } catch (error) {
      console.error("Error leaving call:", error);
      // Navigate home even if there's an error
      navigate("/");
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900 text-white">
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center space-x-4">
          {/* Meeting ID */}
          <div className="flex items-center space-x-2 px-3 py-2 border border-gray-600 bg-gray-800 rounded-md">
            <span className="text-xs font-medium">ID: {meetingId}</span>
            <button 
              className="h-6 w-6 p-0 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer flex items-center justify-center transition-colors" 
              onClick={copyMeetingId}
              title={copied ? "Copied!" : "Copy meeting ID"}
            >
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <CallStatsButton />
          <button 
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
              showParticipants ? "bg-blue-600 text-white" : "bg-transparent hover:bg-gray-700"
            )}
            onClick={() => setShowParticipants(prev => !prev)}
            title={showParticipants ? "Hide participants" : "Show participants"}
          >
            <Users size={18} className="mr-2" />
            <span className="text-sm pt-0.5">Participants</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex h-full w-full items-center justify-center pt-12 pb-20">
        <div className="flex h-full w-full max-w-6xl items-center justify-center">
          <CallLayout />
        </div>
        
        {/* Participants Panel */}
        {showParticipants && (
          <div className="absolute right-0 top-12 bottom-20 w-72 bg-gray-800 border-l border-gray-700 overflow-hidden flex flex-col shadow-lg">
            <div className="flex justify-between items-center px-6 pt-6 pb-6 border-b border-gray-700">
              <h3 className="font-medium text-lg">Participants</h3>
              <button 
                className="h-8 w-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full border-none text-gray-300 hover:text-white cursor-pointer transition-colors"
                onClick={() => setShowParticipants(false)}
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Search bar with improved padding */}
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  className="w-full py-2 pl-10 pr-4 bg-gray-900 border border-gray-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            
            {/* Custom wrapper for participants list */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2"> {/* Additional wrapper with padding */}
                <CallParticipantsList 
                  onClose={() => setShowParticipants(false)} 
                  className="
                    [&>ul]:list-none 
                    [&>ul]:p-0 
                    [&>ul]:m-0
                    [&>ul>li]:flex 
                    [&>ul>li]:items-center 
                    [&>ul>li]:py-3 
                    [&>ul>li]:px-4 
                    [&>ul>li]:my-1
                    [&>ul>li]:border-b 
                    [&>ul>li]:border-gray-700 
                    [&>ul>li]:w-full
                    [&>ul>li]:rounded-md
                    [&>ul>li]:bg-gray-800
                    [&>ul>li]:space-x-3
                  "
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center py-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-3">
          {/* FIXED: Properly bind the leave handler to the CallControls */}
          <CallControls 
            onHangup={handleLeave} 
          />
          
          {/* Layout Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-12 w-12 rounded-full bg-gray-700 border border-gray-600 hover:bg-gray-600 flex items-center justify-center cursor-pointer transition-colors">
              <LayoutGrid size={20} className="text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-gray-700 bg-gray-800 text-white">
              {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
                <div key={index}>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-700"
                    onClick={() => setLayout(item.toLowerCase())}
                  >
                    {item}
                  </DropdownMenuItem>
                  {index < 2 && <DropdownMenuSeparator className="bg-gray-700" />}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin End Call Button */}
          {user.role === "admin" && (
            <button
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              onClick={async () => {
                await call.endCall();
                navigate("/");
              }}
              title="End meeting for everyone"
            >
              End for all
            </button>
          )}
        </div>
      </div>
    </section>
  );
}