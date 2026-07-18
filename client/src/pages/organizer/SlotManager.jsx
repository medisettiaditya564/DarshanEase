import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Calendar as CalendarIcon, Clock, Users, IndianRupee,
    Plus, Trash2, Edit3, ShieldCheck,
    AlertCircle, Search, Filter, XCircle, ArrowRight,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SlotManager = () => {
    const [slots, setSlots] = useState([]);
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSlotId, setCurrentSlotId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [formData, setFormData] = useState({
        temple: '',
        date: '',
        startTime: '',
        endTime: '',
        totalCapacity: 50,
        price: 50,
        slotType: 'General',
        isActive: true
    });

    useEffect(() => {
        fetchInitialData();
    }, [selectedDate]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [slotsRes, templesRes] = await Promise.all([
                axios.get(`/api/slots?date=${selectedDate}`),
                axios.get('/api/temples?all=true')
            ]);
            setSlots(slotsRes.data.slots);
            setTemples(templesRes.data.temples);
            if (templesRes.data.temples.length > 0 && !formData.temple) {
                setFormData(prev => ({ ...prev, temple: templesRes.data.temples[0]._id }));
            }
        } catch (err) {
            toast.error('Failed to load spiritual inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate < today) {
            toast.error('Cannot manifest slots in the past');
            return;
        }
        setEditMode(false);
        setFormData({
            ...formData,
            date: selectedDate,
            startTime: '',
            endTime: '',
            totalCapacity: 50,
            price: 50,
            slotType: 'General'
        });
        setShowModal(true);
    };

    const handleOpenEdit = (slot) => {
        setEditMode(true);
        setCurrentSlotId(slot._id);
        setFormData({
            temple: slot.temple._id,
            date: new Date(slot.date).toISOString().split('T')[0],
            startTime: slot.startTime,
            endTime: slot.endTime,
            totalCapacity: slot.totalCapacity,
            price: slot.price,
            slotType: slot.slotType,
            isActive: slot.isActive
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        if (formData.date < today) {
            toast.error('Sacred dates must be in the present or future');
            return;
        }

        try {
            if (editMode) {
                await axios.put(`/api/slots/${currentSlotId}`, formData);
                toast.success('Divine schedule updated');
            } else {
                await axios.post('/api/slots', formData);
                toast.success('Sacred slot manifested successfully');
            }
            setShowModal(false);
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Manifestation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you certain you wish to dissolve this sacred slot?')) return;
        try {
            await axios.delete(`/api/slots/${id}`);
            toast.success('Slot dissolved into ether');
            fetchInitialData();
        } catch (err) {
            toast.error('Dissolution failed');
        }
    };

    const changeDate = (days) => {
        const current = new Date(selectedDate);
        current.setDate(current.getDate() + days);
        setSelectedDate(current.toISOString().split('T')[0]);
    };

    if (loading && temples.length === 0) return (
        <div className="space-y-6 animate-pulse p-10">
            <div className="h-24 bg-white rounded-[40px] border border-cream-dark" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white rounded-[40px] border border-cream-dark" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 font-poppins pb-20">
            {/* Calendar Header Section */}
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-cream-dark relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 text-9xl text-primary/5 font-black pointer-events-none group-hover:scale-110 transition-transform italic select-none">ॐ</div>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="bg-cream p-4 rounded-3xl border border-primary/20 shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                            <CalendarIcon size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-brown tracking-tighter uppercase">Slot Control Hub</h2>
                            <div className="flex items-center gap-4 mt-2">
                                <button onClick={() => changeDate(-1)} className="p-1 hover:text-primary transition-colors"><ChevronLeft size={20} /></button>
                                <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px] min-w-[150px] text-center">
                                    {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                                </span>
                                <button onClick={() => changeDate(1)} className="p-1 hover:text-primary transition-colors"><ChevronRight size={20} /></button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                        <input
                            type="date"
                            value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-cream px-6 py-4 rounded-2xl border border-cream-dark text-xs font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all"
                        />
                        <button
                            onClick={handleOpenCreate}
                            className="bg-gradient-to-r from-primary to-orange-400 text-white px-10 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <Plus size={18} /> New Darshan Slot
                        </button>
                    </div>
                </div>
            </div>

            {/* Slots Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[48px] border border-cream-dark" />)}
                </div>
            ) : slots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {slots.map((slot, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={slot._id}
                            className="bg-white p-10 rounded-[48px] border border-cream-dark shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors pointer-events-none">
                                <Clock size={80} />
                            </div>

                            <div className="mb-8">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${slot.slotType === 'VIP' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    slot.slotType === 'Special Pooja' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                        'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>
                                    {slot.slotType}
                                </span>
                                <h4 className="text-2xl font-black text-brown mt-4 tracking-tighter leading-none group-hover:text-primary transition-all">
                                    {slot.startTime} - {slot.endTime}
                                </h4>
                                <p className="text-xs font-black text-brown/30 mt-1 uppercase tracking-widest truncate max-w-[200px]">{slot.temple?.name}</p>
                            </div>

                            <div className="space-y-6 flex-grow">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1">Price</span>
                                        <span className="text-sm font-black text-primary flex items-center gap-1">
                                            ₹{slot.price}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1 italic">Devotees</span>
                                        <span className="text-sm font-black text-brown">
                                            {slot.bookedCount}/{slot.totalCapacity}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-2 bg-cream rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${(slot.bookedCount / slot.totalCapacity) * 100}%` }}
                                    />
                                </div>

                                <div className="pt-6 border-t border-cream flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest">
                                        {slot.isActive ? (
                                            <span className="text-green-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active</span>
                                        ) : (
                                            <span className="text-red-400">Suspended</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleOpenEdit(slot)}
                                            className="p-3 bg-cream text-brown hover:bg-brown hover:text-white rounded-xl transition-all border border-cream-dark"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(slot._id)}
                                            className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center p-32 bg-white rounded-[64px] border-2 border-dashed border-cream-dark text-center shadow-inner"
                >
                    <div className="w-32 h-32 bg-cream text-brown/10 rounded-full flex items-center justify-center mb-10 shadow-inner">
                        <CalendarIcon size={64} />
                    </div>
                    <h3 className="text-3xl font-black text-brown tracking-tighter mb-4 uppercase">No Managed Slots</h3>
                    <p className="text-sm text-brown/40 max-w-sm mx-auto leading-relaxed font-bold">
                        The ritual schedule for {new Date(selectedDate).toLocaleDateString()} is currently vacant.
                    </p>
                    <button
                        onClick={handleOpenCreate}
                        className="mt-10 bg-primary text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                    >
                        Initiate Scheduling
                    </button>
                </motion.div>
            )}

            {/* Management Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-brown/80 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-[#FEFDFB] w-full max-w-2xl rounded-[64px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden border border-white/50 z-10 max-h-[90vh] flex flex-col"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-cream hover:bg-primary hover:text-white text-brown/20 rounded-2xl transition-all z-20 group"
                            >
                                <XCircle size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                            </button>

                            <div className="p-12 overflow-y-auto custom-scrollbar">
                                <header className="text-center mb-12">
                                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-inner">
                                        {editMode ? <Edit3 size={36} /> : <Plus size={36} />}
                                    </div>
                                    <h3 className="text-4xl font-black text-brown tracking-tighter mb-2 uppercase">
                                        {editMode ? 'Refine Darshan Slot' : 'Manifest New Slot'}
                                    </h3>
                                    <p className="text-brown/30 font-bold uppercase tracking-[0.4em] text-[10px]">Temporal Registry Control</p>
                                </header>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                            <ShieldCheck size={12} /> Target Temple
                                        </label>
                                        <select
                                            className="w-full p-5 bg-white rounded-3xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm appearance-none cursor-pointer"
                                            value={formData.temple}
                                            onChange={(e) => setFormData({ ...formData, temple: e.target.value })}
                                            required
                                        >
                                            {temples.map(t => (
                                                <option key={t._id} value={t._id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <CalendarIcon size={12} /> Sacred Date
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full p-5 bg-white rounded-3xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Filter size={12} /> Slot Tier
                                            </label>
                                            <select
                                                className="w-full p-5 bg-white rounded-3xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm appearance-none cursor-pointer"
                                                value={formData.slotType}
                                                onChange={(e) => setFormData({ ...formData, slotType: e.target.value })}
                                            >
                                                <option value="General">General Darshan</option>
                                                <option value="VIP">VIP (Sighra-Darshan)</option>
                                                <option value="Special Pooja">Special Pooja Slot</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Clock size={12} /> Start Time
                                            </label>
                                            <input
                                                type="time"
                                                required
                                                className="w-full p-5 bg-white rounded-3xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Clock size={12} /> End Time
                                            </label>
                                            <input
                                                type="time"
                                                required
                                                className="w-full p-5 bg-white rounded-3xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm"
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <Users size={12} /> Capacity
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full p-5 bg-white rounded-3xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm"
                                                value={formData.totalCapacity}
                                                onChange={(e) => setFormData({ ...formData, totalCapacity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] flex items-center gap-2 px-1">
                                                <IndianRupee size={12} /> Veneration Price
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full p-5 bg-white rounded-3xl border-2 border-cream-dark/40 focus:border-[#FF9933] outline-none text-sm font-bold shadow-sm"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 pt-10">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-grow py-6 bg-cream hover:bg-cream-dark text-brown text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all border border-cream-dark/30 order-2 sm:order-1 active:scale-95"
                                        >
                                            Abort Operation
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-grow py-6 bg-gradient-to-r from-[#FF9933] to-[#FFB347] text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 order-1 sm:order-2"
                                        >
                                            {editMode ? 'Commit Temporal Adjustments' : 'Seal Sacred Charter'} <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SlotManager;
