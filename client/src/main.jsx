import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp";
import Meeting from "./Meeting";
import App from "./App";
import { Toaster } from "@/components/ui/toaster";
import Home from "./Home";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
    errorElement: (
      <div>
        <h1>Oops! - 404 Error - Page Not Found</h1>
      </div>
    ),
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: (
      <div>
        <h1>Oops! - 404 Error - Page Not Found</h1>
      </div>
    ),
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
            <Home />
        ),
        errorElement: (
          <div>
            <h1>Oops! - 404 Error - Page Not Found</h1>
          </div>
        ),
      },
      {
        path: "meeting/:meetingID",
        element: <Meeting />,
        errorElement: (
          <div>
            <h1>Oops! - 404 Error - Meeting Not Found</h1>
          </div>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Toaster />
    <RouterProvider router={router} />
  </>
);
