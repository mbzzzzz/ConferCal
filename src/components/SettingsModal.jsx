import { X, Video, Mic, Settings } from 'lucide-react';

export default function SettingsModal({
    isOpen,
    onClose,
    videoDevices,
    audioDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    switchVideoDevice,
    switchAudioDevice
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-surface-dark border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings size={20} className="text-primary" />
                        Device Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Video Settings */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <Video size={16} />
                            Camera
                        </label>
                        <div className="relative">
                            <select
                                value={selectedVideoDeviceId}
                                onChange={(e) => switchVideoDevice(e.target.value)}
                                className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
                            >
                                {videoDevices.map((device) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                                    </option>
                                ))}
                                {videoDevices.length === 0 && <option disabled>No cameras found</option>}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                ▼
                            </div>
                        </div>
                    </div>

                    {/* Audio Settings */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <Mic size={16} />
                            Microphone
                        </label>
                        <div className="relative">
                            <select
                                value={selectedAudioDeviceId}
                                onChange={(e) => switchAudioDevice(e.target.value)}
                                className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
                            >
                                {audioDevices.map((device) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
                                    </option>
                                ))}
                                {audioDevices.length === 0 && <option disabled>No microphones found</option>}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                ▼
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/20 border-t border-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
