import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Calendar, User, Users, Clock, CheckCircle,
    XCircle, Filter, Download, MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTicketPDF } from '../../utils/generateTicketPDF';

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/bookings/organizer');
            setBookings(res.data.bookings);
        } catch (err) {
            toast.error('Failed to load Temple bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.put(`/api/bookings/${id}/${action}`);
            toast.success(`Booking ${action === 'confirm' ? 'confirmed' : 'cancelled'} successfully`);
            fetchBookings();
            setShowDetails(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

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
                        <h2 className="text-3xl font-black text-brown tracking-tighter uppercase">Ritual Oversight</h2>
                        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
                            <CheckCircle size={14} /> Managing {bookings.length} Darshan Appointments
                        </p>
                    </div>

                    <div className="flex bg-cream p-2 rounded-2xl gap-2 border border-cream-dark/30 shadow-inner">
                        <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">
                            <Filter size={14} /> Refine Records
                        </button>
                    </div>
                </div>
            </div>

            {/* Bookings Table-style List */}
            <div className="space-y-4">
                {bookings.length > 0 ? (
                    bookings.map((b, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={b._id}
                            className="bg-white p-6 rounded-[32px] border border-cream-dark hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                        >
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 h-full">
                                <div className="flex items-center gap-6 w-full lg:w-auto">
                                    <div className="h-20 w-20 bg-cream rounded-2xl flex items-center justify-center text-primary font-black text-3xl border border-cream-dark shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                                        {b.user?.name[0]}
                                    </div>
                                    <div className="min-w-[200px]">
                                        <h4 className="text-xl font-black text-brown group-hover:text-primary transition-colors tracking-tighter leading-none">{b.user?.name}</h4>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-[10px] font-black text-brown/30 flex items-center gap-1.5 uppercase tracking-widest">
                                                <Calendar size={12} className="text-primary" /> {new Date(b.visitDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </span>
                                            <span className="w-1 h-1 bg-cream-dark rounded-full" />
                                            <span className="text-[10px] font-black text-brown/30 flex items-center gap-1.5 uppercase tracking-widest">
                                                <Clock size={12} className="text-primary" /> {b.visitTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0 border-cream">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1">Temple</span>
                                        <span className="text-xs font-black text-brown truncate max-w-[120px]">{b.temple?.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1">Status</span>
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border shadow-sm ${b.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-100' :
                                            b.status === 'CANCELLED' ? 'bg-red-50 text-red-500 border-red-100' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            {b.status === 'CONFIRMED' ? <CheckCircle size={12} /> : b.status === 'CANCELLED' ? <XCircle size={12} /> : <Clock size={12} />}
                                            {b.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 justify-end lg:justify-start">
                                        <button
                                            onClick={() => generateTicketPDF(b)}
                                            disabled={b.status !== 'CONFIRMED'}
                                            className={`p-4 rounded-2xl transition-all border shadow-sm ${b.status === 'CONFIRMED'
                                                ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white'
                                                : 'bg-cream text-brown/10 border-cream-dark/50 cursor-not-allowed'}`}
                                        >
                                            <Download size={20} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedBooking(b); setShowDetails(true); }}
                                            className="p-4 bg-cream hover:bg-primary hover:text-white text-brown/40 rounded-2xl transition-all border border-cream-dark/50 shadow-sm group/action"
                                            title="Inquiry & Actions"
                                        >
                                            <div className="flex items-center gap-2">
                                                <MoreHorizontal size={20} />
                                                <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover/action:block">Take Action</span>
                                            </div>
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
                            <Calendar size={64} />
                        </div>
                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-4 uppercase">Registry Empty</h3>
                        <p className="text-sm text-brown/40 max-w-sm mx-auto leading-relaxed font-bold">
                            The scrolls of Darshan are currently blank. No recent appointments have been recorded for your Temples.
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Detailed Inquiry Modal */}
            <AnimatePresence>
                {showDetails && selectedBooking && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                        {/* Overlay with balanced blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetails(false)}
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
                                            <User size={36} />
                                        </div>
                                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-2 uppercase">Devotee Insights</h3>
                                        <p className="text-brown/30 font-bold uppercase tracking-[0.3em] text-[10px]">Institutional Registry Registry Portal</p>
                                    </header>

                                    <div className="space-y-8 pb-12">
                                        {/* Devotee Info Section */}
                                        <div className="bg-white p-8 rounded-[32px] border-2 border-cream-dark/40 shadow-sm space-y-6">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div>
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Primary Representative</h5>
                                                    <p className="text-3xl font-black text-brown tracking-tighter">{selectedBooking.user?.name}</p>
                                                </div>
                                                <div className="sm:text-right">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-brown/30 mb-1">Financial Commitment</h5>
                                                    <p className="text-2xl font-black text-primary">₹{selectedBooking.totalAmount}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-cream">
                                                <div>
                                                    <h6 className="text-[9px] font-black uppercase tracking-widest text-[#FF9933] mb-1 italic">Registry Email</h6>
                                                    <p className="text-sm font-bold text-brown truncate">{selectedBooking.user?.email}</p>
                                                </div>
                                                <div>
                                                    <h6 className="text-[9px] font-black uppercase tracking-widest text-[#FF9933] mb-1 italic">Contact Channel</h6>
                                                    <p className="text-sm font-bold text-brown">{selectedBooking.user?.phone || 'Electronic Only'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ritual Logistics Section */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="p-6 bg-white rounded-[28px] border-2 border-cream-dark/40 shadow-sm group hover:border-primary/20 transition-all">
                                                <h6 className="text-[9px] font-black uppercase tracking-widest text-brown/20 mb-2">Darshan Timing</h6>
                                                <p className="text-sm font-black text-brown flex items-center gap-3">
                                                    <Clock size={16} className="text-primary" /> {selectedBooking.visitTime} Windows
                                                </p>
                                            </div>
                                            <div className="p-6 bg-white rounded-[28px] border-2 border-cream-dark/40 shadow-sm group hover:border-primary/20 transition-all">
                                                <h6 className="text-[9px] font-black uppercase tracking-widest text-brown/20 mb-2">Soul Count</h6>
                                                <p className="text-sm font-black text-brown flex items-center gap-3">
                                                    <Users size={16} className="text-primary" /> {selectedBooking.tickets} Devotees
                                                </p>
                                            </div>
                                        </div>

                                        {/* Institutional Actions Section */}
                                        <div className="flex flex-col sm:flex-row gap-5 pt-6">
                                            {selectedBooking.status === 'PENDING' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(selectedBooking._id, 'cancel')}
                                                        className="flex-grow py-5 bg-cream hover:bg-red-50 text-brown hover:text-red-500 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all border border-cream-dark/30 active:scale-95"
                                                    >
                                                        Abort Registry
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(selectedBooking._id, 'confirm')}
                                                        className="flex-grow py-5 bg-gradient-to-r from-[#FF9933] to-[#FFB347] text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                                                    >
                                                        Seal Authority <CheckCircle size={18} />
                                                    </button>
                                                </>
                                            ) : selectedBooking.status === 'CONFIRMED' ? (
                                                <div className="flex flex-col sm:flex-row gap-5 w-full">
                                                    <button
                                                        onClick={() => handleAction(selectedBooking._id, 'cancel')}
                                                        className="flex-initial sm:w-1/3 py-5 bg-cream hover:bg-red-50 text-brown hover:text-red-500 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all border border-cream-dark/30 active:scale-95"
                                                    >
                                                        Revoke Charter
                                                    </button>
                                                    <button
                                                        onClick={() => generateTicketPDF(selectedBooking)}
                                                        className="flex-grow py-5 bg-gradient-to-r from-brown to-brown/80 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-brown/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                                                    >
                                                        Emit Official Pass <Download size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full py-6 bg-cream/30 text-brown/40 text-[10px] font-black uppercase tracking-widest rounded-[32px] border-2 border-dashed border-cream-dark/40 text-center italic flex items-center justify-center gap-4">
                                                    <XCircle size={14} /> Sacred Record Cancelled
                                                </div>
                                            )}
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

export default BookingManager;
