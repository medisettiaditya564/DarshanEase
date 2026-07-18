import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout, isAuthorized } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/temples' },
        { name: 'Donations', path: '/donations' },
        ...(user ? [{ name: 'My Bookings', path: '/dashboard' }] : []),
        ...(isAuthorized ? [{
            name: 'Management',
            path: user?.role === 'ADMIN' ? '/admin' : '/organizer'
        }] : []),
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${scrolled || !isHome
                ? 'bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] py-4'
                : 'bg-transparent py-8'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center group">
                        <span className={`text-2xl md:text-3xl font-black font-poppins tracking-tighter transition-all duration-300 ${scrolled || !isHome ? 'text-brown' : 'text-white'
                            }`}>
                            Darshan<span className="text-primary">Ease</span>
                        </span>
                    </Link>

                    {/* Desktop Nav - Divine Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-primary relative group ${scrolled || !isHome ? 'text-brown/80' : 'text-white/80'
                                    }`}
                            >
                                {link.name}
                                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-6 pl-6 border-l border-current/10">
                                <Link
                                    to="/dashboard"
                                    className={`flex items-center gap-3 transition-colors ${scrolled || !isHome ? 'text-brown' : 'text-white'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                        <User size={18} className="text-primary" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 text-red-500/60 hover:text-red-500 hover:bg-red-50/10 rounded-full transition-all"
                                    title="Sign Out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95">
                                Access Portal
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu trigger */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-xl transition-colors ${scrolled || !isHome ? 'text-brown bg-brown/5' : 'text-white bg-white/10'}`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav - Glassmorphic Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-cream-dark/50 overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block py-4 text-xs font-black uppercase tracking-[0.2em] text-brown hover:text-primary transition-colors border-b border-cream-dark/30"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {!user ? (
                                <Link
                                    to="/login"
                                    className="block w-full text-center bg-primary text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mt-6"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Access Portal
                                </Link>
                            ) : (
                                <div className="pt-4 flex items-center justify-between">
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User size={18} className="text-primary" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-brown">{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="p-3 text-red-500 bg-red-50 rounded-xl"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
