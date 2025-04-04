import { useState } from "react";
import { useParams } from "react-router-dom";
import MeetingRoom from "./MeetingRoom";
import MeetingSetup from "./MeetingSetup";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useGetCallById } from "./hooks/useGetCallById";
import Loader from "./ui/Loader";

export default function Meeting() {
  const { meetingID } = useParams();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const {call, isLoading, isError} = useGetCallById(meetingID);


  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.log(isError);
    return <div>Error: {isError}</div>;
  }

  if (!call) {
    return <div>No call found.</div>;
  }

  return (
    <main className="bg-white">
      <StreamCall call={call}>
        <StreamTheme>
          {isSetupComplete ? (
            <MeetingRoom  />
          ) : (
            <MeetingSetup
              setIsSetupComplete={setIsSetupComplete}
            />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}
