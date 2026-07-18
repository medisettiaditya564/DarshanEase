import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Calendar, MapPin, Clock, CreditCard, Download,
    User as UserIcon, Heart, CheckCircle, XCircle, Mail, Landmark
} from 'lucide-react';
import { motion } from 'framer-motion';
import { generateTicketPDF } from '../utils/generateTicketPDF';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bRes, dRes] = await Promise.all([
                axios.get('/api/bookings/my'),
                axios.get('/api/donations/my')
            ]);
            setBookings(bRes.data.bookings);
            setDonations(dRes.data.donations);
        } catch (err) {
            console.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this darshan?')) return;
        try {
            await axios.put(`/api/bookings/${id}/cancel`);
            fetchData();
        } catch (err) {
            console.error('Failed to cancel booking');
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-[#FDFCFB]">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brown/40">Synchronizing Your Records</span>
        </div>
    );

    return (
        <div className="pt-40 pb-32 bg-[#FDFCFB] min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Immersive Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-12 rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] mb-16 border border-cream-dark/50 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                        <UserIcon size={200} />
                    </div>

                    <div className="relative">
                        <div className="h-32 w-32 bg-brown rounded-[40px] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-brown/20 z-10">
                            {user?.name?.[0]}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                            <CheckCircle size={16} />
                        </div>
                    </div>

                    <div className="text-center md:text-left z-10 flex-grow space-y-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Welcome Back</span>
                            <h1 className="text-5xl font-black text-brown tracking-tighter">{user?.name}</h1>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-brown/40">
                            <span className="flex items-center gap-3 bg-cream/50 px-4 py-2 rounded-xl border border-cream-dark/30">
                                <Mail size={14} className="text-primary" /> {user?.email}
                            </span>
                            <span className="flex items-center gap-3 bg-cream/50 px-4 py-2 rounded-xl border border-cream-dark/30">
                                <Heart size={14} className="text-primary" /> {user?.role} Access
                            </span>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <button className="bg-brown hover:bg-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-brown/10">
                            Edit Identity
                        </button>
                    </div>
                </motion.div>

                {/* Premium Navigation */}
                <div className="flex space-x-12 mb-12 border-b border-cream-dark/50 overflow-x-auto custom-scrollbar pb-1">
                    {[
                        { id: 'bookings', label: 'My Bookings', count: bookings.length },
                        { id: 'donations', label: 'My Donations', count: donations.length },
                        { id: 'profile', label: 'Personal Hub', count: null }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-primary' : 'text-brown/30 hover:text-brown'
                                }`}
                        >
                            {tab.label} {tab.count !== null && <span className="ml-2 opacity-40">[{tab.count}]</span>}
                            {activeTab === tab.id && (
                                <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* High-Fidelity Content Hub */}
                <div className="space-y-8">
                    {activeTab === 'bookings' && (
                        bookings.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {bookings.map((booking) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={booking._id}
                                        className="bg-white group p-8 rounded-[40px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-black/5 border border-cream-dark/50 transition-all flex flex-col md:flex-row items-center gap-8"
                                    >
                                        <div className="h-24 w-24 rounded-[30px] overflow-hidden shadow-xl shrink-0">
                                            <img src={booking.temple.images[0]} alt={booking.temple.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                                        </div>

                                        <div className="flex-grow text-center md:text-left space-y-3">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Temple Entrance</span>
                                                <h4 className="text-2xl font-black text-brown tracking-tighter">{booking.temple.name}</h4>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-brown/40">
                                                <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(booking.visitDate).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {booking.visitTime}</span>
                                                <span className="hidden md:block opacity-20">|</span>
                                                <span className="text-primary/60">ID: {booking.bookingRef}</span>
                                            </div>
                                        </div>

                                        <div className="text-center md:text-right shrink-0 px-8 border-x border-cream-dark/50 space-y-1">
                                            <p className="text-3xl font-black text-brown tracking-tighter">₹{booking.totalAmount}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-brown/30">{booking.tickets} Devotees</p>
                                        </div>

                                        <div className="shrink-0 flex items-center gap-4">
                                            {booking.status === 'CONFIRMED' ? (
                                                <>
                                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                                                        <CheckCircle size={14} /> Confirmed
                                                    </div>
                                                    <button
                                                        onClick={() => generateTicketPDF(booking)}
                                                        className="w-12 h-12 rounded-2xl bg-primary text-white hover:bg-brown flex items-center justify-center transition-all shadow-lg shadow-primary/20 active:scale-90"
                                                        title="Extract Ticket"
                                                    >
                                                        <Download size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => cancelBooking(booking._id)}
                                                        className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 hover:bg-red-400 hover:text-white flex items-center justify-center transition-all border border-red-100 active:scale-90"
                                                        title="Revoke Protocol"
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100 italic">
                                                    <XCircle size={14} /> Revoked
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white rounded-[50px] border-2 border-dashed border-cream-dark/30 flex flex-col items-center justify-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-brown/20 border border-cream-dark/30">
                                    <MapPin size={40} />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-lg font-black text-brown/40 uppercase tracking-[0.2em]">No Sacred Cycles Initialized</p>
                                    <button onClick={() => navigate('/temples')} className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary/20 hover:border-primary transition-all pb-1">Begin Your Quest</button>
                                </div>
                            </div>
                        )
                    )}

                    {activeTab === 'donations' && (
                        donations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {donations.map((donation) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={donation._id}
                                        className="bg-white p-10 rounded-[40px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] border border-cream-dark/50 flex items-center gap-8 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                            <Heart size={150} />
                                        </div>
                                        <div className="h-20 w-20 bg-primary/5 rounded-[30px] flex items-center justify-center shrink-0 text-primary shadow-inner">
                                            <Heart size={36} className="fill-primary/20" />
                                        </div>
                                        <div className="flex-grow space-y-2">
                                            <h4 className="text-2xl font-black text-brown tracking-tighter">Sacred Offering</h4>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brown/40">Destiny: {donation.temple.name}</p>
                                            <div className="flex items-center gap-3 pt-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">
                                                <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                                                <span className="opacity-20">•</span>
                                                <span>{donation.donationType}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 space-y-2 relative z-10">
                                            <p className="text-4xl font-black text-brown tracking-tighter">₹{donation.amount}</p>
                                            <span className="text-[8px] font-black uppercase text-green-600 bg-green-50 px-4 py-1.5 rounded-lg border border-green-100">Integrated</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white rounded-[50px] border-2 border-dashed border-cream-dark/30 flex flex-col items-center justify-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-brown/20 border border-cream-dark/30">
                                    <Heart size={40} />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-lg font-black text-brown/40 uppercase tracking-[0.2em]">No Offerings Synchronized</p>
                                    <button onClick={() => navigate('/donations')} className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary/20 hover:border-primary transition-all pb-1">Contribute to the Divine</button>
                                </div>
                            </div>
                        )
                    )}

                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-16 rounded-[60px] max-w-3xl mx-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-cream-dark/50 space-y-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                                <Landmark size={200} />
                            </div>

                            <div className="text-center space-y-4 relative z-10">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Core Credentials</span>
                                <h4 className="text-4xl font-black text-brown tracking-tighter font-poppins">Identity Management</h4>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {[
                                    { label: 'Primary Moniker', value: user?.name },
                                    { label: 'Access Coordinate', value: user?.email },
                                    { label: 'Frequency Line', value: user?.phone || 'Awaiting Input' },
                                    { label: 'Account Authority', value: user?.role }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-8 bg-cream/30 rounded-[30px] border border-cream-dark/30 group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brown/40">{item.label}</span>
                                        <span className="text-base font-black text-brown tracking-tight">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full bg-brown hover:bg-primary text-white py-8 rounded-[30px] font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-95 shadow-2xl shadow-brown/20 relative z-10">
                                Synchronize Identity
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
