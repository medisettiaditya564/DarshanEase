import { useState } from 'react';
import {
    User, Lock, Shield, Bell,
    Save, Key, ShieldAlert, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminSettings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/auth/profile', profileData);
            toast.success('Grand Master profile synchronized successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Profile sync failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Authority keys do not match');
        }
        setLoading(true);
        try {
            await axios.put('/api/auth/updatepassword', passwordData);
            toast.success('Master access key updated');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Access key update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 font-poppins pb-20">
            {/* Master Header */}
            <div className="bg-brown p-12 rounded-[48px] text-white relative overflow-hidden group border border-white/10 shadow-3xl">
                <div className="absolute top-0 right-0 p-12 text-primary opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield size={300} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/30">
                            Nexus Grand Master
                        </span>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter mb-4 leading-none">Institutional Security Hub</h2>
                    <p className="text-white/40 font-medium max-w-xl text-sm leading-relaxed">
                        Managing global administrative credentials and core security protocols for the DarshanEase Nexus.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Profile Synchronization */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-asymmetric bg-white p-12 border border-cream-dark shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none italic font-black text-[120px]">ॐ</div>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                            <User size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-brown tracking-tight">Identity Registry</h3>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brown/30 ml-1">Grand Master Name</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-cream/30 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold placeholder:text-brown/10"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brown/30 ml-1">Institutional Email</label>
                                <input
                                    type="email"
                                    className="w-full p-4 bg-cream/30 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                                    value={profileData.email}
                                    readOnly
                                />
                                <p className="text-[9px] text-primary font-black italic mt-1 px-1 flex items-center gap-1">
                                    <ShieldAlert size={10} /> Account email is hard-locked to primary authority
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brown/30 ml-1">Priority Contact Channel</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-cream/30 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold placeholder:input-phone"
                                    placeholder="+91 XXXX XXXX"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brown text-white text-[10px] font-black uppercase tracking-widest rounded-[22px] shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <Save size={16} /> Synchronize Identity
                        </button>
                    </form>
                </motion.div>

                {/* Access Key Rotation */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-asymmetric bg-white p-12 border border-cream-dark shadow-2xl relative overflow-hidden"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                            <Key size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-brown tracking-tight">Access Key Management</h3>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brown/30 ml-1">Current Authority Pass</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full p-4 bg-cream/30 rounded-2xl border-none focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brown/30 ml-1">New Authority Access Key</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full p-4 bg-cream/30 rounded-2xl border-none focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brown/30 ml-1">Confirm Access Key</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full p-4 bg-cream/30 rounded-2xl border-none focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-[10px] font-black uppercase tracking-widest rounded-[22px] shadow-2xl shadow-blue-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <Lock size={16} /> Rotate Authority Key
                        </button>
                    </form>

                    <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
                        <Shield size={24} className="text-blue-500 shrink-0 mt-1" />
                        <div>
                            <p className="text-[10px] font-black text-brown uppercase tracking-widest mb-1">Security Note</p>
                            <p className="text-[10px] text-brown/60 font-medium leading-relaxed italic">
                                Institutional keys must be updated every 90 solar cycles for optimal security synchronization.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminSettings;
