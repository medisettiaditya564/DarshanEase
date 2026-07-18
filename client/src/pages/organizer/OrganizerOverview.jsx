import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Users, Landmark, Calendar, DollarSign,
    Shield, CheckCircle, TrendingUp, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const OrganizerOverview = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/admin/stats');
            setStats(res.data.stats);
        } catch (err) {
            toast.error('Failed to load Temple insights');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="space-y-12 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="h-[400px] bg-white rounded-[40px]" />
                <div className="h-[400px] bg-white rounded-[40px]" />
            </div>
        </div>
    );

    if (!stats) return (
        <div className="flex items-center justify-center p-20 bg-white rounded-[40px] border border-cream-dark shadow-2xl">
            <p className="text-xl font-black text-brown/20 uppercase tracking-widest italic">Sacred data is currently unavailable</p>
        </div>
    );

    const cards = [
        { label: 'My Temples', value: stats.temples, icon: <Landmark className="text-primary" />, trend: '+1', color: 'bg-orange-50' },
        { label: 'Total Bookings', value: stats.bookings, icon: <Calendar className="text-blue-500" />, trend: '+12%', color: 'bg-blue-50' },
        { label: 'Confirmed Darshans', value: stats.confirmedBookings, icon: <CheckCircle className="text-green-500" />, trend: '+8%', color: 'bg-green-50' },
        { label: 'Temple Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp className="text-purple-500" />, trend: '+15%', color: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Scoped Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white p-8 rounded-[32px] border border-cream-dark shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} rounded-bl-[60px] -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform`} />
                        <div className="relative z-10 flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-2xl ${card.color} text-2xl`}>
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp size={10} /> {card.trend}
                            </span>
                        </div>
                        <h4 className="text-3xl font-black text-brown mb-1">{card.value}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brown/30">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Recent Bookings & Donations */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Recent Bookings */}
                    <div className="bg-white p-10 rounded-[40px] border border-cream-dark shadow-2xl shadow-primary/5">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-brown tracking-tighter">Recent Arrivals</h3>
                                <p className="text-brown/40 font-bold uppercase tracking-widest text-[10px] mt-1">Latest darshan registrations scoped to your authority</p>
                            </div>
                            <Link to="/organizer/bookings" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                                View Registry <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {stats.recentBookings?.length > 0 ? (
                                stats.recentBookings.map((booking, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-cream/20 rounded-3xl border border-transparent hover:border-primary/20 transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                {booking.user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-brown">{booking.user?.name}</p>
                                                <p className="text-[10px] text-brown/40 font-bold uppercase tracking-tighter">{booking.temple?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-brown">₹{booking.totalPrice}</p>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 text-xs font-bold text-brown/20 uppercase tracking-[0.2em]">No recent registrations recorded</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Donations */}
                    <div className="bg-white p-10 rounded-[40px] border border-cream-dark shadow-2xl shadow-primary/5">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-brown tracking-tighter">Sacred Contributions</h3>
                                <p className="text-brown/40 font-bold uppercase tracking-widest text-[10px] mt-1">Institutional donations received across your Temples</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {stats.recentDonations?.length > 0 ? (
                                stats.recentDonations.map((donation, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-cream/20 rounded-3xl border border-transparent hover:border-primary/20 transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                <DollarSign size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-brown">{donation.user?.name}</p>
                                                <p className="text-[10px] text-brown/40 font-bold uppercase tracking-tighter">{donation.temple?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-green-600">+ ₹{donation.amount}</p>
                                            <p className="text-[9px] text-brown/30 font-bold">{new Date(donation.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 text-xs font-bold text-brown/20 uppercase tracking-[0.2em]">No recent contributions recorded</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Settings Hub */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[40px] border border-cream-dark shadow-2xl shadow-primary/5">
                        <h3 className="text-2xl font-black text-brown tracking-tighter mb-8">Quick Settings</h3>

                        <div className="space-y-4">
                            <button onClick={() => navigate('/organizer/temples')} className="w-full p-6 bg-cream/30 rounded-3xl border border-cream-dark/50 flex items-center gap-5 group hover:bg-primary hover:border-primary transition-all">
                                <div className="p-4 bg-white rounded-2xl text-primary shadow-sm group-hover:text-primary transition-colors">
                                    <Shield size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-brown group-hover:text-white">Temple Lock</p>
                                    <p className="text-[10px] text-brown/40 font-bold group-hover:text-white/60">Toggle Visibility Status</p>
                                </div>
                            </button>

                            <button onClick={() => navigate('/organizer/slots')} className="w-full p-6 bg-cream/30 rounded-3xl border border-cream-dark/50 flex items-center gap-5 group hover:bg-primary hover:border-primary transition-all">
                                <div className="p-4 bg-white rounded-2xl text-primary shadow-sm group-hover:text-primary transition-colors">
                                    <Calendar size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-brown group-hover:text-white">Slot Control</p>
                                    <p className="text-[10px] text-brown/40 font-bold group-hover:text-white/60">Inventory & Pricing</p>
                                </div>
                            </button>

                            <div className="p-8 mt-10 bg-brown rounded-[32px] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 text-7xl text-white/5 font-black pointer-events-none group-hover:scale-110 transition-transform">ॐ</div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Support Gateway</p>
                                <h4 className="text-lg font-black leading-tight mb-6">Need Temple<br />Assistance?</h4>
                                <button className="w-full bg-white text-brown py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">
                                    Open Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerOverview;
