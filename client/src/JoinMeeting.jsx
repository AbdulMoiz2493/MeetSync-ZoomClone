import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useToast } from "./components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { LogIn, X, AlertCircle } from "lucide-react";

export default function JoinMeeting() {
  const [meetingID, setMeetingID] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
      setMeetingID(e.target.value);
      if (error) setError("");
  };

  const clearInput = () => {
      setMeetingID("");
  };

  const joinMeeting = async () => {
      if (meetingID.length <= 0 || !meetingID) {
          setError("Please provide a valid Meeting ID");
          toast({
              variant: "destructive",
              title: "Error",
              description: "Please provide a valid Meeting ID",
          });
          return;
      }
      
      setIsJoining(true);
      
      // Simulate checking if meeting exists
      setTimeout(() => {
          navigate(`/meeting/${meetingID}`);
          setIsJoining(false);
      }, 800);
  };

  return (
      <Dialog>
          <DialogTrigger asChild>
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 p-5 rounded-xl text-white transition-all shadow-lg hover:shadow-xl flex flex-col items-center justify-center w-full max-w-xs h-40 mx-auto">
                  <LogIn className="mb-3" size={32} />
                  <p className="text-lg font-semibold">Join Meeting</p>
              </button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
              <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold flex items-center">
                      <LogIn className="mr-2 text-indigo-500" size={24} />
                      Join Meeting
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 mt-2">
                      Enter the Meeting ID to join an existing meeting.
                  </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-5 py-4">
                  <div>
                      <label htmlFor="meetingId" className="text-sm text-gray-400 block mb-2">
                          Meeting ID
                      </label>
                      <div className="relative">
                          <input 
                              id="meetingId"
                              value={meetingID}
                              onChange={handleChange}
                              placeholder="Enter Meeting ID" 
                              className={`w-full p-3 bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10`} 
                              type="text" 
                          />
                          {meetingID && (
                              <button 
                                  onClick={clearInput}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                              >
                                  <X size={18} />
                              </button>
                          )}
                      </div>
                      {error && (
                          <div className="mt-2 text-red-500 text-sm flex items-center">
                              <AlertCircle size={16} className="mr-1" />
                              {error}
                          </div>
                      )}
                  </div>
                  
                  <div className="text-sm text-gray-400">
                      By joining, you agree to our Terms of Service and Privacy Policy.
                  </div>
                  
                  <button 
                      onClick={joinMeeting} 
                      disabled={isJoining}
                      className="bg-indigo-600 hover:bg-indigo-700 w-full py-3 rounded-md text-white font-medium transition-all flex items-center justify-center"
                  >
                      {isJoining ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Joining...
                          </>
                      ) : (
                          "Join Meeting"
                      )}
                  </button>
              </div>
          </DialogContent>
      </Dialog>
  );
}