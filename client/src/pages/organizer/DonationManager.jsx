import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Heart, User, Calendar, Mail,
    Phone, Filter, Search, MoreHorizontal,
    CheckCircle, XCircle, Landmark, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DonationManager = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/donations/organizer');
            setDonations(res.data.donations);
        } catch (err) {
            toast.error('Failed to load sacred contributions');
        } finally {
            setLoading(false);
        }
    };

    const filteredDonations = filter === 'ALL'
        ? donations
        : donations.filter(d => d.donationType === filter);

    const totalDonated = filteredDonations.reduce((sum, d) => sum + d.amount, 0);

    if (loading) return (
        <div className="space-y-6 animate-pulse p-10">
            <div className="h-24 bg-white rounded-[40px] border border-cream-dark" />
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-28 bg-white rounded-[32px] border border-cream-dark" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-500 font-poppins pb-20">
            {/* Header Section */}
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-cream-dark relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 text-9xl text-primary/5 font-black pointer-events-none group-hover:scale-110 transition-transform italic select-none">ॐ</div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h2 className="text-3xl font-black text-brown tracking-tighter uppercase">Sacred Registry</h2>
                        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
                            <TrendingUp size={14} /> Total Contributions: ₹{totalDonated.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex bg-cream p-2 rounded-2xl gap-2 border border-cream-dark/30 shadow-inner">
                        {['ALL', 'GENERAL', 'PUJA', 'CONSTRUCTION'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-brown/40 hover:bg-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Donation Cards */}
            <div className="space-y-4">
                {filteredDonations.length > 0 ? (
                    filteredDonations.map((d, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={d._id}
                            className="bg-white p-6 rounded-[32px] border border-cream-dark hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                        >
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6 w-full lg:w-auto">
                                    <div className="h-20 w-20 bg-cream rounded-2xl flex items-center justify-center text-primary font-black text-3xl border border-cream-dark shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                                        {d.user?.name[0]}
                                    </div>
                                    <div className="min-w-[200px]">
                                        <h4 className="text-xl font-black text-brown group-hover:text-primary transition-colors tracking-tighter leading-none">{d.user?.name}</h4>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-[10px] font-black text-brown/30 flex items-center gap-1.5 uppercase tracking-widest">
                                                <Calendar size={12} className="text-primary" /> {new Date(d.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="w-1 h-1 bg-cream-dark rounded-full" />
                                            <span className="text-[10px] font-black text-brown/30 flex items-center gap-1.5 uppercase tracking-widest">
                                                <Heart size={12} className="text-primary" /> {d.donationType}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0 border-cream">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1">Temple</span>
                                        <span className="text-xs font-black text-brown truncate max-w-[120px]">{d.temple?.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1">Amount</span>
                                        <span className="text-xl font-black text-primary">₹{d.amount}</span>
                                    </div>
                                    <div className="flex items-center gap-4 justify-end lg:justify-start">
                                        <button
                                            onClick={() => { setSelectedDonation(d); setShowDetails(true); }}
                                            className="p-4 bg-cream hover:bg-primary hover:text-white text-brown/40 rounded-2xl transition-all border border-cream-dark/50 shadow-sm group/action flex items-center gap-3"
                                        >
                                            <MoreHorizontal size={20} />
                                            <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover/action:block">Inquiry</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-32 bg-white rounded-[64px] border-2 border-dashed border-cream-dark text-center shadow-inner"
                    >
                        <div className="w-32 h-32 bg-cream text-brown/10 rounded-full flex items-center justify-center mb-10 shadow-inner">
                            <Heart size={64} />
                        </div>
                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-4 uppercase">No Sacred Offerings</h3>
                        <p className="text-sm text-brown/40 max-w-sm mx-auto leading-relaxed font-bold">
                            The treasury of this Temple is awaiting its first contribution.
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Detailed Donor Modal */}
            <AnimatePresence>
                {showDetails && selectedDonation && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetails(false)}
                            className="fixed inset-0 bg-brown/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#FEFDFB] w-full max-w-2xl rounded-[48px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden border border-white z-10 max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 sm:p-12 pb-0 flex flex-col flex-grow overflow-y-auto custom-scrollbar relative">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-cream hover:bg-primary hover:text-white text-brown/20 rounded-2xl transition-all z-20 group shadow-sm"
                                >
                                    <XCircle size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>

                                <div className="absolute top-0 right-0 p-12 font-black text-[200px] text-primary/[0.03] pointer-events-none leading-none select-none italic">ॐ</div>

                                <div className="relative z-10">
                                    <header className="text-center mb-10">
                                        <div className="w-20 h-20 bg-gradient-to-tr from-primary to-orange-400 text-white rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                                            <Heart size={36} />
                                        </div>
                                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-2 uppercase">Donor Profile</h3>
                                        <p className="text-brown/30 font-bold uppercase tracking-[0.3em] text-[10px]">Registry of Sacred Contributions</p>
                                    </header>

                                    <div className="space-y-8 pb-12">
                                        <div className="bg-white p-8 rounded-[32px] border-2 border-cream-dark/40 shadow-sm space-y-6">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div>
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Contributor</h5>
                                                    <p className="text-3xl font-black text-brown tracking-tighter">{selectedDonation.user?.name}</p>
                                                </div>
                                                <div className="sm:text-right">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-brown/30 mb-1">Sacred Amount</h5>
                                                    <p className="text-3xl font-black text-primary">₹{selectedDonation.amount}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-cream">
                                                <div>
                                                    <h6 className="text-[9px] font-black uppercase tracking-widest text-[#FF9933] mb-1 italic">Contact Email</h6>
                                                    <p className="text-sm font-bold text-brown truncate">{selectedDonation.user?.email}</p>
                                                </div>
                                                <div>
                                                    <h6 className="text-[9px] font-black uppercase tracking-widest text-[#FF9933] mb-1 italic">Contact Channel</h6>
                                                    <p className="text-sm font-bold text-brown">{selectedDonation.user?.phone || 'Electronic Only'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-cream/20 rounded-[32px] border-2 border-dashed border-cream-dark/40 shadow-inner">
                                            <h6 className="text-[10px] font-black uppercase tracking-widest text-brown/30 mb-4 flex items-center gap-2 italic">
                                                <Mail size={12} /> Sacred Message From Donor
                                            </h6>
                                            <p className="text-sm text-brown font-bold leading-relaxed italic">
                                                "{selectedDonation.message || 'No additional message recorded with this offering.'}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="p-6 bg-white rounded-[28px] border-2 border-cream-dark/40 shadow-sm group hover:border-primary/20 transition-all">
                                                <h6 className="text-[9px] font-black uppercase tracking-widest text-brown/20 mb-2 italic">Offering Type</h6>
                                                <p className="text-sm font-black text-brown flex items-center gap-3">
                                                    <Heart size={16} className="text-primary" /> {selectedDonation.donationType}
                                                </p>
                                            </div>
                                            <div className="p-6 bg-white rounded-[28px] border-2 border-cream-dark/40 shadow-sm group hover:border-primary/20 transition-all">
                                                <h6 className="text-[9px] font-black uppercase tracking-widest text-brown/20 mb-2 italic">Transaction ID</h6>
                                                <p className="text-sm font-black text-brown flex items-center gap-3">
                                                    <CheckCircle size={16} className="text-green-500" /> {selectedDonation.transactionId?.toUpperCase()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-center pt-6">
                                            <button
                                                onClick={() => setShowDetails(false)}
                                                className="w-full py-5 bg-gradient-to-r from-brown to-brown/80 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-brown/20 hover:-translate-y-1 active:scale-95 transition-all"
                                            >
                                                Close Registry Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DonationManager;
