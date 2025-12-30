# AI Usage Documentation

## AI Tools Used

### Primary Tool: Google Gemini (Antigravity Agent)
- **Role:** Autonomous Coding Agent
- **Purpose:** Full stack implementation, code generation, error fixing, and documentation.

## Prompts Used

### 1. Initial Project Setup & Architecture
**Context:**
The user provided a comprehensive prompt with specific technical requirements (React, WebRTC, Tailwind) and visual templates (ConferCal).

**AI Action:**
- Analyzed the "MANDATORY DELIVERABLES CHECKLIST".
- Setup Vite + React project structure.
- Created Backend (Node/Socket.io) for "Option B - Signaling Server".
- Created Frontend architecture (Hooks + Components).

### 2. WebRTC Implementation
**Challenge:**
Implementing a Mesh P2P topology using raw WebRTC APIs (as requested) instead of libraries like `simple-peer`.

**AI Solution:**
- Created `useWebRTC` hook.
- Implemented the "Initiator" pattern where existing peers offer to the new joining peer to avoid collision.
- Manually handled `offer`, `answer`, and `ice-candidate` exchanges via Socket.io.
- Used `useRef` for `RTCPeerConnection` objects to maintain persistent connections without causing unnecessary React re-renders, while using `useState` for `MediaStreams` to trigger UI updates.

### 3. UI/UX Implementation
**Design:**
- Adapted the provided usage of "ConferCal" HTML/CSS templates.
- Converted HTML to React Components (`RoomSetup`, `VideoRoom`).
- Implemented "Glassmorphism" effect for the control bar (`backdrop-blur-xl`).
- Used `lucide-react` for consistent iconography.

## Code Generation Breakdown

| Component/File | AI Generated % | Notes |
|---|---|---|
| `server/server.js` | 100% | Standard Socket.io signaling pattern |
| `src/hooks/useWebRTC.js` | 100% | Custom robust Mesh topology logic |
| `src/components/VideoRoom.jsx` | 100% | Integrated logic + design |
| `src/components/RoomSetup.jsx` | 100% | Adapted from user's HTML prompt |
| `tailwind.config.js` | 100% | Configured for provided colors |
| `README.md` | 100% | Followed requested template |

## Challenges & Solutions

### Challenge 1: Local Media Feedback
**Issue:** When displaying the local video, users shouldn't hear themselves.
**Solution:** Added `muted={true}` to the local `VideoPlayer` instance but kept it unmuted for remote peers.

### Challenge 2: React State vs WebRTC Refs
**Issue:** `RTCPeerConnection` events (like `onicecandidate`) fire frequently. Storing PCs in state causes re-renders that break connections.
**Solution:** Used `useRef` to store PeerConnections and only stored the resulting `MediaStream` in `useState` to update the Grid.

## Learning Outcomes
- Raw WebRTC offers granular control but requires careful state management in React.
- Socket.io is an excellent lightweight solution for signaling in P2P apps.
- Separation of concerns (Media Hook vs Signaling Hook vs UI) makes the codebase maintainable.

## External AI Tools & Resources

### 1. Brainstorming & Prompt Engineering
- **Tool:** [Claude](https://claude.ai/share/72480243-2e4b-4d85-898e-dec489cb37b0)
- **Usage:** Used for initial brainstorming, refining ideas, and crafting precise technical prompts to guide the development process.

### 2. UI/UX Design
- **Tool:** [Google Stitch](https://stitch.withgoogle.com/projects/1513419219297212871)
- **Usage:** Generated high-fidelity screen mockups and HTML/CSS templates for the application's interface.

### 3. Visual Assets
- **Tool:** [Google Gemini](https://gemini.google.com/share/4de2389ddbfc)
- **Usage:** Created the clean and modern "ConferCal" logo used in the application header.

### 4. Development Environment
- **Tool:** Google Antigravity IDE
- **Usage:** The primary integrated development environment used for coding, debugging, and executing the project.
