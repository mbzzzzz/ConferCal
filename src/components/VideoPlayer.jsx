import { useEffect, useRef } from 'react';
import { useAudioLevel } from '../hooks/useAudioLevel';

export default function VideoPlayer({ stream, isLocal = false, name = "User", ...props }) {
    const videoRef = useRef(null);
    const audioLevel = useAudioLevel(stream);
    const isSpeaking = audioLevel > 15; // Threshold

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className={`relative rounded-2xl overflow-hidden bg-gray-900 shadow-2xl group w-full h-full transition-all duration-300 border-2 ${isSpeaking ? 'border-primary shadow-[0_0_30px_rgba(127,19,236,0.5)] scale-[1.02] z-10' : 'border-white/5'}`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal || props.muted}
                className="w-full h-full object-cover"
                style={{ transform: isLocal ? 'scaleX(-1)' : 'none' }}
                {...props}
            />
            {/* Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

            {/* Label */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[18px] transition-colors duration-200 ${isSpeaking ? 'text-primary animate-pulse' : 'text-gray-400'}`}>
                        {props.muted ? 'mic_off' : 'mic'}
                    </span>
                    <span className="text-sm font-medium text-white">{name}</span>
                </div>
                {!isLocal && props.connectionState && props.connectionState !== 'connected' && (
                    <div className="bg-yellow-500/80 backdrop-blur-md px-2 py-1.5 rounded-lg text-xs font-bold text-black uppercase">
                        {props.connectionState}
                    </div>
                )}
            </div>
        </div>
    );
}
