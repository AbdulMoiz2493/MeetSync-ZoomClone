# MeetSync - A Zoom Clone App

MeetSync is a real-time video conferencing application built to emulate the core functionalities of popular video conferencing platforms. This app allows users to create and join video calls, manage participants, and utilize various layouts for an engaging video experience.

## Features

- Real-time video and audio communication
- Multiple video layouts (grid, speaker)
- Screen sharing amoung multiple users
- Participant management
- User roles and permissions
- Secure communication with token-based authentication
- Secure Login/Signup with JWT

## Tech Stack

### Client

- React
- Tailwind CSS
- Stream Video SDK
- React Router

### Server

- Node.js
- Express
- Stream Video API

## Getting Started

### Prerequisites

- Node.js and npm installed
- Stream Video API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbdulMoiz2493/MeetSync-ZoomClone.git
   cd MeetSync-ZoomClone


2. Install dependencies for the client:
   ```bash
   cd client
   npm install
   ```

3. Install dependencies for the server:
   ```bash
   cd ../server
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the `server` and `client` folder and add the following:

#### For Server
```
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

#### For Client
```
VITE_APP_STREAM_API_KEY=your_stream_api_key
VITE_APP_STREAM_API_SECRET=your_stream_api_secret
```

### Running the Application

1. Start the server:
   ```bash
   cd server
   node index.js
   ```

2. Start the client:
   ```bash
   cd ../client
   npm run dev
   ```

The client will run on `http://localhost:5173` and the server will run on `http://localhost:8000`.

## Folder Structure

```plaintext
MeetSync-ZoomClone/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── Providers/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── ...
│   ├── .env
│   ├── package.json
│   ├── ...
├── server/
│   ├── index.js
│   ├── .env
│   ├── package.json
│   ├── ...
├── README.md
└── ...
```

## Usage

1. **Creating a Meeting**: Users can schedule and create new meetings.
2. **Joining a Meeting**: Users can join existing meetings using a meeting ID.
3. **Participant Management**: Hosts can manage participants, including muting, removing, or setting roles.
4. **Layouts**: Users can switch between different video layouts during the call.
5. **Device Settings**: Users can configure their audio and video devices before joining a call.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any queries feel free to react me out.
- **Abdul Moiz**  
- Email: abdulmoiz8895@gmail.com 
- GitHub: [AbdulMoiz2493](https://github.com/AbdulMoiz2493)

## Acknowledgements

- [Stream Video SDK](https://getstream.io/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
