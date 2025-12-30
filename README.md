# ConferCal - WebRTC Video Conferencing

## Description
ConferCal is a premium Peer-to-Peer Video Conferencing application built with React, WebRTC, and Socket.io. It supports real-time video and audio communication for multiple participants with a modern, glassmorphic UI.

## Features
- **Pristine Landing Page:** Modern entry point with "Get Started" flow.
- **Green Room (Lobby):** Pre-join screen to test audio/video devices.
- **Instant Room Creation:** Generate unique secure meeting rooms with one click.
- **Real-time Video & Audio:** High-quality low-latency communication using WebRTC.
- **Screen Recording:** Record your meetings locally with one click.
- **Interactive Controls:** Screen Share, Raise Hand, Emoji Reactions.
- **Host Moderation:** Host capabilities to Mute or Kick participants.
- **Smart Grid Layout:** Dynamic video grid that adapts to the number of participants.
- **Live Chat:** Real-time text chat within the meeting room.
- **Visual Feedback:** Active speaker indicators, audio waves, and connection status.
- **Secure Signaling:** Socket.io based signaling server for robust connection establishment.

## Technologies Used
- **Frontend:** React, Vite, Tailwind CSS
- **Core:** WebRTC (Native API), Socket.io-client
- **Icons:** Lucide React, Google Material Symbols
- **Backend:** Node.js, Express, Socket.io (Signaling)

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
   - Use the bottom control bar to Mute/Unmute or Turn Camera On/Off.
   - Click "End" to leave the meeting.

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
