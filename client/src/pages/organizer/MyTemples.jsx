import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Landmark, Settings, Trash2, ShieldCheck,
    MoreVertical, Edit3, Eye, CheckCircle2, XCircle,
    Link as LinkIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MyTemples = () => {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        deity: '',
        description: '',
        location: {
            address: '',
            city: '',
            state: '',
            mapLink: ''
        },
        images: []
    });
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchTemples();
    }, []);

    const fetchTemples = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/temples?all=true');
            setTemples(res.data.temples);
        } catch (err) {
            toast.error('Failed to load your Temples');
        } finally {
            setLoading(false);
        }
    };

    const toggleTempleStatus = async (id, currentStatus) => {
        try {
            await axios.put(`/api/temples/${id}`, { isActive: !currentStatus });
            toast.success(`Temple ${!currentStatus ? 'activated' : 'deactivated'}`);
            fetchTemples();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleEdit = (temple) => {
        setSelectedTemple(temple);
        setFormData({
            name: temple.name,
            category: temple.category,
            deity: temple.deity,
            description: temple.description,
            location: {
                address: temple.location.address,
                city: temple.location.city,
                state: temple.location.state,
                mapLink: temple.location.mapLink
            },
            images: temple.images || []
        });
        setEditModalOpen(true);
    };

    const filteredTemples = temples.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.deity.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const sanitizedFormData = {
                ...formData,
                images: formData.images.filter(img => img && img.trim() !== '')
            };
            await axios.put(`/api/temples/${selectedTemple._id}`, sanitizedFormData);
            toast.success('Temple records updated successfully');
            setEditModalOpen(false);
            fetchTemples();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-24 bg-white rounded-[32px] border border-cream-dark" />
            <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-[32px] border border-cream-dark" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 font-poppins pb-20">
            {/* Header Section */}
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-cream-dark relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 text-9xl text-primary/5 font-black pointer-events-none group-hover:scale-110 transition-transform italic select-none">ॐ</div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-tr from-[#FF9933] to-[#FFB347] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <Landmark size={24} />
                            </div>
                            <h2 className="text-4xl font-black text-brown tracking-tighter">My Sacred Domains</h2>
                        </div>
                        <p className="text-brown/40 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                            <ShieldCheck size={12} className="text-primary" /> Overseeing {temples.length} Authorized Locations
                        </p>
                    </div>

                    <div className="relative group/search">
                        <input
                            type="text"
                            placeholder="Search by Name, City or Deity..."
                            className="w-full md:w-80 p-5 pl-14 bg-cream/30 rounded-3xl border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none text-sm font-bold transition-all shadow-inner group-hover/search:shadow-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brown/20 group-focus-within/search:text-primary transition-colors">
                            <Landmark size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Temples Registry */}
            <div className="grid grid-cols-1 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredTemples.map((temple) => (
                        <motion.div
                            key={temple._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[40px] border border-cream-dark p-8 shadow-xl shadow-primary/5 group relative overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                        >
                            <div className="flex flex-col lg:flex-row gap-10">
                                {/* Visual Preview */}
                                <div className="w-full lg:w-72 h-48 lg:h-auto rounded-[32px] overflow-hidden relative">
                                    <img
                                        src={temple.images?.[0] || 'https://images.unsplash.com/photo-1544011501-a93223068db0?auto=format&fit=crop&q=80'}
                                        alt={temple.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-4 py-1.5 ${temple.isActive ? 'bg-green-500' : 'bg-red-500'} text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg`}>
                                            {temple.isActive ? 'Live' : 'Hidden'}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-brown shadow-lg border border-white/20">
                                        {temple.category}
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                        <p className="text-white/60 text-[8px] font-black uppercase tracking-widest mb-1">Registry Code</p>
                                        <p className="text-white text-xs font-mono font-bold tracking-tighter italic">ID: {temple._id.slice(-6)}</p>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-black text-brown tracking-tighter mb-2 group-hover:text-primary transition-colors">{temple.name}</h3>
                                            <p className="text-brown/40 font-bold text-sm flex items-center gap-2 mb-6">
                                                <Landmark size={14} className="text-primary/60" /> {temple.location.city}, {temple.location.state}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(temple)}
                                                className="w-12 h-12 bg-cream hover:bg-brown hover:text-white text-brown/40 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-95"
                                                title="Refine Records"
                                            >
                                                <Settings size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-cream-dark/40">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-brown/20 uppercase tracking-widest italic leading-none">Presiding Deity</p>
                                            <p className="text-xs font-bold text-brown flex items-center gap-2 tracking-tight">
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> {temple.deity}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-brown/20 uppercase tracking-widest italic leading-none">Visibility</p>
                                            <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={temple.isActive}
                                                    onChange={() => toggleTempleStatus(temple._id, temple.isActive)}
                                                />
                                                <div className="w-10 h-5 bg-cream peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex items-center justify-between">
                                        <div className="flex -space-x-3">
                                            {temple.images?.slice(0, 4).map((img, i) => (
                                                <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-md">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {temple.images?.length > 4 && (
                                                <div className="w-9 h-9 rounded-full bg-cream border-2 border-white flex items-center justify-center text-[8px] font-black text-brown/40">
                                                    +{temple.images.length - 4}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleEdit(temple)}
                                            className="px-8 py-3 bg-brown text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:shadow-lg transition-all active:scale-95 group/btn"
                                        >
                                            Configure <Edit3 size={14} className="inline ml-2 group-hover:rotate-12 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Institutional Watermark */}
                            <div className="absolute -bottom-10 -left-10 p-10 text-primary/5 italic font-black text-8xl select-none group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000 pointer-events-none">ॐ</div>
                        </motion.div>
                    ))}

                    {filteredTemples.length === 0 && (
                        <div className="bg-white rounded-[40px] border border-cream-dark p-20 text-center shadow-xl shadow-primary/5">
                            <div className="w-32 h-32 bg-cream rounded-full flex items-center justify-center mx-auto mb-8 text-brown/10">
                                <Landmark size={64} />
                            </div>
                            <h3 className="text-2xl font-black text-brown tracking-tighter mb-3">No Sanctuaries Located</h3>
                            <p className="text-brown/40 font-bold max-w-sm mx-auto text-sm leading-relaxed mb-10">Your authorized records do not currently contain any entries matching your resonance.</p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-10 py-5 bg-brown text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-primary transition-all active:scale-95 shadow-xl shadow-primary/20"
                            >
                                Reset Divine Filters
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Managed Registry Modal (Update) */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditModalOpen(false)}
                            className="fixed inset-0 bg-brown/70 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 100 }}
                            className="bg-[#FEFDFB] w-full max-w-4xl rounded-[48px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden border border-white z-10 max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 sm:p-14 overflow-y-auto custom-scrollbar">
                                <button
                                    onClick={() => setEditModalOpen(false)}
                                    className="absolute top-10 right-10 w-14 h-14 bg-cream hover:bg-red-500 hover:text-white text-brown/20 rounded-2xl flex items-center justify-center transition-all z-20 group shadow-sm"
                                >
                                    <XCircle size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>

                                <div className="absolute top-0 right-0 p-14 font-black text-[200px] text-primary/[0.03] pointer-events-none leading-none select-none italic">ॐ</div>

                                <header className="text-center mb-14 relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-tr from-[#FF9933] to-[#FFB347] text-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40 rotate-12">
                                        <Edit3 size={48} />
                                    </div>
                                    <h3 className="text-4xl font-black text-brown tracking-tighter mb-3">Refine Temple</h3>
                                    <p className="text-brown/40 font-black uppercase tracking-[0.4em] text-[10px]">Updating records for <span className="text-primary">{selectedTemple?.name}</span></p>
                                </header>

                                <form onSubmit={handleUpdate} className="space-y-10 relative z-10 pb-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Landmark size={12} /> Institutional Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-5 bg-white rounded-2xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm"
                                                placeholder="e.g. Kashi Vishwanath"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Settings size={12} /> Temple Category
                                            </label>
                                            <select
                                                required
                                                className="w-full p-5 bg-white rounded-2xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm appearance-none cursor-pointer"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="Hindu">Hindu Sanctuary</option>
                                                <option value="Jain">Jain Mandir</option>
                                                <option value="Buddhist">Buddhist Monastery</option>
                                                <option value="Sikh">Sikh Gurudwara</option>
                                                <option value="Other">Other Sacred Site</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Eye size={12} /> Presiding Deity
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Lord Shiva"
                                                className="w-full p-5 bg-white rounded-2xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm"
                                                value={formData.deity}
                                                onChange={(e) => setFormData({ ...formData, deity: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Edit3 size={12} /> Sacred Registry ID
                                            </label>
                                            <input
                                                type="text"
                                                disabled
                                                className="w-full p-5 bg-cream/50 rounded-2xl border-2 border-cream-dark/40 text-brown/30 text-xs font-bold font-mono"
                                                value={selectedTemple?._id}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                            <MoreVertical size={12} /> Temple Chronicle (Description)
                                        </label>
                                        <textarea
                                            rows="4"
                                            required
                                            className="w-full p-6 bg-white rounded-[32px] border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm leading-relaxed"
                                            placeholder="The historical and divine significance..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    {/* Sacred Imagery */}
                                    <div className="bg-cream/20 p-8 rounded-[40px] border border-cream-dark/50 space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Eye size={14} className="text-primary" />
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brown">Sacred Imagery</h4>
                                            </div>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                                                {formData.images.length} Captures
                                            </span>
                                        </div>

                                        <div className="flex gap-4">
                                            <input
                                                type="url"
                                                placeholder="Enter Divine Image URL..."
                                                className="flex-grow p-4 bg-white rounded-xl border-2 border-cream-dark/40 focus:border-primary outline-none text-sm font-bold shadow-sm"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (imageUrl) {
                                                        setFormData({ ...formData, images: [...formData.images, imageUrl] });
                                                        setImageUrl('');
                                                    }
                                                }}
                                                className="px-8 bg-brown text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden shadow-md border border-cream-dark/30 bg-white">
                                                    {img ? (
                                                        <>
                                                            <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Temple View ${idx + 1}`} />
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                                className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-brown/10">
                                                            <Landmark size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Footers */}
                                    <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setEditModalOpen(false)}
                                            className="flex-grow py-5 bg-cream hover:bg-cream-dark text-brown text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all border border-cream-dark/30 order-2 sm:order-1 active:scale-95"
                                        >
                                            Discard Changes
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-grow py-5 bg-gradient-to-r from-[#FF9933] to-[#FFB347] text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 order-1 sm:order-2"
                                        >
                                            Seal Updated Registry <ShieldCheck size={18} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )
                }
            </AnimatePresence >
        </div >
    );
};

export default MyTemples;
