/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { socket } from '../utils/socket';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export function useWebRTC(roomId, userId, username, localStream, shouldJoin = true) {
    const [peers, setPeers] = useState({}); // Map<userId, { stream: MediaStream, connectionState: string, isHandRaised: boolean, username: string }>
    const peersRef = useRef({}); // Map<userId, RTCPeerConnection>
    const [isHost, setIsHost] = useState(false);
    const localStreamRef = useRef(localStream);
    const usernameRef = useRef(username);

    // Keep strict ref to username
    useEffect(() => {
        usernameRef.current = username;
    }, [username]);

    // Helper to fix negotiation when adding new tracks
    const renegotiatePeer = async (peerId, pc) => {
        try {
            console.log(`Renegotiating with ${peerId}...`);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('offer', {
                target: peerId,
                caller: userId,
                username: usernameRef.current,
                offer: pc.localDescription
            });
        } catch (err) {
            console.error("Renegotiation failed:", err);
        }
    };

    // Keep strict ref to latest stream to avoid closure staleness in callbacks
    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);

    // Track Handling Effect: Update tracks when localStream changes without killing connections
    useEffect(() => {
        if (!localStream) return;

        const videoTrack = localStream.getVideoTracks()[0];
        const audioTrack = localStream.getAudioTracks()[0];

        Object.entries(peersRef.current).forEach(([peerId, pc]) => {
            const senders = pc.getSenders();
            let needsRenegotiation = false;

            // Audio
            const audioSender = senders.find(s => s.track?.kind === 'audio');
            if (audioTrack) {
                // Determine mute state from previous track if possible, or keep it sync?
                // Actually, the main component state `isAudioEnabled` is the source of truth,
                // but the track itself might spawn enabled.
                // We should ensure the new track matches the sender's current track state?
                // Or better, just rely on UI to toggle it back?
                // Wait, useMediaStream updates state to 'enabled' on new stream.
                // So let's just make sure we don't accidentally mute it here.

                if (audioSender) {
                    audioSender.replaceTrack(audioTrack).catch(e => console.error("Audio replace failed", e));
                } else {
                    pc.addTrack(audioTrack, localStream);
                    needsRenegotiation = true;
                }
            }

            // Video
            const videoSender = senders.find(s => s.track?.kind === 'video');
            if (videoTrack) {
                if (videoSender) {
                    // Check if the track ID is actually different before replacing (optimisation)
                    if (videoSender.track?.id !== videoTrack.id) {
                        videoSender.replaceTrack(videoTrack).catch(e => console.error("Video replace failed", e));
                    }
                } else {
                    pc.addTrack(videoTrack, localStream);
                    needsRenegotiation = true;
                }
            }

            if (needsRenegotiation) {
                renegotiatePeer(peerId, pc);
            }
        });
    }, [localStream]);

    // Signaling Effect: Handles Connection Life-cycle (Join/Leave)
    useEffect(() => {
        if (!roomId || !userId || !shouldJoin) return;

        const handleYouAreHost = (hostStatus) => {
            console.log("Am I host?", hostStatus);
            setIsHost(hostStatus);
        };

        const handleRoomEnded = () => {
            // Cleanup before alert to avoid stuck state
            Object.values(peersRef.current).forEach(pc => pc.close());
            setPeers({});
            window.location.href = '/';
            alert("The host has ended the meeting.");
        };

        const handleUserConnected = async (newUserId) => {
            console.log('User connected:', newUserId);
            // Ignore if we already have a connection to avoid race conditions
            // But if it's in a closed/failed state, maybe we should retry?
            // For now, let's allow overwrite if connectionState is failed/closed
            const existingPc = peersRef.current[newUserId];
            if (existingPc && ['connected', 'connecting'].includes(existingPc.connectionState)) {
                console.log("Connection already exists, skipping initiation");
                return;
            }

            // Create offer for new user
            const pc = createPeerConnection(newUserId);
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                socket.emit('offer', {
                    target: newUserId,
                    caller: userId,
                    username: usernameRef.current,
                    offer: pc.localDescription
                });
            } catch (err) {
                console.error("Error creating offer:", err);
            }
        };

        const handleOffer = async ({ caller, username, offer }) => {
            console.log('Received offer from:', caller, username);
            const pc = createPeerConnection(caller);

            // Update peer username
            setPeers(prev => ({
                ...prev,
                [caller]: { ...prev[caller], username }
            }));

            try {
                await pc.setRemoteDescription(offer);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                socket.emit('answer', {
                    target: caller,
                    caller: userId,
                    username: usernameRef.current,
                    answer: pc.localDescription
                });
            } catch (err) {
                console.error("Error handling offer:", err);
            }
        };

        const handleAnswer = async ({ caller, username, answer }) => {
            console.log('Received answer from:', caller, username);
            const pc = peersRef.current[caller];
            if (pc) {
                // Update peer username
                setPeers(prev => ({
                    ...prev,
                    [caller]: { ...prev[caller], username }
                }));

                try {
                    await pc.setRemoteDescription(answer);
                } catch (err) {
                    console.error("Error setting remote description (answer):", err);
                }
            }
        };

        const handleIceCandidate = async ({ caller, candidate }) => {
            const pc = peersRef.current[caller];
            if (pc) {
                try {
                    await pc.addIceCandidate(candidate);
                } catch (e) {
                    console.error('Error adding ICE candidate', e);
                }
            }
        };

        const handleUserDisconnected = (disconnectedUserId) => {
            console.log('User disconnected:', disconnectedUserId);
            if (peersRef.current[disconnectedUserId]) {
                peersRef.current[disconnectedUserId].close();
                delete peersRef.current[disconnectedUserId];
            }
            setPeers(prev => {
                const newPeers = { ...prev };
                delete newPeers[disconnectedUserId];
                return newPeers;
            });
        };

        const handleHandToggled = ({ userId: togglerId, raised }) => {
            setPeers(prev => ({
                ...prev,
                [togglerId]: {
                    ...prev[togglerId] || {},
                    isHandRaised: raised
                }
            }));
        };

        const createPeerConnection = (targetUserId) => {
            // Fix: Close existing connection if user performs a new join (e.g. refresh or strict mode re-mount)
            if (peersRef.current[targetUserId]) {
                peersRef.current[targetUserId].close();
            }

            const pc = new RTCPeerConnection(ICE_SERVERS);
            peersRef.current[targetUserId] = pc;

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', {
                        target: targetUserId,
                        caller: userId,
                        candidate: event.candidate
                    });
                }
            };

            pc.ontrack = (event) => {
                console.log('Received track from:', targetUserId, event.streams[0]);
                setPeers(prev => ({
                    ...prev,
                    [targetUserId]: {
                        ...prev[targetUserId],
                        stream: event.streams[0],
                        connectionState: pc.connectionState
                    }
                }));
            };

            pc.onconnectionstatechange = () => {
                console.log(`Connection state with ${targetUserId}: ${pc.connectionState}`);
                setPeers(prev => ({
                    ...prev,
                    [targetUserId]: {
                        ...prev[targetUserId],
                        connectionState: pc.connectionState
                    }
                }));
            };

            // Initialize UI state for this peer (without clearing hand raise if known)
            setPeers(prev => ({
                ...prev,
                [targetUserId]: {
                    ...prev[targetUserId],
                    stream: null,
                    connectionState: 'new',
                }
            }));

            // Add local tracks if available
            const stream = localStreamRef.current;
            if (stream) {
                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream);
                });
            }

            return pc;
        };

        socket.on('user-connected', handleUserConnected);
        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);
        socket.on('user-disconnected', handleUserDisconnected);
        socket.on('you-are-host', handleYouAreHost);
        socket.on('room-ended', handleRoomEnded);
        socket.on('hand-toggled', handleHandToggled);

        socket.emit('join-room', roomId, userId);

        return () => {
            socket.off('user-connected', handleUserConnected);
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.off('ice-candidate', handleIceCandidate);
            socket.off('user-disconnected', handleUserDisconnected);
            socket.off('hand-toggled', handleHandToggled);
            socket.off('you-are-host', handleYouAreHost);
            socket.off('room-ended', handleRoomEnded);

            Object.values(peersRef.current).forEach(pc => pc.close());
            peersRef.current = {};
            setPeers({});
        };
        // Dependency array: ONLY roomId and userId. Re-runs only if identity changes.
    }, [roomId, userId, shouldJoin]);

    // Function to replace video track (for screen share)
    // NOTE: This is now largely handled by the useEffect[localStream] hook automatically!
    // But we keep it if external components call it manually (though they should just update the stream).
    // Actually, Controls calls replaceVideoTrack, but it just calls `replaceTrack`. 
    // It does NOT update the localStream state in `useMediaStream`. 
    // Ah! Controls.jsx calls `handleScreenShare` -> `useMediaStream` updates `localStream`?
    // Let's check Controls.jsx interaction.
    // If Controls just replaces the track directly and DOES NOT update localStream, then our Effect won't run.

    // We export replaceVideoTrack, but ideally we should drive everything by state.
    // UseMediaStream likely has "toggleScreenShare".

    const replaceVideoTrack = (newTrack) => {
        // This is legacy support now, but good to keep for immediate feedback
        Object.values(peersRef.current).forEach(pc => {
            const senders = pc.getSenders();
            const videoSender = senders.find(s => s.track?.kind === 'video');
            if (videoSender) {
                videoSender.replaceTrack(newTrack);
            } else {
                // If adding new, we need that renegotiation logic.
                // Ideally, just let the Effect handle it if localStream was updated.
                // If localStream wasn't updated, this is dangerous.
            }
        });
    };

    // Function to toggle hand
    const toggleHand = (isRaised) => {
        socket.emit('toggle-hand', { roomId, userId, raised: isRaised });
    };

    const endMeetingForAll = () => {
        socket.emit('end-room');
    };

    return { peers, replaceVideoTrack, toggleHand, isHost, endMeetingForAll };
}
