import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, UserX, Settings, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data.users);
        } catch (err) {
            toast.error('Failed to load devotees');
        } finally {
            setLoading(false);
        }
    };

    const toggleUser = async (id) => {
        try {
            await axios.put(`/api/admin/users/${id}/toggle`);
            toast.success('Devotee status updated');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-20 bg-white rounded-[32px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-white rounded-[40px]" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-cream-dark">
                <div>
                    <h2 className="text-3xl font-black text-brown tracking-tighter">Devotee Registry</h2>
                    <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-2">Overseeing {users.length} Active Souls</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-cream text-brown px-8 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest hover:bg-cream-dark transition-all">
                        Bulk Export
                    </button>
                    <button className="bg-gradient-to-r from-primary to-orange-400 text-white px-10 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                        Invite Devotee
                    </button>
                </div>
            </div>

            {/* Devotee Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {users.map((u) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={u._id}
                        className="bg-white p-8 rounded-[40px] border border-cream-dark shadow-2xl shadow-primary/5 hover:border-primary/30 transition-all group relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-orange-400/10 rounded-[22px] flex items-center justify-center text-primary font-black text-2xl border border-primary/10 group-hover:scale-110 transition-transform">
                                {u.name[0]}
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${u.role === 'ADMIN' ? 'bg-primary text-white' : 'bg-cream text-brown/60'
                                }`}>
                                {u.role}
                            </span>
                        </div>

                        <div>
                            <h4 className="text-xl font-black text-brown group-hover:text-primary transition-colors tracking-tight truncate">{u.name}</h4>
                            <p className="text-brown/40 text-xs font-bold mt-1 truncate">{u.email}</p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-cream flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-brown/20 mb-1">Current Status</span>
                                {u.isActive ? (
                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-600">
                                        <UserCheck size={14} /> Temple Access
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400">
                                        <UserX size={14} /> Suspended
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => toggleUser(u._id)} className="p-3 bg-cream hover:bg-brown hover:text-white text-brown/60 rounded-2xl transition-all">
                                    <Settings size={20} />
                                </button>
                                <button className="p-3 bg-cream hover:bg-red-500 hover:text-white text-brown/60 rounded-2xl transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UserManager;
