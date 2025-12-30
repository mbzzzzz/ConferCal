import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { socket } from '../utils/socket';

export default function Chat({ roomId, userId, username, isOpen, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [hasUnread, setHasUnread] = useState(false);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setHasUnread(false);
        }
    }, [messages, isOpen]);

    useEffect(() => {
        const handleReceiveMessage = (payload) => {
            setMessages((prev) => [...prev, { ...payload, isLocal: false }]);
            if (!isOpen) {
                setHasUnread(true);
            }
        };

        socket.on('receive-message', handleReceiveMessage);

        return () => {
            socket.off('receive-message', handleReceiveMessage);
        };
    }, [isOpen]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            roomId,
            userId,
            username,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Emit to server
        socket.emit('send-message', messageData);

        // Add to local state immediately
        setMessages((prev) => [...prev, { ...messageData, isLocal: true }]);
        setNewMessage('');
    };

    if (!isOpen) {
        if (hasUnread) {
            return (
                <button
                    onClick={onClose} // Actually 'onOpen' in this context, but we toggle parent state
                    className="absolute bottom-24 right-6 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg z-50 animate-bounce transition-colors"
                    title="Unread Messages"
                >
                    <MessageSquare size={24} />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                </button>
            )
        }
        return null;
    }

    return (
        <div className="absolute right-0 top-16 bottom-0 w-full md:w-80 bg-background-dark/95 backdrop-blur-md border-l border-white/10 flex flex-col z-40 transition-transform duration-300">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-surface-dark">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" />
                    In-Call Messages
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        <p>No messages yet.</p>
                        <p>Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${msg.isLocal ? 'items-end' : 'items-start'}`}
                        >
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className={`text-xs font-bold ${msg.isLocal ? 'text-primary' : 'text-purple-400'}`}>
                                    {msg.isLocal ? 'You' : (msg.username || `User ${msg.userId.slice(0, 4)}`)}
                                </span>
                                <span className="text-[10px] text-gray-500">{msg.time}</span>
                            </div>
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.isLocal
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-surface-dark-lighter border border-white/10 text-gray-200 rounded-bl-none'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-surface-dark">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-1.5 p-1.5 bg-primary hover:bg-primary-hover disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full text-white transition-all shadow-lg"
                    >
                        <Send size={16} className={newMessage.trim() ? 'ml-0.5' : ''} />
                    </button>
                </div>
            </form>
        </div>
    );
}
