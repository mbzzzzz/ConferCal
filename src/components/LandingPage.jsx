import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-white">
            <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-white/5 bg-background-light/80 dark:bg-background-dark/80">
                <div className="layout-container max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex items-center justify-center">
                                <img src={logo} alt="ConferCal Logo" className="w-full h-full object-contain" />
                            </div>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">ConferCal</h2>
                        </div>
                        <button
                            onClick={() => navigate('/setup')}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow flex flex-col items-center relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[300px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full opacity-60 mix-blend-screen blur-3xl"></div>
                </div>
                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-20 pb-12 lg:pt-32 lg:pb-24">
                    <div className="layout-content-container flex flex-col items-center max-w-[960px] mx-auto text-center gap-8">
                        <div className="flex flex-col gap-6 animate-fade-in-up">
                            <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                                Effortless <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Conference</span> Management.
                            </h1>
                            <h2 className="text-base md:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                Streamline your events, speakers, and schedules in one intuitive platform. Focus on the experience, not the logistics.
                            </h2>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                            <button
                                onClick={() => navigate('/setup')}
                                className="group flex items-center justify-center gap-2 min-w-[160px] h-12 px-6 rounded-lg bg-primary hover:bg-purple-600 text-white text-base font-bold shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02]"
                            >
                                <span>Get Started for Free</span>
                                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                        <div className="pt-8 flex flex-col items-center gap-4 opacity-60">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Trusted by event organizers worldwide</p>
                            <div className="flex gap-8 items-center justify-center grayscale opacity-70 dark:invert">
                                <div className="h-6 w-24 bg-current opacity-20 rounded"></div>
                                <div className="h-6 w-24 bg-current opacity-20 rounded"></div>
                                <div className="h-6 w-24 bg-current opacity-20 rounded"></div>
                                <div className="h-6 w-24 bg-current opacity-20 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-20 lg:pb-32">
                    <div className="layout-content-container max-w-[960px] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:border-primary/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart Scheduling</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Intuitive drag-and-drop tools to organize complex sessions, tracks, and breaks effortlessly.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:border-primary/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-[24px]">groups</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Speaker Hub</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Centralize speaker profiles, bios, and presentation materials in one collaborative space.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:border-primary/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Seamless Ticketing</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Integrate registration and payment flows directly into your event page with zero friction.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="w-full border-t border-slate-200 dark:border-white/5 py-12 bg-background-light dark:bg-background-dark relative z-10">
                <div className="layout-container max-w-[960px] mx-auto px-4 flex flex-col gap-8 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                        <a className="text-slate-500 dark:text-[#ab9db9] hover:text-primary dark:hover:text-white transition-colors text-sm font-medium" href="#">Privacy Policy</a>
                        <a className="text-slate-500 dark:text-[#ab9db9] hover:text-primary dark:hover:text-white transition-colors text-sm font-medium" href="#">Terms of Service</a>
                        <a className="text-slate-500 dark:text-[#ab9db9] hover:text-primary dark:hover:text-white transition-colors text-sm font-medium" href="#">Contact Us</a>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600">
                            <span className="material-symbols-outlined text-[18px]">event</span>
                            <span className="text-sm font-semibold">ConferCal</span>
                        </div>
                        <p className="text-slate-400 dark:text-slate-600 text-sm">© 2024 ConferCal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
