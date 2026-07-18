import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight, Landmark, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            login(data.user, data.token);
            toast.success('Welcome back to DarshanEase!');
            if (data.user.role === 'ADMIN') {
                navigate('/admin');
            } else if (data.user.role === 'ORGANIZER') {
                navigate('/organizer');
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-20 flex items-center justify-center bg-[#FDFCFB] relative overflow-hidden px-6">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-40 opacity-[0.03] pointer-events-none rotate-12">
                <Landmark size={500} />
            </div>
            <div className="absolute bottom-0 left-0 p-40 opacity-[0.03] pointer-events-none -rotate-12">
                <LogIn size={500} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full relative z-10"
            >
                <div className="bg-white p-16 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-cream-dark/50">
                    <div className="text-center mb-16 space-y-4">
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="w-12 h-[2px] bg-primary/30" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Integrated Temple</span>
                            <div className="w-12 h-[2px] bg-primary/30" />
                        </div>
                        <h1 className="text-5xl font-black text-brown tracking-tighter font-poppins">Identity <span className="text-primary">Validation</span></h1>
                        <p className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em]">Return to your spiritual journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                <Mail size={14} className="text-primary" /> Entry Coordinate
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 outline-none font-black text-brown focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm"
                                placeholder="you@darshan.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                <Lock size={14} className="text-primary" /> Authority Key
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full p-6 bg-cream/30 rounded-2xl border border-cream-dark/50 outline-none font-black text-brown focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brown hover:bg-primary text-white py-8 rounded-[30px] font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-95 shadow-2xl shadow-brown/20 flex items-center justify-center gap-4 group mt-4"
                        >
                            {loading ? 'Validating Spectrum...' : (
                                <>
                                    Enter Portal <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 text-center space-y-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brown/40">
                            Awaiting Invitation?{' '}
                            <Link to="/register" className="text-primary hover:text-brown transition-colors">
                                Create Identity
                            </Link>
                        </p>

                        <div className="pt-10 border-t border-cream-dark/50">
                            <div className="bg-cream/30 p-4 rounded-xl inline-block border border-cream-dark/30">
                                <p className="text-[8px] font-black text-brown/30 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Shield size={10} className="text-primary/40" /> System Root: admin@darshan.com • Admin@123
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
