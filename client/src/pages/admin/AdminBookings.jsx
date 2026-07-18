import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Calendar, User, Users, Clock, CheckCircle,
    XCircle, Filter, Download, MoreHorizontal,
    Landmark, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTicketPDF } from '../../utils/generateTicketPDF';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/bookings/all');
            setBookings(res.data.bookings);
        } catch (err) {
            toast.error('Failed to load global registry');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.put(`/api/bookings/${id}/${action}`);
            toast.success(`Charter ${action === 'confirm' ? 'confirmed' : 'cancelled'} successfully`);
            fetchBookings();
            setShowDetails(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.temple?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            {/* Master Header */}
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-cream-dark relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 text-9xl text-primary/5 font-black pointer-events-none group-hover:scale-110 transition-transform italic select-none">ॐ</div>
                <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-8">
                    <div>
                        <h2 className="text-3xl font-black text-brown tracking-tighter uppercase">Global Ritual Nexus</h2>
                        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
                            <CheckCircle size={14} /> Overseeing {bookings.length} Temple Appointments
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row bg-cream p-2 rounded-2xl gap-2 border border-cream-dark/30 shadow-inner w-full xl:w-auto">
                        <div className="relative flex-grow min-w-[300px]">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/30" />
                            <input
                                type="text"
                                placeholder="Search by Devotee or Temple..."
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center justify-center gap-3 px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">
                            <Download size={14} /> Export Registry
                        </button>
                    </div>
                </div>
            </div>

            {/* Global Bookings List */}
            <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((b, i) => (
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
                                        <div className="flex flex-col gap-1 mt-3">
                                            <span className="text-[10px] font-black text-brown/30 flex items-center gap-1.5 uppercase tracking-widest">
                                                <Calendar size={12} className="text-primary" /> {new Date(b.visitDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} at {b.visitTime}
                                            </span>
                                            <span className="text-[10px] font-black text-primary/60 flex items-center gap-1.5 uppercase tracking-widest">
                                                <Landmark size={12} /> {b.temple?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0 border-cream">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1 italic">Devotees</span>
                                        <span className="text-xs font-black text-brown">{b.tickets} Souls</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brown/20 mb-1 italic">Charter Status</span>
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
                                            className="p-4 bg-cream hover:bg-primary hover:text-white text-brown/40 rounded-2xl transition-all border border-cream-dark/50 shadow-sm group/action flex items-center gap-3"
                                        >
                                            <MoreHorizontal size={20} />
                                            <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover/action:block">Modify</span>
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
                            <Search size={64} />
                        </div>
                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-4 uppercase">No Records Located</h3>
                        <p className="text-sm text-brown/40 max-w-sm mx-auto leading-relaxed font-bold">
                            {searchTerm ? `The cosmic registry found no results for "${searchTerm}".` : 'The cosmic registry is currently silent. No active Temple appointments recorded.'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-10 px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all"
                            >
                                Reset Registry Search
                            </button>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Admin Detail Modal */}
            <AnimatePresence>
                {showDetails && selectedBooking && (
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
                            <div className="p-12 relative">
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
                                            <Shield size={36} />
                                        </div>
                                        <h3 className="text-3xl font-black text-brown tracking-tighter mb-2 uppercase">Master Oversight</h3>
                                        <p className="text-brown/30 font-bold uppercase tracking-[0.3em] text-[10px]">Registry Authority Override</p>
                                    </header>

                                    <div className="space-y-8">
                                        <div className="bg-white p-8 rounded-[32px] border-2 border-cream-dark/40 shadow-sm">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Devotee Name</h5>
                                                    <p className="text-2xl font-black text-brown">{selectedBooking.user?.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-brown/30 mb-1">Total Transaction</h5>
                                                    <p className="text-2xl font-black text-primary">₹{selectedBooking.totalAmount}</p>
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-cream grid grid-cols-2 gap-6">
                                                <div>
                                                    <h6 className="text-[9px] font-black uppercase text-[#FF9933] mb-1 italic">Institution</h6>
                                                    <p className="text-xs font-bold text-brown">{selectedBooking.temple?.name}</p>
                                                </div>
                                                <div>
                                                    <h6 className="text-[9px] font-black uppercase text-[#FF9933] mb-1 italic">Timing</h6>
                                                    <p className="text-xs font-bold text-brown">{selectedBooking.visitTime} Windows</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-5">
                                            {selectedBooking.status === 'PENDING' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(selectedBooking._id, 'cancel')}
                                                        className="flex-grow py-5 bg-cream hover:bg-red-50 text-brown hover:text-red-500 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all border border-cream-dark/30"
                                                    >
                                                        Revoke Charter
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(selectedBooking._id, 'confirm')}
                                                        className="flex-grow py-5 bg-gradient-to-r from-primary to-orange-400 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
                                                    >
                                                        Confirm Registry Authority
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleAction(selectedBooking._id, selectedBooking.status === 'CONFIRMED' ? 'cancel' : 'confirm')}
                                                    className={`w-full py-5 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all flex items-center justify-center gap-3 ${selectedBooking.status === 'CONFIRMED'
                                                        ? 'bg-cream hover:bg-red-50 text-brown hover:text-red-500'
                                                        : 'bg-primary text-white shadow-xl'
                                                        }`}
                                                >
                                                    {selectedBooking.status === 'CONFIRMED' ? 'Void This Charter' : 'Reinstate Charter Authority'}
                                                </button>
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

export default AdminBookings;
