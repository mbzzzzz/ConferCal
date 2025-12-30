import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import logo from '../assets/logo.png';
import { User, Video, Users, ArrowRight, LogIn } from 'lucide-react'; // Assuming we can use Lucide icons for consistency

export default function RoomSetup() {
    const navigate = useNavigate();
    const [joinId, setJoinId] = useState('');
    const [username, setUsername] = useState('');
    const [createUsername, setCreateUsername] = useState(''); // Separate state for create section
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
        // Load saved username if any
        const saved = sessionStorage.getItem('confercal_username');
        if (saved) {
            setUsername(saved);
            setCreateUsername(saved);
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const createRoom = (e) => {
        e.preventDefault();
        if (!createUsername.trim()) return;

        const id = uuidv4();
        sessionStorage.setItem('confercal_username', createUsername.trim());
        navigate(`/room/${id}`);
    };

    const joinRoom = (e) => {
        e.preventDefault();
        const trimmedId = joinId.trim();
        const trimmedUsername = username.trim();

        if (!trimmedId || !trimmedUsername) return;

        sessionStorage.setItem('confercal_username', trimmedUsername);

        // Check if input is a URL and extract the last part
        if (trimmedId.includes('/room/')) {
            const parts = trimmedId.split('/room/');
            const roomIdFromUrl = parts[1].split(/[?#]/)[0]; // Handle potential queries or hashes
            if (roomIdFromUrl) {
                navigate(`/room/${roomIdFromUrl}`);
                return;
            }
        }

        // Default case: assume it is just the ID
        navigate(`/room/${trimmedId}`);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans antialiased min-h-screen flex flex-col transition-colors duration-300 selection:bg-primary/30 selection:text-primary">
            {/* Nav */}
            <nav className="w-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-xl border border-primary/10 shadow-sm">
                        <img src={logo} alt="ConferCal Logo" className="w-6 h-6 object-contain" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-display">ConferCal</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        aria-label="Toggle Dark Mode"
                        className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        {darkMode ? (
                            <span className="material-symbols-outlined block text-[20px]">light_mode</span>
                        ) : (
                            <span className="material-symbols-outlined block text-[20px]">dark_mode</span>
                        )}
                    </button>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse-slow delay-1000"></div>
                </div>

                <div className="text-center mb-16 animate-fade-in-up max-w-3xl mx-auto">
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6 font-display leading-[1.1]">
                        Video calls <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">simplified.</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Connect with your team instantly in high-definition. No downloads required—just create a room and share the link.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
                    {/* New Meeting Card */}
                    <div className="group relative bg-white dark:bg-card-dark rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 dark:border-white/10 p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                            <Video size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-display">New Meeting</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 flex-grow leading-relaxed">
                            Start a secure conference instantly. You'll get a unique link to share with others.
                        </p>

                        <form onSubmit={createRoom} className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={createUsername}
                                    onChange={(e) => setCreateUsername(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!createUsername.trim()}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <span>Start Instant Meeting</span>
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Join Meeting Card */}
                    <div className="group relative bg-white dark:bg-card-dark rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 dark:border-white/10 p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                            <Users size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-display">Join Meeting</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                            Have a room code? Enter it below along with your name to jump into the conversation.
                        </p>

                        <form onSubmit={joinRoom} className="mt-auto space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 text-[20px]">keyboard</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Room ID"
                                    value={joinId}
                                    onChange={(e) => setJoinId(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!joinId.trim() || !username.trim()}
                                className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Join Room</span>
                                <LogIn size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-500">
                    <p>By joining, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
                </div>
            </main>
        </div>
    );
}
