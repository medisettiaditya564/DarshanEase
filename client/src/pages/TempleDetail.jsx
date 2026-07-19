import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Clock, Info, Star, Shield,
    ChevronRight, Calendar as CalendarIcon, Landmark,
    Map as MapIcon, Heart, Share2, Users, Minus, Plus, X,
    CheckCircle, ChevronLeft
} from 'lucide-react';
import TicketVoucher from '../components/TicketVoucher';

const TempleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [temple, setTemple] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Multi-Step Booking Presence logic
    const [bookingStep, setBookingStep] = useState(1);
    const [visitors, setVisitors] = useState([{ name: user?.name || '', age: '', gender: 'Male', aadhaar: '' }]);
    const [paymentDetails, setPaymentDetails] = useState({ upiId: 'darshanease@okaxis', utrId: '' });
    const [finalBookingData, setFinalBookingData] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchTemple();
    }, [id]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isLightboxOpen) return;
            if (e.key === 'ArrowRight') setCurrentImageIndex((prev) => (prev + 1) % temple.images.length);
            if (e.key === 'ArrowLeft') setCurrentImageIndex((prev) => (prev - 1 + temple.images.length) % temple.images.length);
            if (e.key === 'Escape') setIsLightboxOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, temple?.images.length]);

    useEffect(() => {
        if (id && selectedDate) {
            fetchSlots();
        }
    }, [id, selectedDate]);

    const fetchTemple = async () => {
        try {
            const { data } = await axios.get(`/api/temples/${id}`);
            setTemple(data.temple);
        } catch (err) {
            toast.error('Failed to load temple details');
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async () => {
        try {
            const { data } = await axios.get(`/api/slots?templeId=${id}&date=${selectedDate}`);
            setSlots(data.slots);
            setSelectedSlot(null); // Reset when date changes
        } catch (err) {
            console.error('Failed to load slots');
        }
    };

    const handleFinalizeBooking = async () => {
        setBookingLoading(true);
        try {
            const { data } = await axios.post('/api/bookings', {
                templeId: id,
                slotId: selectedSlot._id,
                tickets: visitors.length,
                visitors: visitors,
                paymentDetails: paymentDetails,
            });

            setFinalBookingData(data.booking);
            setBookingStep(3); // Go to success animation
            toast.success('Divine Offering Verified & Manifested');
            fetchSlots(); // Refresh slot capacity
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification flow failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book a darshan');
            return navigate('/login');
        }
        if (!selectedSlot) return toast.error('Please select a darshan slot');

        // Initialize flow
        setBookingStep(1);
        setVisitors([{ name: user?.name || '', age: '', gender: 'Male', aadhaar: '' }]);
        setPaymentDetails({ upiId: 'darshanease@okaxis', utrId: '' });
        setShowBookingModal(true);
    };

    if (loading) return (
        <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-[#FDFCFB]">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-brown/40">Synchronizing Sacred Space</span>
        </div>
    );

    if (!temple) return (
        <div className="min-h-screen pt-40 flex items-center justify-center bg-[#FDFCFB]">
            <div className="text-center space-y-4">
                <Info size={60} className="mx-auto text-brown/10 mb-6" />
                <h3 className="text-3xl font-black text-brown">Temple Not Found</h3>
                <button onClick={() => navigate('/temples')} className="text-primary font-black uppercase tracking-widest text-xs">Return to Explorer</button>
            </div>
        </div>
    );

    return (
        <div className="bg-[#FDFCFB] pt-40 pb-32 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Navigation Breadcrumb */}
                <div className="flex justify-between items-center mb-16">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-brown/40 hover:text-primary transition-all"
                    >
                        <div className="w-8 h-8 rounded-full border border-cream-dark flex items-center justify-center group-hover:border-primary/30 transition-colors">
                            <ChevronRight size={14} className="rotate-180" />
                        </div>
                        Back to Exploration
                    </button>
                    <div className="flex gap-4">
                        <button className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-black/5 flex items-center justify-center text-brown/40 hover:text-primary hover:scale-110 transition-all border border-cream-dark/30">
                            <Heart size={18} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-black/5 flex items-center justify-center text-brown/40 hover:text-primary hover:scale-110 transition-all border border-cream-dark/30">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Immersive Content - 8 Cols */}
                    <div className="lg:col-span-8 space-y-20">
                        {/* High-Fidelity Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[550px]">
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="md:col-span-8 bg-[#FDFBF7] rounded-[40px] overflow-hidden shadow-2xl flex flex-col justify-between group border border-cream-dark/30"
    >
        {/* TEXT AREA AT THE TOP */}
        <div className="p-8 pb-4">
            <h2 className="text-3xl font-black text-brown tracking-tight mb-1">
                {temple.name}
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">
                {temple.location.city}, {temple.location.state}
            </p>
            <p className="text-sm font-medium text-brown/70 leading-relaxed line-clamp-3">
                {temple.description}
            </p>
        </div>

        {/* IMAGE AREA AT THE BOTTOM */}
        <div className="w-full h-60 overflow-hidden mt-auto relative">
            <img 
                src={temple.images[0]} 
                alt={temple.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
    </motion.div>
                     <div className="md:col-span-4 h-full flex flex-col gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="h-1/2 rounded-[30px] overflow-hidden shadow-xl border border-cream-dark/30"
                                >
                                    <img src={temple.images[1] || temple.images[0]} alt={temple.name} className="w-full h-full object-cover" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    onClick={() => setIsLightboxOpen(true)}
                                    className="h-1/2 rounded-[30px] overflow-hidden shadow-xl border border-cream-dark/30 relative group cursor-pointer"
                                >
                                    <img src={temple.images[2] || temple.images[0]} alt={temple.name} className="w-full h-full object-cover brightness-50 grayscale transition-all group-hover:scale-110" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                                        <span className="text-2xl font-black font-poppins">+{Math.max(0, temple.images.length - 2)}</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Divine Views</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Temple Profile */}
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-6">
                                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">{temple.category}</span>
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="text-primary fill-primary" />
                                        <span className="text-sm font-black text-brown">{temple.rating}</span>
                                        <span className="text-[10px] font-bold text-brown/40 uppercase tracking-widest">({temple.reviewCount} Reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Shield size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest tracking-widest">Verified Temple</span>
                                    </div>
                                </div>
                                

                                <div className="flex items-center gap-6 py-6 border-y border-cream-dark/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary shadow-inner">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-brown/40">Territory</span>
                                            <span className="text-sm font-bold text-brown">{temple.location.city}, {temple.location.state}</span>
                                        </div>
                                    </div>
                                    <div className="w-[1px] h-8 bg-cream-dark" />
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary shadow-inner">
                                            <Clock size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-brown/40">Visiting Hours</span>
                                            <span className="text-sm font-bold text-brown">{temple.openTime} AM - {temple.closeTime} PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        

                            {/* Facilities Hub */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
                                {temple.facilities.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        className="flex items-center gap-4 bg-white p-6 rounded-[30px] shadow-xl shadow-black/5 border border-cream-dark/50 group transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <Shield size={16} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brown/60">{f}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Command Hub - 4 Cols */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[50px] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-cream-dark/50 sticky top-32 space-y-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                                <Landmark size={300} />
                            </div>

                            <div className="relative z-10 space-y-2">
                                <h3 className="text-3xl font-black text-brown tracking-tighter">Command <span className="text-primary">Center</span></h3>
                                <p className="text-xs font-bold text-brown/40 uppercase tracking-widest">Schedule your sacred visit</p>
                            </div>

                            {/* Date Picker Mastery */}
                            <div className="space-y-4 relative z-10">
                                <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <CalendarIcon size={14} className="text-primary" /> Departure Date
                                </label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-6 bg-cream/50 rounded-2xl border border-cream-dark/50 outline-none font-black text-brown focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm cursor-pointer"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            {/* Grid-Based Slot Mastery */}
                            <div className="space-y-4 relative z-10">
                                <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <Clock size={14} className="text-primary" /> Available Timeframes
                                </label>
                                <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {slots.length > 0 ? slots.map((slot) => (
                                        <motion.button
                                            key={slot._id}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={slot.availableSeats <= 0}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${selectedSlot?._id === slot._id
                                                ? 'border-primary bg-primary text-white shadow-xl shadow-primary/20'
                                                : 'border-cream-dark/50 bg-cream/30 hover:border-primary/50 text-brown'
                                                } ${slot.availableSeats <= 0 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                                        >
                                            <span className="text-sm font-black">{slot.startTime}</span>
                                            <div className="w-8 h-[2px] bg-current opacity-20" />
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${selectedSlot?._id === slot._id ? 'text-white/80' : 'text-primary'}`}>
                                                {slot.availableSeats} Units Remain
                                            </span>
                                        </motion.button>
                                    )) : (
                                        <div className="col-span-2 py-10 bg-cream/30 rounded-2xl border border-dashed border-cream-dark flex flex-col items-center justify-center gap-3">
                                            <Info size={24} className="text-brown/20" />
                                            <p className="text-[10px] font-black text-brown/40 uppercase tracking-widest">No Cycles Available</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Point Focus */}
                            <AnimatePresence>
                                {selectedSlot && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6 pt-10 border-t border-cream-dark/50 relative z-10"
                                    >
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-brown/40 uppercase tracking-widest">Experience Fee</span>
                                                <p className="text-4xl font-black text-brown tracking-tighter">₹{selectedSlot.price}</p>
                                            </div>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">Divine Access</span>
                                        </div>
                                        <button
                                            onClick={() => setShowBookingModal(true)}
                                            className="w-full bg-brown hover:bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-2xl shadow-brown/20 flex items-center justify-center gap-4 group"
                                        >
                                            Initialize Protocol <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Premium Multi-Step Booking Modal */}
            <AnimatePresence>
                {showBookingModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/40 backdrop-blur-xl"
                            onClick={() => !bookingLoading && setShowBookingModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            className="bg-[#FDFCFB] w-full max-w-5xl rounded-[60px] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden border border-white/10 flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]"
                        >
                            {/* Left Panel: Progress Hub */}
                            <div className="w-full md:w-80 bg-gradient-to-b from-[#FF9933] to-[#FFB347] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0 shadow-2xl">
                                <div className="absolute top-0 right-0 p-20 opacity-20 pointer-events-none">
                                    <Landmark size={300} />
                                </div>

                                <div className="relative z-10 space-y-12">
                                    <div className="space-y-4">
                                        <div className="w-12 h-[2px] bg-white/50" />
                                        <h3 className="text-2xl font-black font-poppins tracking-tighter shadow-sm">Sacred <br /><span className="text-white text-3xl">Integration</span></h3>
                                    </div>

                                    <div className="space-y-8">
                                        {[
                                            { step: 1, label: 'Visitor Nexus' },
                                            { step: 2, label: 'Offering Gateway' },
                                            { step: 3, label: 'Quantum Sync' },
                                            { step: 4, label: 'Sacred Voucher' }
                                        ].map((s) => (
                                            <div key={s.step} className="flex items-center gap-6 group">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 border-2 ${bookingStep >= s.step
                                                    ? 'bg-white border-white text-[#FF9933]'
                                                    : 'bg-white/10 border-white/20 text-white/40'
                                                    }`}>
                                                    {bookingStep > s.step ? <CheckCircle size={16} /> : s.step}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${bookingStep >= s.step ? 'text-white' : 'text-white/40'}`}>Step 0{s.step}</span>
                                                    <span className={`text-sm font-black tracking-tight ${bookingStep >= s.step ? 'text-white' : 'text-white/20'}`}>{s.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Temple Authority</span>
                                        <span className="text-xs font-black text-white">DarshanEase</span>
                                    </div>
                                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-white"
                                            animate={{ width: `${(bookingStep / 4) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Interactive Hub */}
                            <div className="flex-grow overflow-y-auto custom-scrollbar bg-white/50 relative">
                                <button
                                    onClick={() => !bookingLoading && setShowBookingModal(false)}
                                    className="absolute top-8 right-8 w-12 h-12 rounded-full bg-brown/5 hover:bg-brown/10 flex items-center justify-center text-brown/20 hover:text-brown transition-all z-20"
                                >
                                    <X size={20} />
                                </button>
                                <div className="p-8 md:p-20">
                                    <AnimatePresence mode="wait">
                                        {/* Step 1: Visitor Nexus */}
                                        {bookingStep === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-12"
                                            >
                                                <div className="space-y-2">
                                                    <h4 className="text-4xl font-black text-brown tracking-tighter">Visitor <span className="text-primary">Credentials</span></h4>
                                                    <p className="text-xs font-bold text-brown/40 uppercase tracking-widest">Valid IDs required for entry protocol</p>
                                                </div>

                                                <div className="space-y-8">
                                                    {visitors.map((visitor, index) => (
                                                        <motion.div
                                                            key={index}
                                                            layout
                                                            className="p-8 bg-white rounded-[40px] border border-cream-dark shadow-2xl shadow-black/5 space-y-8 relative overflow-hidden group"
                                                        >
                                                            <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-all">
                                                                <Users size={100} />
                                                            </div>
                                                            <div className="flex justify-between items-center relative z-10">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs">
                                                                        {index + 1}
                                                                    </div>
                                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brown/40">Devotee Quantum</span>
                                                                </div>
                                                                {index > 0 && (
                                                                    <button
                                                                        onClick={() => setVisitors(visitors.filter((_, i) => i !== index))}
                                                                        className="p-2 hover:bg-red-50 text-brown/20 hover:text-red-500 rounded-xl transition-all"
                                                                    >
                                                                        <X size={18} />
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black uppercase tracking-widest text-brown/30 px-2">Full Legal Name</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="As per Government ID"
                                                                        className="w-full p-6 bg-cream/30 rounded-2xl border-2 border-cream-dark outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-brown/20"
                                                                        value={visitor.name}
                                                                        onChange={(e) => {
                                                                            const newVisitors = [...visitors];
                                                                            newVisitors[index].name = e.target.value;
                                                                            setVisitors(newVisitors);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="flex flex-col justify-end">
                                                                        <label className="text-[9px] font-black uppercase tracking-widest text-brown/30 px-2 mb-2">Lunar Cycles (Age)</label>
                                                                        <input
                                                                            type="number"
                                                                            className="w-full h-[68px] p-6 bg-cream/30 rounded-2xl border-2 border-cream-dark outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all font-poppins"
                                                                            value={visitor.age}
                                                                            onChange={(e) => {
                                                                                const newVisitors = [...visitors];
                                                                                newVisitors[index].age = e.target.value;
                                                                                setVisitors(newVisitors);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col justify-end">
                                                                        <label className="text-[9px] font-black uppercase tracking-widest text-brown/30 px-2 mb-2">Gender</label>
                                                                        <select
                                                                            className="w-full h-[68px] p-6 bg-cream/30 rounded-2xl border-2 border-cream-dark outline-none font-bold text-brown focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-poppins"
                                                                            value={visitor.gender}
                                                                            onChange={(e) => {
                                                                                const newVisitors = [...visitors];
                                                                                newVisitors[index].gender = e.target.value;
                                                                                setVisitors(newVisitors);
                                                                            }}
                                                                        >
                                                                            <option value="Male">Male</option>
                                                                            <option value="Female">Female</option>
                                                                            <option value="Other">Other</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2 md:col-span-2">
                                                                    <label className="text-[9px] font-black uppercase tracking-widest text-brown/30 px-2 flex justify-between items-center">
                                                                        Aadhaar Identification
                                                                        {visitor.aadhaar.length === 12 && <CheckCircle size={10} className="text-green-500" />}
                                                                    </label>
                                                                    <div className="relative">
                                                                        <input
                                                                            type="text"
                                                                            maxLength={12}
                                                                            placeholder="12 Digit Unique ID Number"
                                                                            className={`w-full p-6 pl-16 bg-cream/30 rounded-2xl border-2 outline-none font-black tracking-[0.3em] text-brown focus:ring-4 focus:ring-primary/10 transition-all placeholder:tracking-normal placeholder:font-bold ${visitor.aadhaar.length > 0 && visitor.aadhaar.length < 12 ? 'border-orange-300' : 'border-cream-dark'
                                                                                }`}
                                                                            value={visitor.aadhaar}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value.replace(/\D/g, '');
                                                                                const newVisitors = [...visitors];
                                                                                newVisitors[index].aadhaar = val;
                                                                                setVisitors(newVisitors);
                                                                            }}
                                                                        />
                                                                        <Shield size={20} className="absolute left-6 top-6 text-brown/20" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}

                                                    {visitors.length < 10 && (
                                                        <button
                                                            onClick={() => setVisitors([...visitors, { name: '', age: '', gender: 'Male', aadhaar: '' }])}
                                                            className="w-full py-6 border-2 border-dashed border-cream-dark rounded-[30px] text-brown/40 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                                                        >
                                                            <Plus size={16} /> Add Co-Devotee
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="pt-12 flex justify-between items-center border-t border-cream-dark/50">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black text-brown/30 uppercase tracking-widest leading-none">Aggregated Threshold</span>
                                                        <p className="text-3xl font-black text-brown tracking-tighter">₹{selectedSlot?.price * visitors.length}</p>
                                                    </div>
                                                    <button
                                                        disabled={visitors.some(v => v.name.length < 2 || v.aadhaar.length !== 12)}
                                                        onClick={() => setBookingStep(2)}
                                                        className="px-12 py-6 bg-brown text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary transition-all shadow-2xl disabled:opacity-30 disabled:grayscale"
                                                    >
                                                        Initialize Offering Gate
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 2: Offering Gateway */}
                                        {bookingStep === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-12"
                                            >
                                                <div className="space-y-2">
                                                    <h4 className="text-4xl font-black text-brown tracking-tighter">Financial <br /><span className="text-primary tracking-tighter leading-none">Transmission</span></h4>
                                                    <p className="text-xs font-bold text-brown/40 uppercase tracking-widest">Secure UPI Protocol v.2.6</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                    {/* QR Hub */}
                                                    <div className="bg-white p-10 rounded-[50px] border border-cream-dark shadow-2xl relative overflow-hidden flex flex-col items-center justify-center space-y-6">
                                                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                                                        <div className="w-full bg-cream rounded-3xl p-8 border border-cream-dark/50 aspect-square flex items-center justify-center group relative">
                                                            <img
                                                                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=temple@upi%26pn=DarshanEase%26am=500"
                                                                alt="UPI QR"
                                                                className="w-full h-full object-contain grayscale-[0.5] group-hover:grayscale-0 transition-all"
                                                            />
                                                            <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl animate-pulse pointer-events-none" />
                                                        </div>
                                                        <div className="text-center space-y-1">
                                                            <p className="text-[10px] font-black text-brown/40 uppercase tracking-widest">Scan for Divine Offerings</p>
                                                            <p className="text-xs font-black text-primary font-poppins">UPI QR SECURE_GATEWAY</p>
                                                        </div>
                                                    </div>

                                                    {/* Form Hub */}
                                                    <div className="space-y-10">
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2">Universal Payment Interface</label>
                                                            <div className="p-6 bg-cream/50 rounded-3xl border border-cream-dark flex items-center justify-between group">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[8px] font-black text-brown/20 uppercase tracking-widest">Sacred ID</span>
                                                                    <span className="text-sm font-black text-brown tracking-tight">darshanease@okaxis</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText('darshanease@okaxis');
                                                                        toast.success('UPI ID Copied to Temple Records');
                                                                    }}
                                                                    className="p-3 bg-white text-primary border border-cream-dark rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/5 active:scale-95"
                                                                >
                                                                    <Share2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4 pt-4">
                                                            <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                                                <Shield size={14} className="text-primary" /> Transmission Proof (UTR)
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="12 Digit Transaction Reference"
                                                                className="w-full p-6 bg-white rounded-3xl border-2 border-cream-dark outline-none font-black text-brown focus:ring-4 focus:ring-primary/10 transition-all tracking-[0.2em] placeholder:tracking-tight placeholder:font-bold"
                                                                value={paymentDetails.utrId}
                                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, utrId: e.target.value.toUpperCase() })}
                                                            />
                                                            <p className="text-[9px] font-medium text-brown/30 px-2 leading-relaxed italic">Confirm your UPI transaction and enter the generated UTR number for manual verification across the temple records.</p>
                                                        </div>

                                                        <div className="pt-6 space-y-4">
                                                            <div className="flex justify-between items-center text-brown">
                                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Financial Obligation</span>
                                                                <span className="text-2xl font-black font-poppins text-primary">₹{selectedSlot?.price * visitors.length}</span>
                                                            </div>
                                                            <button
                                                                disabled={paymentDetails.utrId.length < 8}
                                                                onClick={handleFinalizeBooking}
                                                                className="w-full py-6 bg-gradient-to-r from-[#FF9933] to-[#FFB347] text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:shadow-2xl hover:shadow-primary/30 transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95"
                                                            >
                                                                Commit Transmission <ChevronRight size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setBookingStep(1)}
                                                                className="w-full text-[9px] font-black text-brown/30 uppercase tracking-widest py-2 hover:text-primary transition-colors"
                                                            >
                                                                Return to Visitor Ledger
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 3: Success Animation */}
                                        {bookingStep === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="h-full flex flex-col items-center justify-center space-y-12 text-center"
                                            >
                                                <div className="relative">
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1.2 }}
                                                        className="w-48 h-48 bg-green-500/10 rounded-full flex items-center justify-center"
                                                    >
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                                            className="w-32 h-32 bg-green-500 rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-green-500/50"
                                                        >
                                                            <CheckCircle size={64} />
                                                        </motion.div>
                                                    </motion.div>
                                                    <div className="absolute inset-0 border-4 border-dashed border-green-500/20 rounded-full animate-spin-slow" />
                                                </div>

                                                <div className="space-y-4 max-w-sm">
                                                    <h4 className="text-4xl font-black text-brown tracking-tighter">Divine <br /><span className="text-primary tracking-tighter leading-none">Registration Finalized</span></h4>
                                                    <p className="text-sm font-medium text-brown/40 leading-relaxed">Your darshan request has been successfully broadasted to the temple servers. The sacred voucher is being manifested.</p>
                                                </div>

                                                <button
                                                    onClick={() => setBookingStep(4)}
                                                    className="px-12 py-5 bg-gradient-to-r from-[#FF9933] to-[#FFB347] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all shadow-xl animate-pulse active:scale-95"
                                                >
                                                    Retrieve Sacred Passport
                                                </button>
                                            </motion.div>
                                        )}

                                        {/* Step 4: Passport/Ticket Display */}
                                        {bookingStep === 4 && (
                                            <motion.div
                                                key="step4"
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-12"
                                            >
                                                <div className="flex justify-between items-end pb-8 border-b border-cream-dark/50">
                                                    <div className="space-y-2">
                                                        <h4 className="text-4xl font-black text-brown tracking-tighter">Sacred <span className="text-primary">Passport</span></h4>
                                                        <p className="text-xs font-bold text-brown/40 uppercase tracking-widest">Entry Authorization v.1.0_PRO</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setShowBookingModal(false);
                                                            navigate('/dashboard');
                                                        }}
                                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-brown transition-colors"
                                                    >
                                                        Exit to Portal Hall
                                                    </button>
                                                </div>

                                                <TicketVoucher
                                                    booking={finalBookingData}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Divine Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-brown/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 md:p-12"
                    >
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-10 right-10 w-16 h-16 rounded-full bg-white/10 hover:bg-primary hover:text-white text-white/50 flex items-center justify-center transition-all z-[1010] group"
                        >
                            <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>

                        <div className="relative w-full max-w-6xl aspect-[16/10] group/gallery flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    src={temple.images[currentImageIndex]}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                />
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            <div className="absolute inset-y-0 left-0 flex items-center p-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex((prev) => (prev - 1 + temple.images.length) % temple.images.length);
                                    }}
                                    className="w-16 h-16 rounded-3xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10 hover:scale-110 active:scale-95"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                            </div>

                            <div className="absolute inset-y-0 right-0 flex items-center p-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex((prev) => (prev + 1) % temple.images.length);
                                    }}
                                    className="w-16 h-16 rounded-3xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10 hover:scale-110 active:scale-95"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnails Tray */}
                        <div className="mt-12 w-full max-w-4xl overflow-x-auto py-6 flex gap-4 custom-scrollbar">
                            {temple.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                    {currentImageIndex !== idx && <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20" />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Divine Vista {currentImageIndex + 1} of {temple.images.length}</span>
                            <div className="w-12 h-1 bg-primary/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentImageIndex + 1) / temple.images.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TempleDetail;
