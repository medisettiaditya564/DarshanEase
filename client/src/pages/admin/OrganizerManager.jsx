import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, Mail, Shield, Trash2,
    UserPlus, Search, ArrowRight, Lock, Phone,
    Landmark, Edit3, X, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const OrganizerManager = () => {
    const [organizers, setOrganizers] = useState([]);
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        templeId: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [usersRes, templesRes] = await Promise.all([
                axios.get('/api/admin/users'),
                axios.get('/api/temples?all=true')
            ]);

            const orgs = usersRes.data.users.filter(u => u.role === 'ORGANIZER');
            setOrganizers(orgs);
            setTemples(templesRes.data.temples);
        } catch (err) {
            toast.error('Failed to load management records');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditMode(false);
        setFormData({ name: '', email: '', password: '', phone: '', templeId: '' });
        setShowModal(true);
    };

    const handleOpenEdit = (org) => {
        setEditMode(true);
        setCurrentId(org._id);

        // Find existing temple assignment if any - handle both populated and flat createdBy
        const currentTemple = temples.find(t => {
            const createdById = typeof t.createdBy === 'object' ? t.createdBy?._id : t.createdBy;
            return createdById === org._id;
        });

        setFormData({
            name: org.name,
            email: org.email,
            password: '', // Don't show password
            phone: org.phone || '',
            templeId: currentTemple ? currentTemple._id : ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`/api/admin/organizers/${currentId}`, formData);
                toast.success('Authority updated successfully!');
            } else {
                await axios.post('/api/admin/organizers', formData);
                toast.success('Organizer account created successfully!');
            }
            setShowModal(false);
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Transaction failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you certain you wish to revoke this authority?')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            toast.success('Authority revoked successfully');
            fetchInitialData();
        } catch (err) {
            toast.error('Failed to remove record');
        }
    };

    const filteredOrganizers = organizers.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-20 bg-white rounded-[32px] border border-cream-dark" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-white rounded-[32px] border border-cream-dark" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-poppins pb-20">
            {/* Master Header */}
            <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-primary/5 border border-cream-dark relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 text-9xl text-primary/5 font-black pointer-events-none group-hover:scale-110 transition-transform italic select-none">ॐ</div>
                <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">
                    <div>
                        <h2 className="text-4xl font-black text-brown tracking-tighter uppercase leading-none">Authority Nexus</h2>
                        <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mt-4 flex items-center gap-2">
                            <Shield size={14} /> Delegated Command: {organizers.length} Temple Managers
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row bg-cream/50 p-2 rounded-3xl gap-3 border border-cream-dark/30 shadow-inner w-full xl:w-auto">
                        <div className="relative flex-grow min-w-[350px]">
                            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-brown/20" />
                            <input
                                type="text"
                                placeholder="Locate authority by name or email..."
                                className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm placeholder:text-brown/10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-orange-400 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all whitespace-nowrap"
                        >
                            <UserPlus size={16} /> New Authority
                        </button>
                    </div>
                </div>
            </div>

            {/* Organizers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredOrganizers.map((org, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        key={org._id}
                        className="card-asymmetric bg-white p-10 border border-cream-dark shadow-2xl shadow-primary/5 hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-all duration-700 pointer-events-none">
                            <Shield size={120} />
                        </div>

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="w-20 h-20 bg-gradient-to-tr from-primary/10 to-orange-400/10 rounded-[28px] flex items-center justify-center text-primary font-black text-3xl border border-primary/5 shadow-inner group-hover:scale-110 transition-all duration-500">
                                {org.name[0]}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="px-5 py-2 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 border border-green-100 shadow-sm">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Verified
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6 flex-grow relative z-10">
                            <div>
                                <h4 className="text-2xl font-black text-brown tracking-tighter group-hover:text-primary transition-colors leading-none truncate pr-4">{org.name}</h4>
                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="flex items-center gap-2 text-brown/30 text-[11px] font-bold">
                                        <Mail size={14} className="text-primary/60" /> {org.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-brown/30 text-[11px] font-bold">
                                        <Phone size={14} className="text-primary/60" /> {org.phone || 'No Registry Link'}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-cream grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-brown/20 mb-1 italic">Command Tier</p>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-tight flex items-center gap-1">
                                        <Shield size={12} /> Temple Lead
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-brown/20 mb-1 italic">Registry Log</p>
                                    <p className="text-[10px] font-black text-brown uppercase tracking-tight flex items-center gap-2">
                                        <Calendar size={12} /> {new Date(org.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Assigned Sanctuary Domain */}
                            <div className="pt-6 mt-2">
                                <div className="bg-cream/30 p-4 rounded-2xl border border-cream-dark/30 flex items-center gap-4 group/domain hover:bg-primary/5 transition-colors">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-cream group-hover/domain:scale-110 transition-transform">
                                        <Landmark size={18} />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-brown/30 mb-0.5">Sanctuary Domain</p>
                                        <p className="text-[11px] font-black text-brown truncate">
                                            {temples.find(t => {
                                                const createdById = typeof t.createdBy === 'object' ? t.createdBy?._id : t.createdBy;
                                                return createdById === org._id;
                                            })?.name || 'No Sanctuary Linked'}
                                        </p>
                                        {temples.find(t => {
                                            const createdById = typeof t.createdBy === 'object' ? t.createdBy?._id : t.createdBy;
                                            return createdById === org._id;
                                        }) && (
                                                <p className="text-[9px] font-bold text-primary/60 truncate">
                                                    {temples.find(t => {
                                                        const createdById = typeof t.createdBy === 'object' ? t.createdBy?._id : t.createdBy;
                                                        return createdById === org._id;
                                                    })?.location.city} Registry
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 grid grid-cols-5 gap-3 relative z-10">
                            <button
                                onClick={() => handleOpenEdit(org)}
                                className="col-span-4 py-4 bg-cream text-brown text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brown hover:text-white transition-all border border-cream-dark/50 flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Edit3 size={14} /> Modify Authority
                            </button>
                            <button
                                onClick={() => handleDelete(org._id)}
                                className="col-span-1 py-4 bg-red-50 text-red-500 flex items-center justify-center rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm active:scale-90"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Institutional Watermark */}
                        <div className="absolute -bottom-8 -left-8 p-8 text-primary/5 italic font-black text-7xl select-none group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000 pointer-events-none">ॐ</div>
                    </motion.div>
                ))}
            </div>

            {/* Management Modal (Create/Edit) */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                        {/* Overlay with balanced blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-brown/60 backdrop-blur-md"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#FEFDFB] w-full max-w-2xl rounded-[48px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden border border-white z-10 max-h-[90vh] flex flex-col"
                        >
                            {/* Header Section */}
                            <div className="p-8 sm:p-12 pb-0 flex flex-col flex-grow overflow-y-auto custom-scrollbar">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-cream hover:bg-primary hover:text-white text-brown/20 rounded-2xl transition-all z-20 group shadow-sm"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>

                                <div className="absolute top-0 right-0 p-12 font-black text-[200px] text-primary/[0.03] pointer-events-none leading-none select-none italic">ॐ</div>

                                <div className="relative z-10">
                                    <header className="text-center mb-10">
                                        <div className="w-20 h-20 bg-gradient-to-tr from-primary to-orange-400 text-white rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                                            {editMode ? <Edit3 size={36} /> : <UserPlus size={36} />}
                                        </div>
                                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-2">
                                            {editMode ? 'Modify Manager Authority' : 'Charter New Manager'}
                                        </h3>
                                        <p className="text-brown/30 font-bold uppercase tracking-[0.3em] text-[10px]">Institution Management Profile</p>
                                    </header>

                                    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                    <Users size={12} /> Legal Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full p-5 bg-white rounded-2xl border-2 border-cream-dark/40 focus:border-[#FF9933] transition-all outline-none text-sm font-bold placeholder:text-brown/20 focus:shadow-lg focus:shadow-primary/5 shadow-sm"
                                                    placeholder="e.g. Rahul Sharma"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                                <p className="text-[9px] text-brown/40 font-medium px-1">Manager's official recognition name.</p>
                                            </div>
                                            <div className="space-y-2.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                    <Phone size={12} /> Primary Contact
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-5 bg-white rounded-2xl border-2 border-cream-dark/40 focus:border-[#FF9933] transition-all outline-none text-sm font-bold placeholder:text-brown/20 focus:shadow-lg focus:shadow-primary/5 shadow-sm"
                                                    placeholder="+91 XXXXX XXXXX"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                                <p className="text-[9px] text-brown/40 font-medium px-1">Verified mobile for registry communications.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Mail size={12} /> Institutional Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full p-5 bg-white rounded-2xl border-2 border-cream-dark/40 focus:border-[#FF9933] transition-all outline-none text-sm font-bold placeholder:text-brown/20 focus:shadow-lg focus:shadow-primary/5 shadow-sm"
                                                placeholder="manager@institution.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                            <p className="text-[9px] text-brown/40 font-medium px-1">The primary account and notification endpoint.</p>
                                        </div>

                                        {!editMode && (
                                            <div className="space-y-2.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                    <Lock size={12} /> Gateway Access Key
                                                </label>
                                                <input
                                                    type="password"
                                                    required
                                                    className="w-full p-5 bg-white rounded-2xl border-2 border-cream-dark/40 focus:border-[#FF9933] transition-all outline-none text-sm font-bold placeholder:text-brown/20 focus:shadow-lg focus:shadow-primary/5 shadow-sm"
                                                    placeholder="Enter secure password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Landmark size={12} /> Delegated Temple Authority
                                            </label>
                                            <div className="relative group/select">
                                                <select
                                                    className="w-full p-5 bg-white rounded-2xl border-2 border-cream-dark/40 focus:border-[#FF9933] transition-all outline-none text-sm font-bold appearance-none cursor-pointer focus:shadow-lg focus:shadow-primary/5 shadow-sm pr-12"
                                                    value={formData.templeId}
                                                    onChange={(e) => setFormData({ ...formData, templeId: e.target.value })}
                                                >
                                                    <option value="">Keep Existing / No Current Assignment</option>
                                                    {temples.map(t => (
                                                        <option key={t._id} value={t._id}>{t.name} — {t.location.city}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brown/20 group-focus-within/select:text-primary transition-colors">
                                                    <ArrowRight size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-brown/40 font-medium px-1 italic">Assigning a Temple grants this manager access to its data hub.</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-5 pt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="flex-grow py-5 bg-cream hover:bg-cream-dark text-brown text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all border border-cream-dark/30 order-2 sm:order-1 active:scale-95"
                                            >
                                                Abort Operation
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-grow py-5 bg-gradient-to-r from-[#FF9933] to-[#FFB347] text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 order-1 sm:order-2"
                                            >
                                                {editMode ? 'Commit Authority Update' : 'Seal Account Charter'} <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrganizerManager;
