import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Landmark, Calendar, Settings,
    LogOut, Menu, X, Bell, User, Heart, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const OrganizerLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/api/notifications');
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error('Failed to fetch notifications');
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark as read');
        }
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/organizer' },
        { icon: <Landmark size={20} />, label: 'My Temples', path: '/organizer/temples' },
        { icon: <Clock size={20} />, label: 'Managed Slots', path: '/organizer/slots' },
        { icon: <Heart size={20} />, label: 'Donation Registry', path: '/organizer/donations' },
        { icon: <Calendar size={20} />, label: 'Booking Manager', path: '/organizer/bookings' },
        { icon: <Heart size={20} />, label: 'Analytics', path: '/organizer/analytics' },
        { icon: <User size={20} />, label: 'Account Setting', path: '/organizer/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex font-poppins text-brown">
            {/* Sidebar - Fixed/Sticky */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-24'} bg-gradient-to-b from-[#FF9933] to-[#FFB347] text-white transition-all duration-300 flex flex-col h-screen sticky top-0 shadow-[4px_0_24px_rgba(255,153,51,0.2)] z-50`}>
                <div className="p-8 flex items-center justify-between border-b border-white/20">
                    {isSidebarOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter drop-shadow-md">DarshanEase</span>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/90">Temple Control</span>
                        </motion.div>
                    )}
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <nav className="flex-grow py-10 px-4 space-y-3">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative ${location.pathname === item.path
                                ? 'bg-white text-[#FF9933] shadow-xl shadow-black/10 scale-[1.02]'
                                : 'hover:bg-white/10 text-white/80 hover:text-white'
                                }`}
                        >
                            <div className={`${location.pathname === item.path ? 'text-[#FF9933]' : 'group-hover:scale-110'} transition-transform`}>
                                {item.icon}
                            </div>
                            {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>}
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-6 px-4 py-2 bg-brown text-white text-[10px] font-bold rounded-lg shadow-2xl uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/20">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-4 w-full rounded-2xl hover:bg-white/20 text-white transition-all group"
                    >
                        <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-24 bg-white border-b border-cream-dark/30 px-10 flex items-center justify-between z-40 shadow-sm relative">
                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex items-center bg-cream/50 px-5 py-3 rounded-2xl border border-cream-dark/30 w-96 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Menu size={18} className="text-brown/30 group-focus-within:text-primary" />
                            <input type="text" placeholder="Search bookings, temples..." className="bg-transparent border-none outline-none ml-3 text-sm w-full placeholder:text-brown/20" />
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-3 rounded-2xl transition-all ${showNotifications ? 'bg-primary/10 text-primary' : 'text-brown/40 hover:bg-cream'}`}
                            >
                                <Bell size={22} />
                                {notifications.some(n => !n.isRead) && (
                                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-cream-dark overflow-hidden z-50 font-poppins animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="p-6 border-b border-cream bg-cream/20 flex justify-between items-center">
                                        <h4 className="font-bold text-brown uppercase tracking-widest text-xs">Temple Alerts</h4>
                                        <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">{notifications.filter(n => !n.isRead).length} New</span>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <div
                                                    key={n._id}
                                                    onClick={() => !n.isRead && markAsRead(n._id)}
                                                    className={`p-5 border-b border-cream hover:bg-cream/30 transition-colors cursor-pointer group ${!n.isRead ? 'bg-primary/5' : ''}`}
                                                >
                                                    <div className="flex gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold ${!n.isRead ? 'bg-primary text-white' : 'bg-cream text-brown/40'}`}>
                                                            {n.type === 'BOOKING' ? 'B' : 'ॐ'}
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-black transition-colors ${!n.isRead ? 'text-brown' : 'text-brown/60'}`}>{n.title}</p>
                                                            <p className="text-xs text-brown/40 mt-1 line-clamp-2">{n.message}</p>
                                                            <p className="text-[9px] text-primary/60 font-black mt-2 uppercase tracking-tighter">
                                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center">
                                                <p className="text-xs font-bold text-brown/20 uppercase tracking-widest">No Temple Events</p>
                                            </div>
                                        )}
                                    </div>
                                    <button className="w-full p-4 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors">Archive All</button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pl-8 border-l border-cream-dark">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-brown">{user?.name}</p>
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Temple Manager</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-tr from-primary to-orange-400 rounded-2xl shadow-lg flex items-center justify-center text-white border-2 border-white p-0.5">
                                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-primary overflow-hidden">
                                    <User size={28} />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto p-12 bg-[#FDFCFB] custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default OrganizerLayout;
