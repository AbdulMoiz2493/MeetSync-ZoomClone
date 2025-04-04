import { Outlet } from "react-router-dom";
import { StreamVedioProvider } from "./Providers/StreamProvider";
import '@stream-io/video-react-sdk/dist/css/styles.css';


export default function App() {
  return (
    <div>
      <StreamVedioProvider>
        <Outlet />
      </StreamVedioProvider>
    </div>
  )
}
