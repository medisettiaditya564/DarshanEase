import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TrendingUp, Monitor, Globe, ArrowUpRight,
    ArrowDownRight, Filter, Download, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const OrganizerAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('/api/admin/stats');
                const stats = res.data.stats;

                // Map donation metrics to traffic format
                const traffic = [
                    { source: 'General', percentage: stats.totalDonations > 0 ? Math.round((stats.donationMetrics.General / stats.totalDonations) * 100) : 0, color: 'bg-primary' },
                    { source: 'Annadanam', percentage: stats.totalDonations > 0 ? Math.round((stats.donationMetrics.Annadanam / stats.totalDonations) * 100) : 0, color: 'bg-blue-500' },
                    { source: 'Other Rituals', percentage: stats.totalDonations > 0 ? Math.round((stats.donationMetrics.Special / stats.totalDonations) * 100) : 0, color: 'bg-purple-500' },
                ];

                setData({
                    ...stats,
                    traffic
                });
            } catch (err) {
                toast.error('Failed to load performance metrics');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="animate-pulse space-y-12">
        <div className="h-64 bg-white rounded-[40px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-96 bg-white rounded-[40px]" />
            <div className="h-96 bg-white rounded-[40px]" />
        </div>
    </div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 font-poppins">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-brown tracking-tighter">Temple Insights</h1>
                    <p className="text-brown/40 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 flex items-center gap-2">
                        <Zap size={12} className="text-primary" /> Performance metrics for your managed locations
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-4 bg-brown text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-brown/90 transition-all">
                    <Download size={14} /> Download PDF Report
                </button>
            </div>

            {/* Monthly Trajectory */}
            <div className="card-asymmetric bg-white p-12 border border-cream-dark shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp size={200} />
                </div>
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h3 className="text-2xl font-black text-brown tracking-tight">Monthly Booking Velocity</h3>
                        <p className="text-brown/40 text-[10px] font-black uppercase tracking-widest mt-1">Devotee engagement over last 30 intervals</p>
                    </div>
                </div>

                <div className="flex items-end justify-between h-64 gap-1 relative z-10">
                    {data.trends.map((t, i) => {
                        const maxValue = Math.max(...data.trends.map(tr => tr.value), 1);
                        const height = (t.value / maxValue) * 100;
                        return (
                            <div key={i} className="flex-grow flex flex-col items-center group/bar">
                                <div className="relative w-full flex justify-center">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(height, 2)}%` }}
                                        transition={{ duration: 1, delay: i * 0.02 }}
                                        className="w-full max-w-[12px] bg-gradient-to-t from-primary to-orange-400 rounded-lg shadow-sm group-hover/bar:shadow-primary/40 transition-all cursor-pointer"
                                    />
                                    <div className="absolute -top-10 bg-brown text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity font-bold whitespace-nowrap z-20 shadow-xl border border-white/10">
                                        {t.value} bookings
                                    </div>
                                </div>
                                {t.label && <span className="mt-4 text-[7px] font-black uppercase text-brown/30 tracking-tighter rotate-[-45deg] origin-top-left">{t.label}</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="card-asymmetric bg-white p-10 border border-cream-dark shadow-2xl">
                    <h3 className="text-xl font-black text-brown tracking-tight mb-8">Sacred Contribution Distribution</h3>
                    <div className="space-y-8">
                        {data.traffic.map((t, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                                    <span className="text-brown/60">{t.source}</span>
                                    <span className="text-brown">{t.percentage}%</span>
                                </div>
                                <div className="h-3 bg-cream rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${t.percentage}%` }}
                                        className={`h-full ${t.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Efficiency Stats */}
                <div className="card-asymmetric bg-gradient-to-br from-primary to-orange-500 p-10 text-white flex flex-col justify-center shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <Monitor size={32} className="text-white/80" />
                        <h3 className="text-2xl font-black tracking-tight">Platform Efficiency</h3>
                    </div>
                    <p className="text-white/80 text-sm font-medium leading-relaxed mb-8">
                        Your Temples are currently processing bookings with zero downtime. Automated slot synchronization is active for all manage locations.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 p-4 rounded-2xl">
                            <p className="text-3xl font-black text-white">99.9%</p>
                            <p className="text-[9px] uppercase font-bold tracking-widest text-white/60">Uptime</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl">
                            <p className="text-3xl font-black text-white">12ms</p>
                            <p className="text-[9px] uppercase font-bold tracking-widest text-white/60">Response</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerAnalytics;
