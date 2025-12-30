import { useEffect, useState, useRef } from 'react';

export function useAudioLevel(stream) {
    const [audioLevel, setAudioLevel] = useState(0);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!stream || !stream.getAudioTracks().length) {
            setAudioLevel(0);
            return;
        }

        // Initialize Audio Context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }

        const audioContext = audioContextRef.current;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        try {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            sourceRef.current = source;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVolume = () => {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;

                // Normalize roughly to 0-100 (average is usually low for speech)
                // 128 is half-scale usually for byte data but frequency data is 0-255 amplitude
                const normalized = Math.min(100, (average / 50) * 100);

                // Throttle updates purely for React performance if needed, but rAF is okay usually
                // Use a threshold to avoid noise flickering
                setAudioLevel(normalized > 5 ? normalized : 0);

                rafRef.current = requestAnimationFrame(updateVolume);
            };

            updateVolume();
        } catch (err) {
            console.error("Error setting up audio analysis:", err);
        }

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (sourceRef.current) sourceRef.current.disconnect();
            // Do not close AudioContext as it might be shared or re-used? use distinct for now.
            // Actually, keep it simple.
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        };
    }, [stream]);

    return audioLevel;
}
