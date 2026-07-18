import { motion } from 'framer-motion';
import { ChevronRight, Search, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Hero = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/temples?search=${search}&date=${date}`);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden font-poppins">
            {/* Background Image with Reference-based Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms] scale-105"
                style={{ backgroundImage: 'url("/hero-temple.png")' }}
            >
                {/* Premium Warm Overlay as seen in reference */}
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brown/20 to-brown/80 z-20" />
            </div>

            <div className="relative z-30 max-w-7xl mx-auto px-6 text-center w-full pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    {/* Reference Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white font-black uppercase tracking-[0.4em] text-[10px] md:text-xs mb-6 opacity-80"
                    >
                        Sacred Journeys Made Simple
                    </motion.p>

                    {/* Reference Main Title */}
                    <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-12 drop-shadow-2xl tracking-tighter max-w-5xl">
                        Book Your <span className="text-primary">Divine</span> <br /> Darshan With Ease
                    </h1>

                    {/* Reference Single-Row Search Hub */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="w-full max-w-4xl bg-white rounded-[24px] md:rounded-[60px] p-2 md:p-3 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-2 group border border-white/20"
                    >
                        {/* Location Search */}
                        <div className="flex-1 flex items-center px-6 md:px-10 gap-4 w-full h-16 md:h-20 md:border-r border-cream-dark/50">
                            <MapPin className="text-primary/60 group-focus-within:text-primary transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder="Search temples or cities..."
                                className="w-full bg-transparent border-none outline-none text-brown font-bold text-base md:text-lg placeholder:text-brown/30"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Date Picker */}
                        <div className="flex-1 flex items-center px-6 md:px-10 gap-4 w-full h-16 md:h-20">
                            <CalendarIcon className="text-primary/60" size={24} />
                            <input
                                type="text"
                                placeholder="dd - mm - yyyy"
                                className="w-full bg-transparent border-none outline-none text-brown font-bold text-base md:text-lg placeholder:text-brown/30"
                                onFocus={(e) => e.target.type = 'date'}
                                onBlur={(e) => e.target.type = 'text'}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {/* Reference Styled Search Button */}
                        <button
                            onClick={handleSearch}
                            className="bg-primary hover:bg-primary-dark text-white px-10 md:px-16 h-16 md:h-20 rounded-[20px] md:rounded-[50px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary/20"
                        >
                            <Search size={22} className="font-bold" />
                            <span className="font-black uppercase tracking-widest text-sm">Search</span>
                        </button>
                    </motion.div>

                    {/* Reference Stats Hub */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 mt-20 md:mt-32 w-full max-w-6xl"
                    >
                        <div className="flex flex-col items-center group">
                            <span className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 group-hover:text-primary transition-colors">500+</span>
                            <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Temples</span>
                        </div>
                        <div className="flex flex-col items-center group">
                            <span className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 group-hover:text-primary transition-colors">1M+</span>
                            <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Bookings</span>
                        </div>
                        <div className="flex flex-col items-center group">
                            <span className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 group-hover:text-primary transition-colors">50+</span>
                            <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Cities</span>
                        </div>
                        <div className="flex flex-col items-center group">
                            <span className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 group-hover:text-primary transition-colors">4.9★</span>
                            <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Rating</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Premium Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 opacity-30 hidden md:flex flex-col items-center"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
            </motion.div>
        </section>
    );
};

export default Hero;
