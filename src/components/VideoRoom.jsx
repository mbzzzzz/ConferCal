import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useMediaStream } from '../hooks/useMediaStream';
import { useWebRTC } from '../hooks/useWebRTC';
import VideoPlayer from './VideoPlayer';
import Controls from './Controls';
import Chat from './Chat';
import SettingsModal from './SettingsModal';
import Lobby from './Lobby';
import { Loader2, AlertCircle, MicOff, UserX } from 'lucide-react';
import logo from '../assets/logo.png';
import { socket } from '../utils/socket'; // Import socket for moderation events

// ...

export default function VideoRoom() {
    const { roomId } = useParams();
    const [userId] = useState(uuidv4());
    const [username, setUsername] = useState(sessionStorage.getItem('confercal_username') || ''); // Default empty to force input if not found
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [mediaSkipped, setMediaSkipped] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeReactions, setActiveReactions] = useState([]); // Array of { id, userId, emoji }
    const [hasJoined, setHasJoined] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

    // Media Stream Hook
    const {
        stream,
        error: mediaError,
        isVideoEnabled,
        isAudioEnabled,
        toggleVideo,
        toggleAudio,
        videoDevices,
        audioDevices,
        selectedVideoDeviceId,
        selectedAudioDeviceId,
        switchVideoDevice,
        switchAudioDevice,
        setStream
    } = useMediaStream();

    // WebRTC Hook
    const {
        peers,
        isHost,
        toggleHand,
        endMeetingForAll: endMeetingSignal
    } = useWebRTC(roomId, userId, username, stream, hasJoined);

    const peersList = Object.entries(peers);
    const totalParticipants = peersList.length + 1;

    // Handlers
    const handleRaiseHand = () => {
        const newState = !isHandRaised;
        setIsHandRaised(newState);
        toggleHand(newState);
    };

    const handleScreenShare = async () => {
        if (isScreenSharing) {
            // Stop sharing - Revert to camera
            const constraints = {
                video: selectedVideoDeviceId ? { deviceId: { exact: selectedVideoDeviceId } } : true,
                audio: selectedAudioDeviceId ? { deviceId: { exact: selectedAudioDeviceId } } : true
            };
            try {
                const cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
                setStream(cameraStream);
                setIsScreenSharing(false);
            } catch (err) {
                console.error("Failed to revert to camera", err);
            }
        } else {
            // Start sharing
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });

                // Handle user clicking "Stop sharing" on system UI
                screenStream.getVideoTracks()[0].onended = () => {
                    // Only toggle if we are still marked as sharing
                    setIsScreenSharing(prev => {
                        if (prev) {
                            // Revert manually
                            // We can't call handleScreenShare easily due to closure, but we can trigger the revert logic
                            // For simplicity, reload or just let the user click the button again?
                            // Better: Just set state false, effect might need to handle stream revert?
                            // Simplest: User has to click the button in UI to restore camera.
                            return false;
                        }
                        return prev;
                    });
                };

                setStream(screenStream);
                setIsScreenSharing(true);
            } catch (err) {
                console.error("Error sharing screen", err);
            }
        }
    };

    const leaveRoom = () => {
        if (window.confirm("Leave the meeting?")) {
            window.location.href = '/';
        }
    };

    const endMeetingForAll = () => {
        if (window.confirm("End meeting for everyone?")) {
            endMeetingSignal();
        }
    };

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    // Reactions
    const handleReaction = (emoji) => {
        const id = Date.now();
        // Add locally
        setActiveReactions(prev => [...prev, { id, userId, emoji }]);
        // Send to others
        socket.emit('send-reaction', { roomId, userId, emoji });

        // Remove after 4s
        setTimeout(() => {
            setActiveReactions(prev => prev.filter(r => r.id !== id));
        }, 4000);
    };

    // Reaction Listener
    useEffect(() => {
        socket.on('receive-reaction', (payload) => {
            // payload: { roomId, userId, emoji }
            const id = Date.now() + Math.random(); // Unique ID for key
            setActiveReactions(prev => [...prev, { ...payload, id }]);

            setTimeout(() => {
                setActiveReactions(prev => prev.filter(r => r.id !== id));
            }, 4000);
        });

        return () => {
            socket.off('receive-reaction');
        };
    }, []);

    // Moderation
    const handleKickPeer = (targetUserId) => {
        if (window.confirm("Kick this user?")) {
            socket.emit('kick-user', { targetUserId, roomId });
            toast.success("User kicked successfully");
        }
    };

    const handleMutePeer = (targetUserId) => {
        socket.emit('mute-user', { targetUserId, roomId });
        toast.info("User muted");
    };

    // Recording Logic
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const handleToggleRecording = async () => {
        if (isRecording) {
            // Stop Recording
            mediaRecorder.stop();
            setIsRecording(false);
            toast.info("Recording saved");
        } else {
            // Start Recording
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: { mediaSource: "screen" },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100,
                    }
                });

                const recorder = new MediaRecorder(stream);
                const chunks = [];

                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `recording-${new Date().toISOString()}.webm`;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 100);

                    // Stop all tracks to clear the recording icon in browser tab
                    stream.getTracks().forEach(track => track.stop());
                };

                recorder.start();
                setMediaRecorder(recorder);
                setIsRecording(true);
                toast.success("Recording started");
            } catch (err) {
                console.error("Error starting recording:", err);
                toast.error("Failed to start recording");
            }
        }
    };

    useEffect(() => {
        const onKicked = () => {
            toast.error("You have been removed from the meeting by the host.");
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        };
        const onMuted = () => {
            if (isAudioEnabled) toggleAudio();
            toast.warning("You have been muted by the host.");
        };

        socket.on('kicked', onKicked);
        socket.on('muted-by-host', onMuted);
        return () => {
            socket.off('kicked', onKicked);
            socket.off('muted-by-host', onMuted);
        };
    }, [isAudioEnabled, toggleAudio]);

    return !hasJoined ? (
        <Lobby
            username={username}
            stream={stream}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            availableVideoDevices={videoDevices}
            availableAudioDevices={audioDevices}
            selectedVideoDeviceId={selectedVideoDeviceId}
            selectedAudioDeviceId={selectedAudioDeviceId}
            switchVideoDevice={switchVideoDevice}
            switchAudioDevice={switchAudioDevice}
            onJoin={(name) => {
                if (name) {
                    setUsername(name);
                    sessionStorage.setItem('confercal_username', name);
                }
                setHasJoined(true);
            }}
        />
    ) : (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col transition-colors duration-300">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/10 bg-background-dark z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-white">
                        <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-lg md:text-xl font-bold tracking-tight">ConferCal</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    {/* Move Live Indicator Here */}
                    <div className="flex items-center gap-2 bg-surface-dark px-2.5 py-1 rounded-full border border-white/5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] md:text-xs font-bold font-mono text-gray-300 uppercase tracking-wider">Live</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden p-2 text-gray-400 hover:text-white"
                        >
                            <span className="material-symbols-outlined text-[20px]">group</span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-xs font-bold text-white border border-white/20" title={username}>
                            {username.slice(0, 2).toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Video Stage */}
                <div className="flex-1 flex flex-col p-4 gap-4 relative bg-black/40 transition-all duration-300">

                    {/* Chat Component - Floating/Sidebar */}
                    <Chat
                        roomId={roomId}
                        userId={userId}
                        username={username}
                        isOpen={isChatOpen}
                        onClose={() => setIsChatOpen(false)}
                    />

                    {/* Settings Modal */}
                    <SettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                        videoDevices={videoDevices}
                        audioDevices={audioDevices}
                        selectedVideoDeviceId={selectedVideoDeviceId}
                        selectedAudioDeviceId={selectedAudioDeviceId}
                        switchVideoDevice={switchVideoDevice}
                        switchAudioDevice={switchAudioDevice}
                    />

                    {/* Main Grid Area (Remote Peers) */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-900 border border-white/5 shadow-2xl group flex items-center justify-center">
                        {peersList.length === 0 ? (
                            <div className="text-center">
                                <p className="text-gray-400 text-lg mb-2">Waiting for others to join...</p>
                                <p className="text-gray-600 text-sm">Share the link to invite participants</p>
                            </div>
                        ) : (
                            // Grid for Peers
                            <div className={`grid gap-2 md:gap-4 w-full h-full p-2 md:p-4 items-center justify-center ${peersList.length === 1 ? 'grid-cols-1' :
                                peersList.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                                    peersList.length <= 4 ? 'grid-cols-2' :
                                        'grid-cols-2 lg:grid-cols-3'
                                }`}>
                                {peersList.map(([peerId, peerData]) => (
                                    <div key={peerId} className="relative w-full h-full min-h-[300px] overflow-hidden rounded-xl bg-gray-800">
                                        <VideoPlayer
                                            stream={peerData.stream}
                                            isLocal={false}
                                            name={peerData.username || `User ${peerId.slice(0, 4)}`}
                                            connectionState={peerData.connectionState}
                                        />
                                        {/* Hand Raise Indicator */}
                                        {peerData.isHandRaised && (
                                            <div className="absolute top-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 animate-bounce z-10">
                                                <span className="material-symbols-outlined text-sm">hand_gesture</span>
                                                Raised Hand
                                            </div>
                                        )}
                                        {/* Reactions Overlay */}
                                        {activeReactions.filter(r => r.userId === peerId).map(reaction => (
                                            <div key={reaction.id} className="absolute bottom-16 left-1/2 -translate-x-1/2 text-6xl animate-float-up pointer-events-none z-20">
                                                {reaction.emoji}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Self View (PIP) */}
                    {stream && (
                        <div className={`absolute bottom-24 md:bottom-28 ${isChatOpen ? 'right-4 md:right-96' : 'right-4 md:right-8'} w-32 md:w-64 aspect-video bg-gray-800 rounded-xl overflow-hidden border border-white/10 shadow-xl z-30 group/pip hover:scale-105 transition-all duration-300`}>
                            <VideoPlayer
                                stream={stream}
                                isLocal={true}
                                name={`${username} (You)`}
                                muted={true}
                            />
                            {isHandRaised && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[8px] md:text-[10px] font-bold z-10">
                                    ✋ Raised
                                </div>
                            )}
                            {/* Reactions Overlay (Self) */}
                            {activeReactions.filter(r => r.userId === userId).map(reaction => (
                                <div key={reaction.id} className="absolute bottom-8 md:bottom-16 left-1/2 -translate-x-1/2 text-4xl md:text-6xl animate-float-up pointer-events-none z-20">
                                    {reaction.emoji}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Controls Container for Responsiveness */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center z-40 pointer-events-none">
                        <div className="pointer-events-auto scale-75 sm:scale-90 md:scale-100 origin-bottom">
                            <Controls
                                isAudioEnabled={isAudioEnabled}
                                isVideoEnabled={isVideoEnabled}
                                toggleAudio={toggleAudio}
                                toggleVideo={toggleVideo}
                                leaveRoom={leaveRoom}
                                roomId={roomId}
                                handleScreenShare={handleScreenShare}
                                isScreenSharing={isScreenSharing}
                                handleRaiseHand={handleRaiseHand}
                                isHandRaised={isHandRaised}
                                isHost={isHost}
                                endMeetingForAll={endMeetingForAll}
                                isChatOpen={isChatOpen}
                                toggleChat={toggleChat}
                                toggleSettings={() => setIsSettingsOpen(true)}
                                onReaction={handleReaction}
                                isRecording={isRecording}
                                toggleRecording={handleToggleRecording}
                            />
                        </div>
                    </div>
                </div>

                {/* Responsive Sidebar */}
                <aside className={`
                    fixed inset-y-0 right-0 w-80 bg-background-dark border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
                `}>
                    <div className="flex items-center justify-between border-b border-white/5 p-4 md:p-2">
                        <span className="text-sm font-bold text-white md:hidden">Participants</span>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <button className="hidden md:block flex-1 py-2 text-sm font-medium text-white bg-surface-dark-lighter rounded-lg transition-all shadow-sm">
                            Participants ({totalParticipants})
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                        <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">In this meeting</div>

                        {/* You */}
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 group cursor-pointer transition">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xs font-bold text-white relative">
                                    {username.slice(0, 2).toUpperCase()}
                                    {isHandRaised && <div className="absolute -top-1 -right-1 bg-yellow-500 w-3 h-3 rounded-full border border-black"></div>}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white">{username} (You)</span>
                                    {isScreenSharing && <span className="text-xs text-primary">Sharing Screen...</span>}
                                </div>
                            </div>
                            {isHandRaised && <span className="text-yellow-500 text-xs">✋</span>}
                        </div>

                        {/* Remote Peers List */}
                        {peersList.map(([peerId, peerData]) => (
                            <div key={peerId} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group cursor-pointer transition">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 relative">
                                        {(peerData.username || peerId).slice(0, 2).toUpperCase()}
                                        {peerData.isHandRaised && <div className="absolute -top-1 -right-1 bg-yellow-500 w-3 h-3 rounded-full border border-black"></div>}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-300">{peerData.username || `User ${peerId.slice(0, 4)}`}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 capitalize">{peerData.connectionState}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isHost && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleMutePeer(peerId); }}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                title="Mute Participant"
                                            >
                                                <MicOff size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleKickPeer(peerId); }}
                                                className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                                                title="Remove Participant"
                                            >
                                                <UserX size={14} />
                                            </button>
                                        </div>
                                    )}
                                    {peerData.isHandRaised && <span className="text-yellow-500 text-xs">✋</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
}
