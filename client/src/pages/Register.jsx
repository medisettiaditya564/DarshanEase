import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, UserPlus, ArrowRight, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/auth/register', formData);
            toast.success('Registration successful! Please log in to continue.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-20 flex items-center justify-center bg-[#FDFCFB] relative overflow-hidden px-6">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 p-40 opacity-[0.03] pointer-events-none -rotate-12">
                <Landmark size={500} />
            </div>
            <div className="absolute bottom-0 right-0 p-40 opacity-[0.03] pointer-events-none rotate-12">
                <UserPlus size={500} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full relative z-10"
            >
                <div className="bg-white p-16 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-cream-dark/50">
                    <div className="text-center mb-16 space-y-4">
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="w-12 h-[2px] bg-primary/30" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Integrated Temple</span>
                            <div className="w-12 h-[2px] bg-primary/30" />
                        </div>
                        <h1 className="text-5xl font-black text-brown tracking-tighter font-poppins">Identity <span className="text-primary">Creation</span></h1>
                        <p className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em]">Begin your spiritual journey today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <User size={14} className="text-primary" /> Primary Moniker
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 outline-none font-black text-brown focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <Mail size={14} className="text-primary" /> Access Coordinate
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 outline-none font-black text-brown focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <Phone size={14} className="text-primary" /> Frequency Line
                                </label>
                                <input
                                    name="phone"
                                    type="tel"
                                    className="w-full p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 outline-none font-black text-brown focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm"
                                    placeholder="+91 99999 99999"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <Lock size={14} className="text-primary" /> Authority Key
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 outline-none font-black text-brown focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brown hover:bg-primary text-white py-8 rounded-[30px] font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-95 shadow-2xl shadow-brown/20 flex items-center justify-center gap-4 group mt-4"
                        >
                            {loading ? 'Initializing Protocol...' : (
                                <>
                                    Establish Identity <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brown/40">
                            Existing Authority?{' '}
                            <Link to="/login" className="text-primary hover:text-brown transition-colors">
                                Authenticate Here
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
