import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Heart, User, Calendar, Mail,
    Phone, Filter, Search, MoreHorizontal,
    CheckCircle, XCircle, Landmark, TrendingUp,
    Download, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/donations');
            setDonations(res.data.donations);
        } catch (err) {
            toast.error('Failed to load global treasury registry');
        } finally {
            setLoading(false);
        }
    };

    const filteredDonations = donations.filter(d =>
        d.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.temple?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalOfferings = donations.reduce((sum, d) => sum + d.amount, 0);

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
            {/* Treasury Header */}
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-cream-dark relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 text-9xl text-primary/5 font-black pointer-events-none group-hover:scale-110 transition-transform italic select-none">ॐ</div>
                <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-8">
                    <div>
                        <h2 className="text-3xl font-black text-brown tracking-tighter uppercase">Universal Treasury Registry</h2>
                        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
                            <TrendingUp size={14} /> Global Collected: ₹{totalOfferings.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row bg-cream p-2 rounded-2xl gap-2 border border-cream-dark/30 shadow-inner w-full xl:w-auto">
                        <div className="relative flex-grow min-w-[300px]">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/30" />
                            <input
                                type="text"
                                placeholder="Find Donor or Temple..."
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center justify-center gap-3 px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">
                            <Download size={14} /> Financial Audit Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Treasury List */}
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
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 h-full">
                                <div className="flex items-center gap-6 w-full lg:w-auto">
                                    <div className="h-20 w-20 bg-cream rounded-2xl flex items-center justify-center text-primary font-black text-3xl border border-cream-dark shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                                        {d.user?.name[0]}
                                    </div>
                                    <div className="min-w-[200px]">
                                        <h4 className="text-xl font-black text-brown group-hover:text-primary transition-colors tracking-tighter leading-none">{d.user?.name}</h4>
                                        <div className="flex flex-col gap-1 mt-3">
                                            <span className="text-[10px] font-black text-brown/30 flex items-center gap-1.5 uppercase tracking-widest">
                                                <Calendar size={12} className="text-primary" /> {new Date(d.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] font-black text-primary/60 flex items-center gap-1.5 uppercase tracking-widest">
                                                <Landmark size={12} /> {d.temple?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0 border-cream">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1 italic">Vastu Type</span>
                                        <span className="text-xs font-black text-brown uppercase">{d.donationType}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1 italic">Contribution</span>
                                        <span className="text-xl font-black text-primary tracking-tighter">₹{d.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-4 justify-end lg:justify-start">
                                        <button
                                            onClick={() => { setSelectedDonation(d); setShowDetails(true); }}
                                            className="p-4 bg-cream hover:bg-primary hover:text-white text-brown/40 rounded-2xl transition-all border border-cream-dark/50 shadow-sm group/action flex items-center gap-3"
                                        >
                                            <MoreHorizontal size={20} />
                                            <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover/action:block">Full Insight</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-32 bg-white rounded-[64px] border-2 border-dashed border-cream-dark text-center">
                        <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-6 text-brown/10">
                            <Heart size={48} />
                        </div>
                        <h4 className="text-xl font-black text-brown uppercase">No Contributions Found</h4>
                        <p className="text-xs text-brown/40 font-bold mt-2">The universal treasury registry is awaiting records.</p>
                    </div>
                )}
            </div>

            {/* Donation Detail Modal */}
            <AnimatePresence>
                {showDetails && selectedDonation && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
                            className="bg-[#FEFDFB] w-full max-w-2xl rounded-[48px] shadow-2xl relative overflow-hidden border border-white z-10"
                        >
                            <div className="p-12 relative overflow-y-auto max-h-[90vh]">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-cream hover:bg-primary hover:text-white text-brown/20 rounded-2xl transition-all z-20 group shadow-sm"
                                >
                                    <XCircle size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>

                                <div className="absolute top-0 right-0 p-12 font-black text-[200px] text-primary/[0.03] pointer-events-none italic">ॐ</div>

                                <div className="relative z-10">
                                    <header className="text-center mb-10">
                                        <div className="w-20 h-20 bg-gradient-to-tr from-primary to-orange-400 text-white rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                                            <Heart size={36} />
                                        </div>
                                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-2 uppercase">Donor Intelligence</h3>
                                        <p className="text-brown/30 font-bold uppercase tracking-[0.3em] text-[10px]">Registry of Sacred Support</p>
                                    </header>

                                    <div className="space-y-8 pb-4">
                                        <div className="bg-white p-8 rounded-[32px] border-2 border-cream-dark/40 shadow-sm">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Devotee Information</h5>
                                                    <p className="text-2xl font-black text-brown">{selectedDonation.user?.name}</p>
                                                    <p className="text-[10px] font-bold text-brown/30">{selectedDonation.user?.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-brown/30 mb-1">Offering Amount</h5>
                                                    <p className="text-3xl font-black text-primary tracking-tighter">₹{selectedDonation.amount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-cream grid grid-cols-2 gap-6">
                                                <div>
                                                    <h6 className="text-[9px] font-black uppercase text-[#FF9933] mb-1 italic">Recipient Temple</h6>
                                                    <p className="text-xs font-bold text-brown">{selectedDonation.temple?.name}</p>
                                                </div>
                                                <div>
                                                    <h6 className="text-[9px] font-black uppercase text-[#FF9933] mb-1 italic">Offering Purpose</h6>
                                                    <p className="text-xs font-bold text-brown uppercase">{selectedDonation.donationType}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-cream/20 rounded-[32px] border-2 border-dashed border-cream-dark/40 shadow-inner">
                                            <h6 className="text-[10px] font-black uppercase tracking-widest text-brown/30 mb-4 flex items-center gap-2 italic">
                                                <Mail size={12} /> Sacred Message From Donor
                                            </h6>
                                            <p className="text-sm text-brown font-bold leading-relaxed italic">
                                                "{selectedDonation.message || 'The donor has chosen a silent offering without additional inscriptions.'}"
                                            </p>
                                        </div>

                                        <div className="p-6 bg-white rounded-[28px] border-2 border-cream-dark/40 shadow-sm">
                                            <h6 className="text-[9px] font-black uppercase tracking-widest text-brown/20 mb-2 italic">Institutional Transaction Token</h6>
                                            <p className="text-sm font-black text-primary flex items-center gap-3">
                                                <Shield size={16} className="text-primary" /> {selectedDonation.transactionId?.toUpperCase()}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setShowDetails(false)}
                                            className="w-full py-5 bg-brown text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl hover:-translate-y-1 transition-all"
                                        >
                                            Return to Treasury Registry
                                        </button>
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

export default AdminDonations;
