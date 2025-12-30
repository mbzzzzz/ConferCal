# ConferCal - WebRTC Video Conferencing

## Description
ConferCal is a premium Peer-to-Peer Video Conferencing application built with React, WebRTC, and Socket.io. It supports real-time video and audio communication for multiple participants with a modern, glassmorphic UI.

## Features
- **Pristine Landing Page:** Modern, animated entry point with a professional "Get Started" flow.
- **Green Room (Lobby):** Mandatory pre-join screen for username entry and hardware (Camera/Mic) verification.
- **Local Screen Recording:** Bonus feature to record meetings (Video + System Audio) locally with one-click download.
- **High Mobile Responsiveness:** Fully optimized UI for smartphones/tablets, including a hideable participant sidebar.
- **Host Moderation:** Host capabilities to Mute or Kick any participant in real-time.
- **Real-time Screen Sharing:** Share your screen or specific windows with peers.
- **Interactive Engagement:** Floating emoji reactions with animations and a live text chat.
- **Visual Feedback:** Active speaker indicators, audio wave animations, and connection status badges.
- **Peer-to-Peer Architecture:** High-quality low-latency communication using native WebRTC Mesh topology.
- **Secure Signaling:** Robust Socket.io signaling server for reliable connection handshakes.

## Technologies Used
- **Signaling**: Node.js, Socket.io
- **Utilities**: Lucide React, Sonner (Toasts), UUID, Tailwind CSS
- **Core:** WebRTC (Native API), Socket.io-client
- **Icons:** Lucide React, Google Material Symbols
- **Backend:** Node.js, Express, Socket.io (Signaling)

## Project Structure
```text
confercall/
├── server/            # Node.js Signaling Server
│   └── server.js      # Socket.io logic & Moderation handlers
├── src/
│   ├── assets/        # Images & Global styles
│   ├── components/    # UI Components (VideoRoom, Lobby, etc.)
│   ├── hooks/         # Custom WebRTC & Media Hooks
│   ├── utils/         # Socket configuration
│   └── App.jsx        # Routing & Entry
├── ARCHITECTURE.md    # Detailed system design
└── AI_USAGE.md        # Documentation of AI contributions
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Modern Web Browser (Chrome, Firefox, Safari)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ConferCall
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the Signaling Server**
   Open a terminal and run:
   ```bash
   cd server
   node server.js
   ```
   *Server runs on port 5000*

5. **Run the Application**
   Open a second terminal and run:
   ```bash
   npm run dev
   ```

6. **Open Browser**
   Navigate to `http://localhost:5173`

## How to Use

1. **Create a Room:**
   - On the homepage, click "Create Instant Meeting".
   - Grant camera and microphone permissions.
   - You will be redirected to a unique room (e.g., `/room/uuid`).

2. **Join a Room:**
   - Copy the Room ID (or full URL) from the address bar or using the "Copy" button in the control bar.
   - Share it with a friend.
   - They can join by pasting the ID on the homepage or opening the link.

3. **In Call:**
   - Use the bottom control bar:
     - Mute/Unmute, Video On/Off, Copy Link, End Call.
     - **Host Controls**: Kick/Mute buttons for host.
     - **Recording Control**: Trigger for local screen recording using `MediaRecorder`.
     - **Reactive Layout**: Scale-aware container for mobile usability.

## Dependencies

**Frontend:**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.1",
    "lucide-react": "^0.469.0",
    "socket.io-client": "^4.8.1",
    "uuid": "^11.0.3",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "vite": "^6.0.5",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

## Known Limitations
- Mesh network topology: Performance may degrade after 4-5 participants as each peer connects to every other peer.
- Requires local network or public IP visibility (STUN servers included, but symmetric NATs may blocking connection without TURN).
- Screen Recording captures the entire screen or window selected by the browser prompts.

## Browser Compatibility
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 15+ ✅
- Edge 90+ ✅

## AI Tools Used
- **Google Gemini (Deepmind Antigravity)**: Code generation, architecture planning, and documentation.
- **Usage:** Used for generating React components, Tailwind styles, and WebRTC logic.

## Architecture
See ARCHITECTURE.md for signaling flow and component diagrams.

## License
MIT

## Author
User & Antigravity (AI Assistant)
