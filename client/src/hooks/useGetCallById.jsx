import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (meetingID) => {
  const [call, setCall] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const client = useStreamVideoClient();

  useEffect(() => {

    const loadCall = async () => {
      if (!client) {
        setIsError("No client is present.");
        return;
      }

      if (!meetingID) {
        setIsError("Please Provide Meeting ID.");
        return;
      }

      setIsLoading(true);

      try {

        const { calls } = await client.queryCalls({
          filter_conditions: {
            id: meetingID,
          },
        });

        if (calls.length > 0) {
          setCall(calls[0]);
        } else {
          setIsError("No call found for the provided meeting ID.");
        }

      } catch (err) {
        setIsError(err.message || "Some error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCall();
  }, [client, meetingID]);

  return { call, isLoading, isError };
};
