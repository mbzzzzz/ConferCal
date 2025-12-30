import { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Settings } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

export default function Lobby({
    username,
    stream,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    availableVideoDevices,
    availableAudioDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    switchVideoDevice,
    switchAudioDevice,
    onJoin
}) {
    const [localName, setLocalName] = useState(username || '');

    // Auto-update parent if needed, but for now we just pass it on join if we want to support name changing
    // Assuming name comes from session storage in parent, maybe we allow editing it here?

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 font-display">
            <div className="bg-surface-dark border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-4xl flex flex-col md:flex-row gap-8">

                {/* Preview Area */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="relative aspect-video bg-black/50 rounded-xl overflow-hidden border border-white/10 shadow-inner group">
                        {stream ? (
                            <VideoPlayer
                                stream={stream}
                                isLocal={true}
                                name={localName}
                                muted={true} // Always mute self in preview
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                Camera is off
                            </div>
                        )}

                        {/* Overlay Controls */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                            <button
                                onClick={toggleAudio}
                                className={`p-3 rounded-lg transition-all ${!isAudioEnabled ? 'bg-red-500/80 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                            >
                                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                            </button>
                            <button
                                onClick={toggleVideo}
                                className={`p-3 rounded-lg transition-all ${!isVideoEnabled ? 'bg-red-500/80 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                            >
                                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings & Join */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Ready to join?</h1>
                            <p className="text-gray-400">Check your settings before entering the meeting.</p>
                        </div>

                        {/* Name Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-400">Your Name</label>
                            <input
                                type="text"
                                value={localName}
                                onChange={(e) => setLocalName(e.target.value)}
                                className="w-full bg-black/20 text-white border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Device Selectors */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-400">Camera</label>
                                <div className="relative">
                                    <select
                                        value={selectedVideoDeviceId}
                                        onChange={(e) => switchVideoDevice(e.target.value)}
                                        className="w-full bg-black/20 text-white border border-white/10 rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-primary/50 transition-colors"
                                    >
                                        {availableVideoDevices.map(d => (
                                            <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${availableVideoDevices.indexOf(d) + 1}`}</option>
                                        ))}
                                    </select>
                                    <Settings className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-400">Microphone</label>
                                <div className="relative">
                                    <select
                                        value={selectedAudioDeviceId}
                                        onChange={(e) => switchAudioDevice(e.target.value)}
                                        className="w-full bg-black/20 text-white border border-white/10 rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-primary/50 transition-colors"
                                    >
                                        {availableAudioDevices.map(d => (
                                            <option key={d.deviceId} value={d.deviceId}>{d.label || `Mic ${availableAudioDevices.indexOf(d) + 1}`}</option>
                                        ))}
                                    </select>
                                    <Settings className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => onJoin(localName)}
                            disabled={!localName.trim()}
                            className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Join Meeting
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
