import React from 'react';
import { Landmark, Calendar, Clock, MapPin, Users, QrCode, Shield, Download, CheckCircle, Ticket, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { generateTicketPDF } from '../utils/generateTicketPDF';

const TicketVoucher = ({ booking }) => {
    const navigate = useNavigate();
    if (!booking) return null;

    const bookingId = booking._id?.slice(-8).toUpperCase() || 'UNKNOWN';

    return (
        <div id="divine-ticket" className="relative max-w-2xl mx-auto font-poppins">
            {/* Main Ticket Body */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-cream-dark relative"
            >
                {/* Institutional Header (Boarding Pass Style) */}
                <div className="bg-[#FF9933] p-10 md:p-14 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none">
                        <Landmark size={200} />
                    </div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none italic">Darshan <span className="opacity-80">Pass</span></h2>
                            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] opacity-80 decoration-white/30 underline underline-offset-4">Institutional Ritual Credential</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black opacity-60 uppercase tracking-widest leading-none">Booking ID</span>
                            <p className="text-xl font-black mt-2 tracking-widest">#{bookingId}</p>
                        </div>
                    </div>

                    {/* Notches - Header Bottom */}
                    <div className="absolute -bottom-5 -left-5 w-10 h-10 rounded-full bg-[#FDFCFB] border-t border-cream-dark" />
                    <div className="absolute -bottom-5 -right-5 w-10 h-10 rounded-full bg-[#FDFCFB] border-t border-cream-dark" />
                </div>

                {/* Main Content Hub */}
                <div className="p-10 md:p-14 space-y-10">
                    {/* Destination Section */}
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF9933] mb-2 italic">Sacred Destination</span>
                            <h3 className="text-3xl md:text-4xl font-black text-brown tracking-tighter leading-none">{booking.temple?.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-brown/50 font-bold mt-2">
                                <MapPin size={14} className="text-[#FF9933]" />
                                <span>{booking.temple?.location?.city}, {booking.temple?.location?.state}</span>
                            </div>
                        </div>

                        <div className="h-0.5 w-full bg-repeating-dots bg-center opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #2D1B08 1.5px, transparent 1.5px)', backgroundSize: '15px 15px' }} />
                    </div>

                    {/* Information Micro-Grid */}
                    <div className="grid grid-cols-2 gap-y-12 gap-x-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brown/30 mb-2">Primary Devotee</p>
                            <p className="text-lg font-black text-brown">{booking.user?.name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brown/30 mb-2">Devotee Count</p>
                            <p className="text-lg font-black text-brown uppercase tracking-tight">{booking.tickets} Souls</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brown/30 mb-2">Scheduled Date</p>
                            <p className="text-lg font-black text-brown flex items-center gap-2">
                                <Calendar size={18} className="text-[#FF9933]" />
                                {new Date(booking.visitDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brown/30 mb-2">Arrival Timing</p>
                            <p className="text-lg font-black text-[#FF9933] flex items-center gap-2">
                                <Clock size={18} />
                                {booking.visitTime} SLOT
                            </p>
                        </div>
                    </div>

                    {/* Secondary Fold / Notches */}
                    <div className="relative">
                        <div className="h-0.5 w-full bg-repeating-dots opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #2D1B08 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
                        <div className="absolute -top-5 -left-[72px] w-10 h-10 rounded-full bg-[#FDFCFB] border-r border-cream-dark" />
                        <div className="absolute -top-5 -right-[72px] w-10 h-10 rounded-full bg-[#FDFCFB] border-l border-cream-dark" />
                    </div>

                    {/* Finalization Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="space-y-6 w-full md:w-auto">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brown/30 mb-2">Offering Tier</p>
                                <p className="text-4xl font-black text-brown tracking-tighter leading-none">₹{booking.totalAmount}</p>
                            </div>
                            <div className="flex items-center gap-3 text-emerald-600">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Verified Secure</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-[32px] border-2 border-cream-dark/30 shadow-xl shadow-black/5 group hover:border-[#FF9933]/30 transition-all">
                            <QrCode size={100} className="text-brown group-hover:scale-105 transition-transform" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-brown/20 italic">Scan for ritual audit</span>
                        </div>
                    </div>
                </div>

                {/* Sub-Branding Footer */}
                <div className="bg-orange-50/50 p-6 text-center border-t border-orange-100/50">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.4em] text-orange-900/40">Verified by DarshanEase Institution • Non-Transferable Registry</p>
                </div>
            </motion.div>

            {/* Unified Action Ritual */}
            <div className="mt-10 space-y-4">
                <button
                    onClick={() => generateTicketPDF(booking)}
                    className="w-full py-6 bg-gradient-to-r from-[#FF9933] to-[#FFB347] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl hover:shadow-2xl hover:shadow-primary/30 transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95 group"
                >
                    <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white group-hover:text-[#FF9933] transition-all">
                        <Download size={18} />
                    </div>
                    Download Official Charter
                </button>

                <button
                    onClick={() => navigate('/temples')}
                    className="w-full py-6 bg-white border-2 border-[#FF9933] text-[#FF9933] text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-[#FF9933]/5 transition-all flex items-center justify-center gap-4 active:scale-95 group"
                >
                    <div className="p-2 bg-[#FF9933]/10 rounded-xl group-hover:bg-[#FF9933] group-hover:text-white transition-all">
                        <Compass size={18} />
                    </div>
                    Explore More Temples
                </button>
                <p className="text-center mt-6 text-[9px] font-black uppercase tracking-widest text-brown/20 uppercase">Authorized Electronic Transmission Only</p>
            </div>
        </div>
    );
};

export default TicketVoucher;
