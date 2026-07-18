import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TrendingUp, Monitor, Globe, ArrowUpRight,
    ArrowDownRight, Filter, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        // Simulating data fetch for analytics
        const fetchAnalytics = async () => {
            try {
                // In a real app, this would be an API call
                // For now, using the stats we have and augmenting
                const res = await axios.get('/api/admin/stats');
                setData({
                    ...res.data.stats,
                    trends: [
                        { label: 'Jan', value: 45 },
                        { label: 'Feb', value: 52 },
                        { label: 'Mar', value: 38 },
                        { label: 'Apr', value: 65 },
                        { label: 'May', value: 48 },
                        { label: 'Jun', value: 72 },
                    ],
                    traffic: [
                        { source: 'Direct', percentage: 45, color: 'bg-primary' },
                        { source: 'Social', percentage: 25, color: 'bg-blue-500' },
                        { source: 'Referral', percentage: 20, color: 'bg-green-500' },
                        { source: 'Others', percentage: 10, color: 'bg-purple-500' },
                    ]
                });
            } catch (err) {
                toast.error('Failed to load analytics');
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
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-brown tracking-tighter">Insights Hub</h1>
                    <p className="text-brown/40 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 flex items-center gap-2">
                        <Globe size={12} className="text-primary" /> Real-time Global Analytics
                    </p>
                </div>
                <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-cream-dark gap-2">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-cream hover:bg-cream-dark text-brown text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
                        <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-primary/30 transition-all">
                        <Download size={14} /> Export Report
                    </button>
                </div>
            </div>

            {/* Performance Chart Card */}
            <div className="card-asymmetric bg-white p-12 border border-cream-dark shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp size={200} />
                </div>
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h3 className="text-2xl font-black text-brown tracking-tight">Booking Velocity</h3>
                        <p className="text-brown/40 text-xs font-bold uppercase tracking-widest mt-1">Growth over the last 6 months</p>
                    </div>
                    <div className="flex items-center gap-2 text-green-500 font-black text-xl">
                        <ArrowUpRight size={24} /> +24%
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
                {/* Traffic Sources */}
                <div className="card-asymmetric bg-white p-10 border border-cream-dark shadow-2xl">
                    <h3 className="text-xl font-black text-brown tracking-tight mb-8">Traffic Acquisition</h3>
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

                {/* Device breakdown or similar */}
                <div className="card-asymmetric bg-brown p-10 text-white relative flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Monitor size={120} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter mb-4 leading-none">Optimal User<br />Engagement</h3>
                    <p className="text-white/60 font-medium leading-relaxed mb-10 max-w-sm">
                        Our data indicates a 15% increase in mobile app bookings compared to last quarter. Optimize your current Temple listings for mobile view to capture more devotees.
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-white/10 p-4 rounded-2xl flex flex-col">
                            <span className="text-2xl font-black text-primary">82%</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Mobile</span>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl flex flex-col">
                            <span className="text-2xl font-black text-blue-400">18%</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Desktop</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
