import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, Landmark, Calendar, DollarSign,
    Shield, CheckCircle, TrendingUp, ArrowUpRight,
    Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/admin/stats');
                setStats(res.data.stats);
            } catch (err) {
                toast.error('Failed to sync master Nexus data');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ icon: Icon, label, value, color, delay, trend }) => (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8, ease: "easeOut" }}
            className="card-asymmetric bg-white p-10 border border-cream-dark shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] group relative overflow-hidden active:scale-[0.98] transition-all"
        >
            <div className={`absolute -top-10 -right-10 p-8 text-primary/5 group-hover:text-primary/10 transition-all duration-700 group-hover:rotate-12`}>
                <Icon size={180} />
            </div>
            <div className="relative z-10">
                <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <Icon size={28} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brown/20 mb-3 ml-1">{label}</p>
                <div className="flex items-baseline gap-4">
                    <h3 className="text-5xl font-black text-brown tracking-tighter tabular-nums">
                        {typeof value === 'number' ? value.toLocaleString() : value || 0}
                    </h3>
                    {trend && (
                        <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 shadow-sm animate-pulse-slow">
                            <ArrowUpRight size={12} /> {trend}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-56 bg-white rounded-[48px] border border-cream-dark shadow-sm" />)}
        </div>
    );

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Master Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <StatCard
                    icon={Users}
                    label="Active Devotees"
                    value={stats?.users}
                    color="bg-gradient-to-tr from-[#FF9933] to-[#FFB347]"
                    delay={0.1}
                    trend="+24"
                />
                <StatCard
                    icon={Landmark}
                    label="Global Temples"
                    value={stats?.temples}
                    color="bg-gradient-to-tr from-brown to-brown/80"
                    delay={0.2}
                />
                <StatCard
                    icon={Calendar}
                    label="Current Bookings"
                    value={stats?.bookings}
                    color="bg-gradient-to-tr from-[#FF9933] to-orange-600"
                    delay={0.3}
                    trend="+15%"
                />
                <StatCard
                    icon={DollarSign}
                    label="Total Treasury"
                    value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
                    color="bg-gradient-to-tr from-green-600 to-green-400"
                    delay={0.4}
                    trend="+12k"
                />
            </div>

            {/* Data-Driven Activity & Control Hubs */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Activity Hub - xl:col-span-2 */}
                <div className="xl:col-span-2 space-y-12">
                    {/* Recent Bookings */}
                    <div className="card-asymmetric bg-white p-10 border border-cream-dark shadow-2xl relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-brown tracking-tighter uppercase leading-none">Recent Bookings</h3>
                                <p className="text-primary font-black uppercase tracking-[0.3em] text-[8px] mt-2">Latest Temple Entries</p>
                            </div>
                            <button className="p-3 bg-cream hover:bg-brown hover:text-white rounded-xl transition-all text-brown/40">
                                <ArrowUpRight size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {stats?.recentBookings?.length > 0 ? stats.recentBookings.map((b, i) => (
                                <div key={b._id} className="flex items-center justify-between p-5 bg-cream/30 rounded-2xl hover:bg-cream/50 transition-all border border-transparent hover:border-cream-dark/50 group/item">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-black border border-cream-dark shadow-sm group-hover/item:rotate-6 transition-transform">
                                            {b.user?.name?.[0] || 'D'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-brown leading-none">{b.user?.name}</p>
                                            <p className="text-[10px] font-bold text-brown/40 mt-1">{b.temple?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-primary">₹{b.totalPrice}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${b.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-10 text-center border-2 border-dashed border-cream rounded-3xl">
                                    <p className="text-xs font-black text-brown/20 uppercase tracking-widest">No Recent Activity Detected</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Donations */}
                    <div className="card-asymmetric bg-white p-10 border border-cream-dark shadow-2xl relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-brown tracking-tighter uppercase leading-none">Treasury Registry</h3>
                                <p className="text-green-600 font-black uppercase tracking-[0.3em] text-[8px] mt-2">Latest Sacred Offerings</p>
                            </div>
                            <button className="p-3 bg-cream hover:bg-brown hover:text-white rounded-xl transition-all text-brown/40">
                                <TrendingUp size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {stats?.recentDonations?.length > 0 ? stats.recentDonations.map((d, i) => (
                                <div key={d._id} className="flex items-center justify-between p-5 border-b border-cream last:border-none hover:bg-primary/5 transition-all rounded-2xl group/item">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover/item:scale-110 transition-transform">
                                            <DollarSign size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-brown leading-none">{d.user?.name || 'Anonymous'}</p>
                                            <p className="text-[10px] font-bold text-brown/40 mt-1 uppercase tracking-tighter">{d.donationType}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-brown leading-none">₹{d.amount}</p>
                                        <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-1">Recieved</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-10 text-center border-2 border-dashed border-cream rounded-3xl">
                                    <p className="text-xs font-black text-brown/20 uppercase tracking-widest">Treasury Silent</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Settings - xl:col-span-1 */}
                <div className="space-y-12">
                    <div className="card-asymmetric bg-brown p-12 text-white relative overflow-hidden flex flex-col shadow-3xl border border-white/5 h-full">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-all duration-1000">
                            <Settings size={200} />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-3xl font-black tracking-tighter mb-8 leading-none uppercase">Nexus Controls</h3>

                            <div className="space-y-8 flex-grow">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group/control">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 group-hover/control:text-primary transition-colors">Maintenance Mode</h4>
                                        <span className="w-10 h-6 bg-white/20 rounded-full relative cursor-pointer">
                                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-medium leading-relaxed">Lock all Temple portals for schedule updates.</p>
                                </div>

                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group/control">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 group-hover/control:text-primary transition-colors">Public Registry</h4>
                                        <span className="w-10 h-6 bg-primary rounded-full relative cursor-pointer shadow-lg shadow-primary/20">
                                            <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-medium leading-relaxed">Toggle user account creation across the Nexus.</p>
                                </div>

                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group/control">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 group-hover/control:text-primary transition-colors">Financial Audit</h4>
                                        <span className="w-10 h-6 bg-white/20 rounded-full relative cursor-pointer">
                                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-medium leading-relaxed">Generate hourly treasury delta reports.</p>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10">
                                <button onClick={() => toast.success('Global Sync Triggered')} className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95">
                                    Re-Sync Global States
                                </button>
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] text-center mt-6">Authority Level: Grand Master</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
