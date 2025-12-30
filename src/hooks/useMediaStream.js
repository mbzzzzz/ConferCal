import { useState, useEffect, useCallback } from 'react';

export function useMediaStream() {
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    // Device Management
    const [videoDevices, setVideoDevices] = useState([]);
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState('');
    const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState('');

    // Fetch available devices
    const getDevices = useCallback(async () => {
        try {
            // Ensure permissions are granted by checking if we have a stream active, 
            // otherwise enumerateDevices might return empty labels.
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = devices.filter(device => device.kind === 'videoinput');
            const audioInputs = devices.filter(device => device.kind === 'audioinput');

            setVideoDevices(videoInputs);
            setAudioDevices(audioInputs);
        } catch (err) {
            console.error("Error enumerating devices:", err);
        }
    }, []);

    useEffect(() => {
        let currentStream = null;
        let isMounted = true;

        async function initStream() {
            try {
                if (!isMounted) return;

                // Basic constraints or specific deviceIds if selected
                const constraints = {
                    video: selectedVideoDeviceId ? { deviceId: { exact: selectedVideoDeviceId } } : true,
                    audio: selectedAudioDeviceId ? { deviceId: { exact: selectedAudioDeviceId } } : true
                };

                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

                if (isMounted) {
                    // Stop old tracks if we are switching (though this runs on selectedId change mostly)
                    if (stream) {
                        stream.getTracks().forEach(t => t.stop());
                    }

                    currentStream = mediaStream;
                    setStream(mediaStream);

                    // Update selection state to match the stream's active tracks if not yet set
                    const videoTrack = mediaStream.getVideoTracks()[0];
                    const audioTrack = mediaStream.getAudioTracks()[0];

                    if (videoTrack && !selectedVideoDeviceId) {
                        const settings = videoTrack.getSettings();
                        if (settings.deviceId) setSelectedVideoDeviceId(settings.deviceId);
                    }
                    if (audioTrack && !selectedAudioDeviceId) {
                        const settings = audioTrack.getSettings();
                        if (settings.deviceId) setSelectedAudioDeviceId(settings.deviceId);
                    }

                    // Get devices list (permission might be needed first to get labels)
                    getDevices();

                    // Update toggle states
                    // Update toggle states - respecting previous intent if possible?
                    // NOTE: User might expect device switch to reset to "On", or stay "Off".
                    // Standard behavior: Changing device usually turns it on for testing, OR keeps previous state.
                    // Let's keep previous state if it was explicitly off.

                    if (videoTrack) {
                        videoTrack.enabled = isVideoEnabled; // Apply current state
                    }
                    if (audioTrack) {
                        audioTrack.enabled = isAudioEnabled; // Apply current state
                    }
                } else {
                    mediaStream.getTracks().forEach(track => track.stop());
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error accessing media devices:", err);
                    setError(err);
                }
            }
        }

        initStream();

        // Listen for device changes (plug/unplug)
        navigator.mediaDevices.addEventListener('devicechange', getDevices);

        return () => {
            isMounted = false;
            navigator.mediaDevices.removeEventListener('devicechange', getDevices);
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [selectedVideoDeviceId, selectedAudioDeviceId]); // Re-run when selection changes

    const switchVideoDevice = (deviceId) => {
        setSelectedVideoDeviceId(deviceId);
    };

    const switchAudioDevice = (deviceId) => {
        setSelectedAudioDeviceId(deviceId);
    };

    const toggleVideo = useCallback(() => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    }, [stream]);

    const toggleAudio = useCallback(() => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    }, [stream]);

    // Watch for device list changes to handle unplugging
    useEffect(() => {
        if (selectedVideoDeviceId && videoDevices.length > 0) {
            const deviceExists = videoDevices.some(d => d.deviceId === selectedVideoDeviceId);
            if (!deviceExists) {
                console.log("Selected video device removed, reverting to default.");
                setSelectedVideoDeviceId('');
            }
        }

        if (selectedAudioDeviceId && audioDevices.length > 0) {
            const deviceExists = audioDevices.some(d => d.deviceId === selectedAudioDeviceId);
            if (!deviceExists) {
                console.log("Selected audio device removed, reverting to default.");
                setSelectedAudioDeviceId('');
            }
        }
    }, [videoDevices, audioDevices]); // Run only when device lists update

    return {
        stream,
        error,
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
        setStream // Expose for screen sharing
    };
}
