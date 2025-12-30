# Architecture Documentation

## System Overview
ConferCall uses a **Mesh Topology** (Peer-to-Peer) architecture. 
- **Signaling**: A centralized Node.js/Socket.io server facilitates the initial handshake (SDP Offer/Answer and ICE Candidates).
- **Media**: Video and Audio streams flow directly between peers (P2P) using WebRTC. No media passes through the server.
- **Frontend**: React application manages state, UI, and media streams.

## Architecture Diagram

### High-Level Architecture

```mermaid
graph TD
    UserA[User A Browser] <-->|WebRTC Media| UserB[User B Browser]
    UserA <-->|WebRTC Media| UserC[User C Browser]
    UserB <-->|WebRTC Media| UserC
    
    UserA -.->|Socket.io Signaling| Server[Signaling Server (Node.js)]
    UserB -.->|Socket.io Signaling| Server
    UserC -.->|Socket.io Signaling| Server
```

### Signaling Flow (Mesh Connection)

Diagram showing User B joining a room with User A.

```mermaid
sequenceDiagram
    participant B as User B (Joiner)
    participant S as Signaling Server
    participant A as User A (Host)
    
    Note over B: User B open /room/123
    B->>S: join-room("123", "UserB")
    S->>A: user-connected("UserB")
    
    Note over A: Received 'user-connected'
    A->>A: Create PeerConnection for B
    A->>A: Add Local Tracks
    A->>A: Create Offer
    A->>S: offer(target="UserB", sdp)
    S->>B: offer(caller="UserA", sdp)
    
    Note over B: Received 'offer'
    B->>B: Create PeerConnection for A
    B->>B: Set Remote Description (Offer)
    B->>B: Add Local Tracks
    B->>B: Create Answer
    B->>S: answer(target="UserA", sdp)
    S->>A: answer(caller="UserB", sdp)
    
    Note over A: Received 'answer'
    A->>A: Set Remote Description (Answer)
    
    par ICE Candidate Exchange
        Loop A to B
            A->>S: ice-candidate
            S->>B: ice-candidate
            B->>B: Add Candidate
        End
        Loop B to A
            B->>S: ice-candidate
            S->>A: ice-candidate
            A->>A: Add Candidate
        End
    end
    
    Note over A,B: P2P Connection Established
```

## Component Architecture

### Frontend Components

1.  **App.jsx**
    - Router setup.
    - Manages navigation between RoomSetup and VideoRoom.

2.  **RoomSetup.jsx**
    - Landing page.
    - Generates UUID for new rooms.
    - Input form for joining existing rooms.

3.  **VideoRoom.jsx**
    - Main container for the call.
    - **Manages Lobby State**: Conditionally renders `Lobby` or the Call Interface.
    - Initializes `useMediaStream` (Camera/Mic).
    - Initializes `useWebRTC` (Socket + PeerConnections).
    - Renders grid of `VideoPlayer` components.
    - Renders `Controls`.

4.  **Lobby.jsx**
    - Pre-join verification screen.
    - Allows device selection and preview.
    - Controls "Join" trigger to initialize WebRTC.

5.  **LandingPage.jsx**
    - Marketing-style entry point.
    - Routes user to Setup/Join.

6.  **VideoPlayer.jsx**
    - Displays `<video>` element.
    - Handles "Mirror" effect for local user.
    - Shows user labels and mute status.

7.  **Controls.jsx**
    - Floating bar with action buttons.
    - Mute/Unmute, Video On/Off, Copy Link, End Call.
    - **Host Controls**: Kick/Mute buttons for host.
    - **Recording Control**: Trigger for local screen recording using `MediaRecorder`.
    - **Reactive Layout**: Scale-aware container for mobile usability.

### Custom Hooks

1.  **useMediaStream.js**
    - Wrapper around `navigator.mediaDevices.getUserMedia`.
    - Manages local `MediaStream` state.
    - Provides `toggleAudio` and `toggleVideo` functions to enable/disable tracks.

2.  **useWebRTC.js**
    - **Core Logic Hub**.
    - Connects to Socket.io.
    - Manages a dictionary of `RTCPeerConnection` objects (`peersRef`).
    - Handles `offer`, `answer`, `ice-candidate` events.
    - **State Management**: Handles `shouldJoin` flag to delay connection until Lobby is passed.
    - Exposes `peers` state (dictionary of remote `MediaStreams`) to the UI.

## Data Flow

1.  **Initialization**:
    - `VideoRoom` mounts -> Request Cam/Mic (`useMediaStream`).
    - Stream obtained -> `useWebRTC` mounts.
    - Socket connects -> `join-room`.

2.  **New Peer**:
    - `user-connected` event received.
    - `useWebRTC` creates new PC, adds local stream, sends Offer.

3.  **Media Rendering**:
    - Renders new `VideoPlayer` with the remote stream.

4.  **Local Recording**:
    - `Controls` triggers `handleToggleRecording`.
    - Captures "Screen + System Audio" via `getDisplayMedia`.
    - `MediaRecorder` processes chunks in memory.
    - `onstop` creates a Blob and triggers an programmatic `<a>.click()` for auto-download.

## Security Considerations

- **HTTPS**: WebRTC requires HTTPS (or localhost) to access media devices. In production, SSL is mandatory.
- **Signaling**: Socket.io logic is currently open; anyone with the Room ID can join. Production should implement auth tokens.
- **Media**: WebRTC streams are encrypted by default (DTLS/SRTP).

## Scalability
- **Mesh Topology**: Good for 2-4 users. Bandwidth usage increases as `N * (N-1)`.
- **Future Scale**: For >5 users, a SFU (Selective Forwarding Unit) like Mediasoup or Jitsi is recommended to reduce client bandwidth load.

## Appendix: High-Fidelity Diagram Generation Prompt

To generate a professional visual representation of this architecture (e.g., using Mermaid or a high-end diagramming tool), use the following detailed prompt:

> **System Architecture Prompt (ConferCal)**
> 
> Act as a Senior Solutions Architect. Generate a detailed Mermaid.js sequence diagram that illustrates the "Join and Connect" flow for my P2P Video Conferencing app.
> 
> **Scenario:** User B joins a room where User A is already present.
> 
> **Key entities to include:**
> 1. **User B (Joiner Window)**: Needs to show the transition from `LandingPage` -> `Lobby` (Media Preview) -> `VideoRoom`.
> 2. **User A (Existing Host)**: Already in the `VideoRoom`.
> 3. **Signaling Server (Socket.io)**: The message relay hub.
> 4. **Display Media API**: Used for the recording process.
> 
> **The flow MUST cover:**
> - **Lobby Phase**: User B verifies Cam/Mic and sets Username locally.
> - **Join Event**: User B clicks "Join", triggering `join-room` to the Signaling Server.
> - **Discovery**: Server notifies User A about User B's arrival.
> - **SDP Handshake**: User A (Initiator) creates an RTC Offer, relays it via Server to User B. User B sends back an RTC Answer.
> - **ICE Candidate Trickle**: Both peers exchange ICE candidates concurrently through the server.
> - **P2P Established**: Show direct media flow between User A and User B.
> - **Recording Event**: Show User A triggering a local recording via `getDisplayMedia` and saving it to a local file.
> 
> **Styling requirements**: Use modern colors, clear activation boxes, and descriptive notes for each WebRTC event (`setLocalDescription`, `setRemoteDescription`, etc.). Ensure the distinction between Signaling messages (dashed lines) and P2P Media (thick lines) is clear.
