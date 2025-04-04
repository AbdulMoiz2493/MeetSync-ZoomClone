/* eslint-disable no-unused-vars */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "./Providers/StreamProvider";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Video, Calendar, Clock, Copy, Check } from "lucide-react";

export default function CreateMeeting() {
    const client = useStreamVideoClient();
    const { toast } = useToast();
    const navigate = useNavigate();
    const user = useUser();
    const [callDetails, setCallDetails] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [meetingId, setMeetingId] = useState("");

    const createMeeting = async () => {
        if (!client) {
            console.log("Client is not present.");
            return;
        }
        
        if(!user.role) {
            console.log("Server error - Please try again");
            toast({
                variant: "destructive",
                title: "Server Error",
                description: "Please try again later",
            });
            return;
        }
        
        if (user.role !== "admin") {
            console.log("Only admin can create a meeting.");
            toast({
                variant: "destructive",
                title: "Not Authorized",
                description: "Only Admin can create meeting.",
            });
            return;
        }

        setIsCreating(true);
        
        try {
            const newMeetingId = self.crypto.randomUUID();
            setMeetingId(newMeetingId);
            
            const call = client.call("default", newMeetingId);

            if (!call) throw new Error("Failed to create meeting.");

            await call.getOrCreate({
                data: {
                    startsAt: new Date().toISOString(),
                    custom:{
                        createdBy: user.id,
                    }
                },
            });

            setCallDetails(call);
            setIsCreating(false);
        } catch (err) {
            setIsCreating(false);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Meeting cannot be created due to some error.",
            });
            console.log(err);
        }
    };

    const copyMeetingId = () => {
        navigator.clipboard.writeText(meetingId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const joinMeeting = () => {
        navigate(`/meeting/${meetingId}`);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-5 rounded-xl text-white transition-all shadow-lg hover:shadow-xl flex flex-col items-center justify-center w-full max-w-xs h-40 mx-auto">
                    <Video className="mb-3" size={32} />
                    <p className="text-lg font-semibold">New Meeting</p>
                </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold flex items-center">
                        <Video className="mr-2 text-blue-500" size={24} />
                        New Meeting
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 mt-2">
                        Create a secure video meeting for your team.
                    </DialogDescription>
                </DialogHeader>
                
                {!meetingId ? (
                    <div className="space-y-6 py-4">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center text-gray-300 mb-3">
                                <Calendar className="mr-2 text-blue-500" size={18} />
                                <span>Today, {new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-gray-300">
                                <Clock className="mr-2 text-blue-500" size={18} />
                                <span>Starting now</span>
                            </div>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                            {user.role === "admin" ? 
                                "You have admin privileges to create meetings." : 
                                "Only admin can create meetings."}
                        </div>
                        
                        <button
                            onClick={createMeeting}
                            disabled={isCreating || user.role !== "admin"}
                            className={`w-full py-3 rounded-md font-medium transition-all flex items-center justify-center ${
                                user.role === "admin" 
                                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {isCreating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Meeting...
                                </>
                            ) : (
                                "Create Meeting"
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="bg-green-600/20 p-4 rounded-lg border border-green-600/30 text-green-300 text-center">
                            Meeting successfully created!
                        </div>
                        
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <label className="text-sm text-gray-400 block mb-2">Meeting ID</label>
                            <div className="flex">
                                <input 
                                    type="text" 
                                    value={meetingId}
                                    readOnly
                                    className="bg-gray-700 text-white p-3 rounded-l-md border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button 
                                    onClick={copyMeetingId}
                                    className="bg-gray-600 hover:bg-gray-500 px-3 rounded-r-md flex items-center justify-center border-y border-r border-gray-600"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>
                        
                        <button
                            onClick={joinMeeting}
                            className="w-full py-3 rounded-md font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Join Now
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}