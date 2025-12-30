# ConferCall - WebRTC Video Conferencing

<div align="center">

**A Premium Peer-to-Peer Video Conferencing Solution**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.3.1-61dafb)](https://reactjs.org/)

[Features](#features) • [Installation](#setup-instructions) • [Usage](#how-to-use) • [Architecture](ARCHITECTURE.md) • [AI Usage](AI_USAGE.md)

</div>

---

## Overview

ConferCall is a modern, browser-native video conferencing application built with **WebRTC**, **React**, and **Socket.io**. It delivers high-quality, low-latency peer-to-peer communication without relying on third-party services, making it perfect for lightweight, secure video meetings.

### Why ConferCall?

- 🚀 **Zero Server Load**: Media streams directly between peers
- 🔒 **Privacy-First**: No data passes through external servers
- ⚡ **Low Latency**: Direct peer connections ensure minimal delay
- 📱 **Mobile Optimized**: Responsive design for all devices
- 🎨 **Modern UI**: Glassmorphic design with smooth animations

---

## Features

### Core Functionality

- **🎥 Real-Time Video & Audio**: Crystal-clear peer-to-peer communication
- **🌐 Peer-to-Peer Architecture**: Native WebRTC mesh topology for optimal quality
- **🔗 Simple Room Sharing**: Generate unique meeting links instantly
- **🎙️ Media Controls**: Toggle audio/video, screen sharing, and more
- **👥 Multi-Participant Support**: Optimized for 2-4 participants

### Premium Experience

- **✨ Pristine Landing Page**: Professional, animated entry with smooth transitions
- **🚪 Green Room (Lobby)**: Pre-join verification screen for camera/mic testing
- **📹 Local Screen Recording**: One-click meeting recording (video + system audio)
- **📱 Mobile Responsive**: Fully optimized UI with hideable participant sidebar
- **🎯 Host Moderation**: Real-time participant mute and kick capabilities
- **🖥️ Screen Sharing**: Share your screen or specific application windows
- **😊 Interactive Engagement**: Floating emoji reactions with animations
- **💬 Live Text Chat**: Real-time messaging alongside video
- **🎤 Visual Feedback**: Active speaker indicators and audio wave animations
- **📊 Connection Status**: Real-time connection quality indicators

### User Interface

- **Glassmorphism Design**: Modern, translucent UI elements
- **Smooth Animations**: Polished transitions and micro-interactions
- **Responsive Layout**: Adaptive grid system for all screen sizes
- **Intuitive Controls**: Easy-to-use floating control bar
- **Professional Aesthetics**: Clean, minimalist design language

---

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 with Hooks
- **Routing**: React Router DOM 6.20.0 (v6.x)
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React 0.469.0
- **Real-Time**: Socket.io Client 4.8.1
- **Utilities**: UUID 9.0.1, clsx, tailwind-merge, Sonner
- **Build Tool**: Vite 5.2.0 (v5.x)

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express
- **WebSocket**: Socket.io 4.8.1
- **Signaling**: Custom Socket.io handlers

### Communication Protocols
- **Media Streaming**: WebRTC (Native Browser API)
- **Signaling**: WebSocket (Socket.io)
- **ICE Servers**: Google STUN servers

---

## Project Structure

```text
confercall/
├── server/                  # Backend Signaling Server
│   ├── server.js           # Socket.io logic & moderation handlers
│   └── package.json        # Server dependencies
│
├── src/                     # Frontend Application
│   ├── assets/             # Images & global styles
│   │   └── index.css       # Global CSS with Tailwind directives
│   │
│   ├── components/         # React UI Components
│   │   ├── LandingPage.jsx      # Marketing entry point
│   │   ├── RoomSetup.jsx        # Room creation/join interface
│   │   ├── Lobby.jsx            # Pre-call device verification
│   │   ├── VideoRoom.jsx        # Main call container
│   │   ├── VideoPlayer.jsx      # Individual video renderer
│   │   └── Controls.jsx         # Call control interface
│   │
│   ├── hooks/              # Custom React Hooks
│   │   ├── useMediaStream.js    # Camera/mic management
│   │   └── useWebRTC.js         # Peer connection orchestration
│   │
│   ├── utils/              # Utility Functions
│   │   └── socket.js       # Socket.io configuration
│   │
│   ├── App.jsx             # Main app component & routing
│   └── main.jsx            # React entry point
│
├── public/                 # Static assets
├── ARCHITECTURE.md         # Detailed system design documentation
├── AI_USAGE.md            # AI tool contribution documentation
├── README.md              # This file
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite build configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

---

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes bundled with Node.js
- **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 15+, or Edge 90+

### Installation

Follow these steps to set up ConferCall locally:

#### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/mbzzzzz/ConferCall.git
cd ConferCall
```

#### 2. Install Frontend Dependencies

```bash
npm install
```

This installs all React dependencies including:
- react, react-dom, react-router-dom
- socket.io-client
- lucide-react
- tailwindcss and related tools
- vite

#### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

This installs the signaling server dependencies:
- express
- socket.io
- cors

#### 4. Start the Signaling Server

Open a terminal window and run:

```bash
cd server
node server.js
```

You should see:
```
✓ Signaling server running on port 5000
```

**Note**: Keep this terminal running throughout your session.

#### 5. Start the Frontend Development Server

Open a **second** terminal window and run:

```bash
npm run dev
```

You should see:
```
  VITE v6.0.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 6. Open the Application

Navigate to `http://localhost:5173` in your web browser.

---

## How to Use

### Creating a New Meeting

1. **Navigate to Homepage**
   - Open `http://localhost:5173` in your browser

2. **Create Instant Meeting**
   - Click the "Create Instant Meeting" button
   - A unique room ID will be automatically generated (UUID format)

3. **Grant Permissions**
   - When prompted, allow camera and microphone access
   - These permissions are required for video calling

4. **Enter the Lobby**
   - You'll see a preview of your camera feed
   - Enter your display name
   - Verify your camera and microphone are working
   - Click "Join Call" when ready

5. **You're In!**
   - You'll be redirected to your unique room (e.g., `/room/abc-123-xyz`)
   - Your personal meeting room is now active

### Joining an Existing Meeting

1. **Get the Meeting Link**
   - The host can share either:
     - The full URL: `http://localhost:5173/room/abc-123-xyz`
     - Just the Room ID: `abc-123-xyz`

2. **Enter the Meeting**
   - **Option A**: Click the full meeting link
   - **Option B**: Paste the Room ID on the homepage and click "Join"

3. **Setup and Join**
   - Grant camera/microphone permissions
   - Enter your name in the lobby
   - Click "Join Call"

4. **Connected!**
   - You'll see video feeds of all participants
   - Your video will appear to others

### In-Call Features

#### Control Bar (Bottom of Screen)

The floating control bar provides quick access to all call features:

| Button | Function | Description |
|--------|----------|-------------|
| 🎤 | **Mute/Unmute** | Toggle your microphone on/off |
| 📹 | **Video On/Off** | Toggle your camera on/off |
| 🖥️ | **Screen Share** | Share your screen or window |
| 📋 | **Copy Link** | Copy meeting URL to clipboard |
| ⏺️ | **Record** | Start/stop local recording |
| 📤 | **Leave Call** | Exit the meeting |

#### Host Controls (Host Only)

As the meeting host (first person in the room), you have additional powers:

- **🚫 Kick User**: Remove a participant from the call
- **🔇 Mute User**: Remotely mute a participant's microphone

#### Recording Feature

The local recording feature captures your entire meeting:

1. Click the **Record** button (⏺️) in the control bar
2. Select which screen/window to capture from the browser prompt
3. The recording includes:
   - Video from all participants
   - System audio (all voices)
4. Click **Stop Recording** when finished
5. The recording automatically downloads as a `.webm` file

**Note**: Recordings are saved locally on your device, not uploaded to any server.

### Ending a Call

- Click the **Leave Call** button (📤) in the control bar
- Or simply close your browser tab
- Other participants will be notified of your departure

---

## Dependencies

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0",
    "lucide-react": "^0.469.0",
    "socket.io-client": "^4.8.1",
    "uuid": "^9.0.1",
    "sonner": "^2.0.7",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.0",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0"
  }
}
```

### Backend Dependencies

```json
{
  "dependencies": {
    "express": "^5.2.1",
    "socket.io": "^4.8.3",
    "cors": "^2.8.5"
  }
}
```

---

## Browser Compatibility

ConferCall is compatible with all modern browsers that support WebRTC:

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Google Chrome | 90+ | ✅ Fully Supported |
| Mozilla Firefox | 88+ | ✅ Fully Supported |
| Safari | 15+ | ✅ Fully Supported |
| Microsoft Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Supported |
| Brave | 1.24+ | ✅ Supported |

**Mobile Browsers**:
- iOS Safari 15+
- Chrome Mobile 90+
- Samsung Internet 14+

---

## Known Limitations

### Performance Constraints

- **Mesh Topology Limitation**: Performance degrades with 5+ participants
  - Each peer maintains connections to all other peers
  - Bandwidth usage: N × (N-1) streams per participant
  - Recommended maximum: 4 concurrent participants
  - For larger meetings, consider implementing an SFU architecture

### Network Requirements

- **Public IP Visibility**: Direct peer connections require accessible network endpoints
- **NAT Traversal**: Most home networks work with included STUN servers
- **Symmetric NAT**: May require TURN servers for relay (not included)
- **Firewall**: Corporate firewalls may block WebRTC traffic

### Recording Constraints

- **Screen Recording**: Captures the selected screen/window via browser prompt
- **Local Storage**: Recordings saved to user's device only
- **Format**: Recordings are in WebM format (may need conversion for some players)
- **Audio**: System audio capture depends on browser/OS support

### Browser-Specific

- **Safari**: Limited support for some advanced WebRTC features
- **Mobile**: Performance varies based on device capabilities
- **Bandwidth**: Requires stable internet connection (minimum 1 Mbps per stream)

---

## Architecture

For detailed information about the system architecture, signaling flow, and component design, please refer to:

📖 **[ARCHITECTURE.md](ARCHITECTURE.md)**

Includes:
- High-level architecture diagrams
- Detailed signaling flow sequence diagrams
- Component architecture breakdown
- Custom hooks documentation
- Data flow explanations
- Security considerations
- Scalability analysis

---

## AI Development

This project was developed with assistance from AI tools. For transparency and documentation:

🤖 **[AI_USAGE.md](AI_USAGE.md)**

Includes:
- AI tools used (Google Gemini, Claude, etc.)
- Specific prompts and interactions
- Code generation breakdown by component
- Challenges faced and solutions
- Learning outcomes

---

## Contributing

Contributions are welcome! If you'd like to improve ConferCall:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint configuration provided)
- Write descriptive commit messages
- Update documentation for new features
- Test on multiple browsers before submitting

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 ConferCall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgments

- **WebRTC Community**: For excellent documentation and examples
- **Socket.io Team**: For the robust WebSocket library
- **React Team**: For the amazing UI framework
- **Tailwind CSS**: For utility-first styling
- **Google**: For providing free STUN servers

---

## Support

If you encounter issues or have questions:

1. Check the [Architecture Documentation](ARCHITECTURE.md)
2. Review [Known Limitations](#known-limitations)
3. Open an issue on GitHub
4. Check browser console for error messages

---

## Roadmap

Future enhancements planned:

- [ ] End-to-end encryption for signaling
- [ ] JWT-based room authentication
- [ ] SFU architecture for larger meetings (10+ participants)
- [ ] Persistent room links with database
- [ ] Waiting room feature
- [ ] Virtual backgrounds and filters
- [ ] Breakout rooms
- [ ] Meeting analytics dashboard
- [ ] Mobile native apps (React Native)
- [ ] Cloud recording storage option

---

<div align="center">

**Built with ❤️ using WebRTC, React, and Socket.io**

[Report Bug](https://github.com/mbzzzzz/ConferCal/issues) • [Request Feature](https://github.com/mbzzzzz/ConferCal/issues)

</div>