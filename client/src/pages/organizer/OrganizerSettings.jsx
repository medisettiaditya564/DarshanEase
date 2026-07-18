import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    User, Mail, Phone, Shield, Save,
    Lock, Bell, Landmark, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';

const OrganizerSettings = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('/api/auth/profile', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            });
            toast.success('Temple Manager profile updated');
            // Assuming useAuth has a method to refresh user data or we manually update it
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error('Passwords do not manifest equally');
        }
        setLoading(true);
        try {
            await axios.put('/api/auth/updatepassword', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            toast.success('Security credentials updated');
            setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Security update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 font-poppins pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-brown tracking-tighter">Account Settings</h1>
                <p className="text-brown/40 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 flex items-center gap-2">
                    <ShieldCheck size={12} className="text-primary" /> Manage your manager credentials and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Profile Card */}
                <div className="xl:col-span-2 space-y-12">
                    <section className="bg-white p-10 rounded-[48px] border border-cream-dark shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 text-primary/5 group-hover:scale-110 transition-transform pointer-events-none">
                            <User size={150} />
                        </div>
                        <h3 className="text-2xl font-black text-brown mb-10 flex items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                                <User size={24} />
                            </div>
                            Manager Identity
                        </h3>

                        <form onSubmit={handleProfileUpdate} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-5 bg-cream/30 rounded-3xl border-2 border-cream-dark/40 focus:border-primary outline-none text-sm font-bold pl-14 transition-all"
                                        />
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-brown/20" size={20} />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-5 bg-cream/30 rounded-3xl border-2 border-cream-dark/40 focus:border-primary outline-none text-sm font-bold pl-14 transition-all"
                                        />
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-brown/20" size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Sacred Contact (Phone)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-5 bg-cream/30 rounded-3xl border-2 border-cream-dark/40 focus:border-primary outline-none text-sm font-bold pl-14 transition-all"
                                    />
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-brown/20" size={20} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brown text-white px-10 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brown/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Save size={18} /> Update credentials
                            </button>
                        </form>
                    </section>

                    {/* Change Password */}
                    <section className="bg-white p-10 rounded-[48px] border border-cream-dark shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 text-primary/5 group-hover:scale-110 transition-transform pointer-events-none">
                            <Lock size={150} />
                        </div>
                        <h3 className="text-2xl font-black text-brown mb-10 flex items-center gap-4">
                            <div className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100">
                                <Lock size={24} />
                            </div>
                            Security Cipher
                        </h3>

                        <form onSubmit={handlePasswordChange} className="space-y-8 relative z-10">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Current Secret</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full p-5 bg-cream/30 rounded-3xl border-2 border-cream-dark/40 focus:border-primary outline-none text-sm font-bold transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">New Secret</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full p-5 bg-cream/30 rounded-3xl border-2 border-cream-dark/40 focus:border-primary outline-none text-sm font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Confirm Secret</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full p-5 bg-cream/30 rounded-3xl border-2 border-cream-dark/40 focus:border-primary outline-none text-sm font-bold transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-red-500 text-white px-10 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Shield size={18} /> Update Security Cipher
                            </button>
                        </form>
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-10">
                    <div className="bg-gradient-to-br from-primary to-orange-500 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform">
                            <Shield size={100} />
                        </div>
                        <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">Security Grade</h4>
                        <div className="w-full h-2 bg-white/20 rounded-full mb-4">
                            <div className="w-4/5 h-full bg-white rounded-full shadow-[0_0_20px_white]" />
                        </div>
                        <p className="text-xs text-white/80 font-bold leading-relaxed">
                            Your account is protected by industry-standard encryption. Temple data is isolated and secure.
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[48px] border border-cream-dark shadow-xl">
                        <h4 className="text-sm font-black text-brown mb-6 uppercase tracking-widest flex items-center gap-3">
                            <Bell size={18} className="text-primary" /> Preferences
                        </h4>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brown/60 uppercase tracking-widest">Email Alerts</span>
                                <div className="w-12 h-6 bg-primary rounded-full relative cursor-not-allowed opacity-50">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brown/60 uppercase tracking-widest">Sacred News</span>
                                <div className="w-12 h-6 bg-cream rounded-full relative cursor-not-allowed opacity-50">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-cream/30 p-10 rounded-[48px] border-2 border-dashed border-cream-dark text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
                            <Landmark size={24} />
                        </div>
                        <h4 className="text-xs font-black text-brown uppercase tracking-widest mb-2">Temple Manager</h4>
                        <p className="text-[10px] text-brown/40 font-bold leading-relaxed px-4">
                            You are an authorized guardian of sacred spaces. For critical changes, contact the administration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerSettings;
