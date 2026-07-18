import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Heart, Landmark, ChevronRight, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Donations = () => {
    const { user } = useAuth();
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [donationType, setDonationType] = useState('General');
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const donationTypes = ['General', 'Annadanam', 'Renovation', 'Festival', 'Education'];

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const { data } = await axios.get('/api/temples?limit=100');
                setTemples(data.temples);
            } catch (err) {
                console.error('Failed to fetch temples');
            } finally {
                setLoading(false);
            }
        };
        fetchTemples();
    }, []);

    const filteredTemples = temples.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDonation = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to make a donation');
        if (!selectedTemple) return toast.error('Please select a temple');
        if (!amount || amount <= 0) return toast.error('Please enter a valid amount');

        setSubmitting(true);
        try {
            await axios.post('/api/donations', {
                templeId: selectedTemple._id,
                amount: Number(amount),
                message,
                donationType,
            });
            toast.success(`Thank you for your generous contribution to ${selectedTemple.name}!`);
            setAmount('');
            setMessage('');
            setSelectedTemple(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Donation failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-40 pb-32 bg-[#FDFCFB] min-h-screen mandala-bg">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* Form Hub - Glassmorphic Excellence */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-cream-dark/50 sticky top-32">
                            <div className="space-y-6 mb-12">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-12 h-[2px] bg-primary" />
                                    <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">Sacred Offering</span>
                                </motion.div>
                                <h3 className="text-4xl md:text-5xl font-black text-brown tracking-tighter leading-none">
                                    Share Your <span className="text-primary">Blessings</span>
                                </h3>
                                <p className="text-brown/40 font-medium">Your contribution supports the eternal flame of our spiritual heritage.</p>
                            </div>

                            <form onSubmit={handleDonation} className="space-y-8">
                                {/* Selected Temple Preview */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2">Target Temple</label>
                                    <div className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${selectedTemple ? 'border-primary bg-primary/5 shadow-inner' : 'border-cream-dark/50 italic text-brown/20 bg-cream/30'}`}>
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Landmark size={20} className={selectedTemple ? 'text-primary' : 'text-brown/10'} />
                                        </div>
                                        <div className="flex-grow">
                                            {selectedTemple ? (
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-black text-brown text-sm">{selectedTemple.name}</p>
                                                        <p className="text-[10px] uppercase font-black text-primary tracking-widest">{selectedTemple.location.city}</p>
                                                    </div>
                                                    <button type="button" onClick={() => setSelectedTemple(null)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 p-2 rounded-lg transition-colors">Change</button>
                                                </div>
                                            ) : <span className="text-sm font-bold">Please select a Temple from the hub...</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2">Offering Amount (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="501"
                                            className="w-full p-6 bg-cream/50 border border-cream-dark/50 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-black text-2xl text-brown transition-all"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2">Donation Type</label>
                                        <div className="relative">
                                            <select
                                                className="w-full p-6 bg-cream/50 border border-cream-dark/50 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-black text-sm text-brown appearance-none transition-all cursor-pointer"
                                                value={donationType}
                                                onChange={(e) => setDonationType(e.target.value)}
                                            >
                                                {donationTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                <ChevronRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2">Devotion Message</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Write a prayer or intention..."
                                        className="w-full p-6 bg-cream/50 border border-cream-dark/50 rounded-2xl focus:ring-2 focus:ring-primary outline-none resize-none font-medium text-brown/80"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-brown hover:bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-2xl shadow-brown/20 flex items-center justify-center gap-4 group"
                                >
                                    {submitting ? 'Transmitting Devotion...' : (
                                        <>
                                            <Heart size={18} className="group-hover:fill-white group-hover:scale-125 transition-all" />
                                            Contribute Joyfully
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Selection Nexus */}
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-brown tracking-tighter">Temple Nexus</h3>
                                <p className="text-brown/40 font-bold uppercase text-[10px] tracking-widest">Select a destination for your offering</p>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                                <input
                                    placeholder="Find a Temple..."
                                    className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl text-xs font-bold border border-cream-dark/50 focus:ring-2 focus:ring-primary outline-none transition-all shadow-lg shadow-black/5"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[900px] overflow-y-auto pr-6 custom-scrollbar">
                            {loading ? (
                                [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-cream/30 animate-pulse rounded-[30px] border border-cream-dark/20" />)
                            ) : filteredTemples.length > 0 ? (
                                filteredTemples.map((temple, i) => (
                                    <motion.div
                                        key={temple._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelectedTemple(temple)}
                                        className={`p-6 rounded-[30px] bg-white border-2 cursor-pointer transition-all flex items-center gap-6 group hover:shadow-2xl ${selectedTemple?._id === temple._id ? 'border-primary bg-primary/5 shadow-xl ring-4 ring-primary/5' : 'border-cream-dark/30 hover:border-primary/50'}`}
                                    >
                                        <div className="h-24 w-24 rounded-2xl overflow-hidden shrink-0 border border-cream-dark/30">
                                            <img src={temple.images[0]} alt={temple.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" />
                                        </div>
                                        <div className="flex-grow space-y-2">
                                            <h4 className="text-lg font-black text-brown font-poppins group-hover:text-primary transition-colors tracking-tighter">{temple.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center text-[10px] text-brown/40 uppercase tracking-widest font-black">
                                                    <MapPin size={12} className="mr-2 text-primary" /> {temple.location.city}
                                                </div>
                                                <div className="w-1 h-1 bg-cream-dark rounded-full" />
                                                <span className="text-[10px] text-primary font-black uppercase tracking-widest">{temple.category || 'Hindu'}</span>
                                            </div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedTemple?._id === temple._id ? 'bg-primary border-primary text-white scale-110' : 'border-cream-dark group-hover:border-primary/30 text-transparent'}`}>
                                            <ChevronRight size={20} className={selectedTemple?._id === temple._id ? 'rotate-90' : ''} />
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 opacity-20">
                                    <Landmark size={80} className="mx-auto mb-4" />
                                    <p className="font-black uppercase tracking-widest text-xs">No Temples found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donations;
