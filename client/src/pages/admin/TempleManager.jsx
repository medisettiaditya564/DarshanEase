import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Landmark, Settings, Trash2, ShieldCheck,
    MoreVertical, Edit3, Eye, CheckCircle2, XCircle, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const TempleManager = () => {
    const [temples, setTemples] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTemple, setNewTemple] = useState({
        name: '', description: '', deity: '', category: 'Hindu',
        location: { city: '', state: '', address: '' },
        images: [],
        openTime: '06:00', closeTime: '20:00',
        facilities: ['Prasad Shop', 'Parking']
    });
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchTemples();
        fetchOrganizers();
    }, []);

    const fetchOrganizers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setOrganizers(res.data.users.filter(u => u.role === 'ORGANIZER' || u.role === 'ADMIN'));
        } catch (err) {
            console.error('Failed to load authorities');
        }
    };

    const fetchTemples = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/temples?all=true');
            setTemples(res.data.temples);
        } catch (err) {
            toast.error('Failed to load Temples');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/temples', newTemple);
            toast.success('New Temple Established');
            setCreateModalOpen(false);
            setNewTemple({
                name: '', description: '', deity: '', category: 'Hindu',
                location: { city: '', state: '', address: '' },
                images: [],
                openTime: '06:00', closeTime: '20:00',
                facilities: ['Prasad Shop', 'Parking']
            });
            setImageUrl('');
            fetchTemples();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to establish Temple');
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
        setSelectedTemple({
            ...temple,
            images: temple.images || []
        });
        setImageUrl(''); // Reset image URL input
        setEditModalOpen(true);
    };

    const filteredTemples = temples.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-20 bg-white rounded-[32px] border border-cream-dark" />
            <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-white rounded-[32px] border border-cream-dark" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-cream-dark">
                <div className="flex-shrink-0">
                    <h2 className="text-3xl font-black text-brown tracking-tighter uppercase">Temple Registry</h2>
                    <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-2">Overseeing {temples.length} Sacred Locations</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 flex-grow xl:max-w-2xl">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by Name, City or Category..."
                            className="w-full pl-14 pr-6 py-4 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brown/30">
                            <Landmark size={20} />
                        </div>
                    </div>
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="bg-gradient-to-r from-primary to-orange-400 text-white px-10 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all whitespace-nowrap"
                    >
                        + Establish Temple
                    </button>
                </div>
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 gap-6">
                {filteredTemples.length > 0 ? (
                    filteredTemples.map((t) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={t._id}
                            className="bg-white p-6 rounded-[32px] border border-cream-dark hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                        >
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                                <div className="flex items-center gap-6 w-full lg:w-auto">
                                    <div className="h-20 w-32 bg-cream rounded-3xl overflow-hidden shadow-inner border border-cream-dark group-hover:scale-105 transition-transform shrink-0">
                                        <img src={t.images[0]} alt={t.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-brown group-hover:text-primary transition-colors tracking-tight leading-none">{t.name}</h4>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brown/40 flex items-center gap-1">
                                                <Landmark size={12} className="text-primary" /> {t.location.city}
                                            </span>
                                            <span className="w-1.5 h-1.5 bg-cream-dark rounded-full" />
                                            <span className="px-3 py-1 bg-cream text-brown/60 rounded-full text-[9px] font-black uppercase tracking-widest border border-transparent group-hover:border-primary/20 transition-all">
                                                {t.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-6 lg:pt-0 border-cream">
                                    {/* Authority Info */}
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-brown/20 mb-2 italic">Authority</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary font-black text-xs border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                                                {t.createdBy?.name?.charAt(0) || 'A'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-brown capitalize leading-none mb-1">{t.createdBy?.name || 'Grand Admin'}</p>
                                                <p className="text-[9px] text-brown/30 font-bold tracking-tighter">{t.createdBy?.email || 'admin@field.com'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Toggle */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-brown/20 mb-2 italic">Visibility</span>
                                        <button
                                            onClick={() => toggleTempleStatus(t._id, t.isActive)}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${t.isActive
                                                ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                                : 'bg-red-50 text-red-400 border-red-200 hover:bg-red-100'
                                                }`}
                                        >
                                            {t.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {t.isActive ? 'Active' : 'Dormant'}
                                        </button>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleEdit(t)} className="p-4 bg-cream hover:bg-primary hover:text-white text-brown/40 rounded-2xl transition-all border border-cream-dark/50 shadow-sm">
                                            <Edit3 size={18} />
                                        </button>
                                        <button className="p-4 bg-cream hover:bg-red-500 hover:text-white text-brown/40 rounded-2xl transition-all border border-cream-dark/50 shadow-sm">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-8 text-9xl text-primary/5 font-black pointer-events-none group-hover:scale-110 transition-transform rotate-12 select-none italic">ॐ</div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-32 bg-white rounded-[64px] border-2 border-dashed border-cream-dark text-center shadow-inner"
                    >
                        <div className="w-32 h-32 bg-cream text-brown/10 rounded-full flex items-center justify-center mb-10 shadow-inner">
                            <Landmark size={64} />
                        </div>
                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-4 uppercase">Registry Empty</h3>
                        <p className="text-sm text-brown/40 max-w-sm mx-auto leading-relaxed font-bold">
                            {searchTerm ? `No Temples found matching "${searchTerm}". Please refine your divine search.` : 'The global registry is currently silent. No Temples have been established yet.'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-10 px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all"
                            >
                                Reset Registry Filter
                            </button>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Creation Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brown/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-[#FDFCFB] w-full max-w-4xl rounded-[60px] shadow-3xl overflow-hidden border border-white/10 relative"
                        >
                            <div className="bg-brown p-12 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                                    <Landmark size={200} />
                                </div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-[2px] bg-primary" />
                                            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">Establishment Protocol</span>
                                        </div>
                                        <h3 className="text-5xl font-black font-poppins tracking-tighter">New <span className="text-primary">Temple</span></h3>
                                    </div>
                                    <button onClick={() => setCreateModalOpen(false)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"><X size={24} /></button>
                                </div>
                            </div>

                            <form onSubmit={handleCreate} className="p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2">Temple Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={newTemple.name}
                                            onChange={(e) => setNewTemple({ ...newTemple, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2">Tradition/Category</label>
                                        <select
                                            className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                                            value={newTemple.category}
                                            onChange={(e) => setNewTemple({ ...newTemple, category: e.target.value })}
                                        >
                                            <option value="Hindu">Hindu</option>
                                            <option value="Jain">Jain</option>
                                            <option value="Buddhist">Buddhist</option>
                                            <option value="Sikh">Sikh</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2">Temple Chronicles (Description)</label>
                                        <textarea
                                            required
                                            className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all h-32"
                                            value={newTemple.description}
                                            onChange={(e) => setNewTemple({ ...newTemple, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2">Deity</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={newTemple.deity}
                                            onChange={(e) => setNewTemple({ ...newTemple, deity: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2">City</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={newTemple.location.city}
                                            onChange={(e) => setNewTemple({ ...newTemple, location: { ...newTemple.location, city: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2">State</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={newTemple.location.state}
                                            onChange={(e) => setNewTemple({ ...newTemple, location: { ...newTemple.location, state: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2">Full Address</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={newTemple.location.address}
                                            onChange={(e) => setNewTemple({ ...newTemple, location: { ...newTemple.location, address: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2">Open Time</label>
                                        <input
                                            type="time"
                                            className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={newTemple.openTime}
                                            onChange={(e) => setNewTemple({ ...newTemple, openTime: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2">Close Time</label>
                                        <input
                                            type="time"
                                            className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={newTemple.closeTime}
                                            onChange={(e) => setNewTemple({ ...newTemple, closeTime: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-4 md:col-span-2 bg-cream/20 p-8 rounded-[40px] border border-cream-dark/50">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brown/40 px-2 flex justify-between items-center">
                                            Sacred Imagery (URLs)
                                            <span className="text-primary">{newTemple.images.length} Captured</span>
                                        </label>
                                        <div className="flex gap-4">
                                            <input
                                                type="url"
                                                placeholder="https://images.unsplash.com/..."
                                                className="flex-grow p-6 bg-white rounded-2xl border border-cream-dark/50 outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (imageUrl) {
                                                        setNewTemple({ ...newTemple, images: [...newTemple.images, imageUrl] });
                                                        setImageUrl('');
                                                    }
                                                }}
                                                className="px-8 bg-brown text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 mt-4">
                                            {newTemple.images.map((img, idx) => (
                                                <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden shadow-sm">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewTemple({ ...newTemple, images: newTemple.images.filter((_, i) => i !== idx) })}
                                                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-primary text-white py-7 rounded-[30px] font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-95 shadow-2xl shadow-primary/30">
                                    Initialize Temple Establishment
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Quick Edit Modal Placeholder */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 mandala-bg bg-brown/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-10 font-black text-9xl text-primary/5 pointer-events-none">ॐ</div>
                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-2">Temple Override</h3>
                        <p className="text-brown/40 font-bold uppercase tracking-widest text-xs mb-10">Refining {selectedTemple?.name}</p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brown/40">Deity Name</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                                    value={selectedTemple?.deity || ''}
                                    onChange={(e) => setSelectedTemple({ ...selectedTemple, deity: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brown/40">Assign Authority</label>
                                <select
                                    className="w-full p-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                                    value={selectedTemple?.createdBy?._id || selectedTemple?.createdBy}
                                    onChange={(e) => setSelectedTemple({ ...selectedTemple, createdBy: e.target.value })}
                                >
                                    {organizers.map(org => (
                                        <option key={org._id} value={org._id}>{org.name} ({org.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-10 space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brown/40">Sacred Imagery Gallery</label>
                            <div className="flex gap-4">
                                <input
                                    type="url"
                                    placeholder="Add new Image URL..."
                                    className="flex-grow p-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (imageUrl) {
                                            setSelectedTemple({ ...selectedTemple, images: [...selectedTemple.images, imageUrl] });
                                            setImageUrl('');
                                        }
                                    }}
                                    className="px-6 bg-brown text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
                                >
                                    Insert
                                </button>
                            </div>
                            <div className="grid grid-cols-5 gap-4">
                                {selectedTemple?.images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden shadow-md">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTemple({ ...selectedTemple, images: selectedTemple.images.filter((_, i) => i !== idx) })}
                                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button onClick={() => setEditModalOpen(false)} className="flex-grow py-5 bg-cream text-brown text-xs font-black uppercase tracking-widest rounded-[20px] hover:bg-cream-dark transition-all">
                                Cancel Operation
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await axios.put(`/api/temples/${selectedTemple._id}`, {
                                            name: selectedTemple.name,
                                            description: selectedTemple.description,
                                            deity: selectedTemple.deity,
                                            category: selectedTemple.category,
                                            location: selectedTemple.location,
                                            images: selectedTemple.images.filter(img => img && img.trim() !== ''),
                                            openTime: selectedTemple.openTime,
                                            closeTime: selectedTemple.closeTime,
                                            facilities: selectedTemple.facilities,
                                            createdBy: selectedTemple.createdBy?._id || selectedTemple.createdBy
                                        });
                                        toast.success('Sanctuary records updated successfully');
                                        setEditModalOpen(false);
                                        fetchTemples();
                                    } catch (err) {
                                        toast.error('Failed to update sanctuary');
                                    }
                                }}
                                className="flex-grow py-5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-[20px] shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all"
                            >
                                Commit Changes
                            </button>
                        </div>
                    </motion.div>
                </div >
            )}
        </div >
    );
};

export default TempleManager;
