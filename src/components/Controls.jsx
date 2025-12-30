import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, Mail, Link as LinkIcon, Monitor, Hand, MessageSquare, Settings, Smile, Disc, StopCircle } from 'lucide-react';
import { useState } from 'react';

export default function Controls({
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    leaveRoom,
    roomId,
    handleScreenShare,
    isScreenSharing,
    handleRaiseHand,
    isHandRaised,
    isHost,
    endMeetingForAll,
    isChatOpen,
    toggleChat,
    toggleSettings,
    onReaction,
    isRecording,
    toggleRecording
}) {
    const [copied, setCopied] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const reactions = ['❤️', '😂', '👏', '👍', '🎉'];

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-surface-dark-lighter/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl z-20 transition-all duration-300">
            {/* Audio Toggle */}
            <button
                onClick={toggleAudio}
                className={`group p-3 rounded-xl transition relative ${!isAudioEnabled ? 'bg-red-500/20 text-red-500' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                title={isAudioEnabled ? "Mute" : "Unmute"}
            >
                {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {isAudioEnabled ? "Mute" : "Unmute"}
                </span>
            </button>

            {/* Video Toggle */}
            <button
                onClick={toggleVideo}
                className={`group p-3 rounded-xl transition relative ${isVideoEnabled ? 'bg-primary text-white shadow-[0_0_15px_rgba(127,19,236,0.5)]' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
            >
                {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
                </span>
            </button>

            {/* Screen Share */}
            <button
                onClick={handleScreenShare}
                className={`group p-3 rounded-xl transition relative ${isScreenSharing ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
            >
                <Monitor size={24} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                </span>
            </button>

            {/* Raise Hand */}
            <button
                onClick={handleRaiseHand}
                className={`group p-3 rounded-xl transition relative ${isHandRaised ? 'bg-yellow-500 text-black' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
            >
                <Hand size={24} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {isHandRaised ? "Lower Hand" : "Raise Hand"}
                </span>
            </button>

            {/* Reactions */}
            <div className="relative">
                {showReactions && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-surface-dark border border-white/10 p-2 rounded-xl flex gap-1 shadow-xl animate-fade-in-up">
                        {reactions.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => {
                                    onReaction(emoji);
                                    setShowReactions(false);
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg text-xl transition hover:scale-110 active:scale-95"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => setShowReactions(!showReactions)}
                    className={`group p-3 rounded-xl transition relative ${showReactions ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                    title="Reactions"
                >
                    <Smile size={24} />
                </button>
            </div>

            {/* Chat Toggle */}
            <button
                onClick={toggleChat}
                className={`group p-3 rounded-xl transition relative ${isChatOpen ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                title={isChatOpen ? "Close Chat" : "Open Chat"}
            >
                <MessageSquare size={24} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {isChatOpen ? "Close Chat" : "Open Chat"}
                </span>
            </button>

            {/* Recording Toggle */}
            {toggleRecording && (
                <button
                    onClick={toggleRecording}
                    className={`group p-3 rounded-xl transition relative ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                    title={isRecording ? "Stop Recording" : "Record Meeting"}
                >
                    {isRecording ? <StopCircle size={24} /> : <Disc size={24} />}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                        {isRecording ? "Stop Recording" : "Record Meeting"}
                    </span>
                </button>
            )}

            {/* Settings */}
            <button
                onClick={toggleSettings}
                className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition relative"
                title="Settings"
            >
                <Settings size={24} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    Settings
                </span>
            </button>

            {/* Copy Link */}
            <button
                onClick={copyLink}
                className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white text-gray-300 transition relative"
                title="Copy Meeting Link"
            >
                {copied ? <span className="text-green-400 font-bold text-sm">✓</span> : <LinkIcon size={24} />}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {copied ? "Copied!" : "Copy Link"}
                </span>
            </button>

            {/* Email Invite */}
            <a
                href={`mailto:?subject=Join my ConferCal Meeting&body=Join my video conference here: ${window.location.href}`}
                className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white text-gray-300 transition relative"
                title="Share via Email"
            >
                <Mail size={24} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    Share Link
                </span>
            </a>

            <div className="w-px h-8 bg-white/10 mx-1"></div>

            {/* End Call / Leave */}
            <button
                onClick={isHost ? endMeetingForAll : leaveRoom}
                className={`group flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 border ${isHost
                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-lg shadow-red-900/50'
                    : 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20'
                    }`}
                title={isHost ? "End Meeting for Everyone" : "Leave Meeting"}
            >
                <PhoneOff size={22} />
                <span className="text-sm font-bold min-w-[30px]">
                    {isHost ? "End" : "Leave"}
                </span>
            </button>
        </div>
    );
}
