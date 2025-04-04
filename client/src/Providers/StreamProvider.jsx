import { useEffect, useState, createContext, useContext } from 'react';
import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
// Create a context to share user data
const UserContext = createContext(null);

const apiKey = import.meta.env.VITE_APP_STREAM_API_KEY;


const tokenProvider = async (user) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/tokenProvider`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if(response.status !== 200) {
            const error = await response.json();
            throw new Error(error);
        }

        const data = await response.json();
        console.log("Server returned data: ", data);
        return data;
    } catch (err) {
        console.log(err.message);
    }
}

// eslint-disable-next-line react/prop-types
export const StreamVedioProvider = ({children}) => {

    let localUser = JSON.parse(localStorage.getItem("userData")); 

    let initialUser = {
        id: localUser?.id,
        name: localUser?.name,
    };

    const [client, setClient] = useState(null);
    const [user, setUser] = useState(initialUser);


    // eslint-disable-next-line no-unused-vars
    const myLogger = (logLevel, message, ...args) => {
        console.log("Log Level: ", logLevel);
        console.log("Message Log: ", message);

      };

    useEffect(() => {
        if(!apiKey || !user) {
            console.log("User and API key must be present.");
            return;
        }
        console.log("Before Request user: ", user);
        const myClient = new StreamVideoClient({ 
            apiKey, 
            user, 
            tokenProvider: async () => {
                const data = await tokenProvider(user);
                if (data) {
                    console.log("In Process user: ", user);
                setUser((prevUser) => ({ ...prevUser, role: data.user.role }));
                return data.token;
                }
            },
            options: {
                logLevel: 'info',
                logger: myLogger,
            },
        });
        setClient(myClient);

        myClient.on('iceCandidateError', (event) => {
            console.error('ICE Candidate Error:', event);
        });
    
        myClient.on('iceConnectionStateChange', (state) => {
            console.log('ICE Connection State Changed:', state);
        });

        return () => {
        myClient.disconnectUser();
        setClient(undefined);
        };
    }, []);

  if(!client) {
    return <div>Loading ....</div>
  }

  return (
    <UserContext.Provider value={user}>
      <StreamVideo client={client}>
          {children}
      </StreamVideo>
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => useContext(UserContext);
