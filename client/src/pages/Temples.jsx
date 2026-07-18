import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import TempleCard from '../components/TempleCard';
import { Search, Filter, MapPin, Landmark, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const Temples = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(queryParams.get('search') || '');
    const [category, setCategory] = useState(queryParams.get('category') || '');
    const [city, setCity] = useState(queryParams.get('city') || '');
    const [hasSearched, setHasSearched] = useState(!!location.search);

    const categories = ['Hindu', 'Jain', 'Buddhist', 'Sikh'];
    const cities = ['Mumbai', 'Tirupati', 'Varanasi', 'Katra', 'Kolhapur', 'Veraval'];

    const fetchTemples = useCallback(async (searchQuery = search) => {
        setLoading(true);
        try {
            let url = `/api/temples?search=${searchQuery}`;
            if (category) url += `&category=${category}`;
            if (city) url += `&city=${city}`;
            const { data } = await axios.get(url);
            setTemples(data.temples);
            setHasSearched(true);
        } catch (err) {
            console.error('Failed to fetch temples', err);
        } finally {
            setLoading(false);
        }
    }, [category, city, search]);

    useEffect(() => {
        fetchTemples();
    }, [category, city, fetchTemples]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchTemples();
    };

    return (
        <div className="pt-40 pb-32 bg-[#FDFCFB] min-h-screen">
            {/* Background Decorative Element */}
            <div className="fixed top-0 right-0 p-40 opacity-[0.03] pointer-events-none z-0">
                <Landmark size={600} />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                {/* Header Hub */}
                <div className="mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-12 h-[2px] bg-primary" />
                        <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">Explore Temples</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-brown tracking-tighter leading-none">
                        Sacred <span className="text-primary">Destinations</span>
                    </h1>
                    <p className="text-brown/40 text-lg font-medium max-w-xl">Embark on a spiritual journey through our curated collection of verified temples and sacred sites across the Bharat region.</p>
                </div>

                {/* Glassmorphic Search Hub */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] p-4 md:p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] mb-20 border border-cream-dark/50"
                >
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="px-6 py-4 bg-cream/50 rounded-2xl border border-cream-dark/30 flex items-center gap-4 group focus-within:border-primary transition-colors">
                            <Search className="text-primary/60" size={20} />
                            <div className="flex flex-col w-full">
                                <span className="text-[8px] font-black uppercase tracking-widest text-brown/40 mb-0.5">Temple</span>
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    className="w-full bg-transparent outline-none text-brown font-bold text-sm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-cream/50 rounded-2xl border border-cream-dark/30 flex items-center gap-4 group focus-within:border-primary transition-colors">
                            <Filter className="text-primary/60" size={20} />
                            <div className="flex flex-col w-full">
                                <span className="text-[8px] font-black uppercase tracking-widest text-brown/40 mb-0.5">Tradition</span>
                                <select
                                    className="w-full bg-transparent outline-none text-brown font-bold text-sm appearance-none cursor-pointer"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">All Traditions</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-cream/50 rounded-2xl border border-cream-dark/30 flex items-center gap-4 group focus-within:border-primary transition-colors">
                            <MapPin className="text-primary/60" size={20} />
                            <div className="flex flex-col w-full">
                                <span className="text-[8px] font-black uppercase tracking-widest text-brown/40 mb-0.5">Territory</span>
                                <select
                                    className="w-full bg-transparent outline-none text-brown font-bold text-sm appearance-none cursor-pointer"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                >
                                    <option value="">All Regions</option>
                                    {cities.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="h-full bg-brown hover:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-brown/10">
                            Seek Darshan
                        </button>
                    </form>
                </motion.div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[500px] bg-cream/50 animate-pulse rounded-[40px] border border-cream-dark" />
                        ))}
                    </div>
                ) : temples.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {temples.map((temple, i) => (
                            <motion.div
                                key={temple._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <TempleCard temple={temple} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 px-6 bg-white rounded-[60px] border border-cream-dark/50 shadow-xl"
                    >
                        <div className="w-32 h-32 bg-cream rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-white shadow-lg">
                            <Compass size={60} className="text-primary/30 animate-pulse" />
                        </div>
                        <h3 className="text-4xl font-black text-brown tracking-tighter mb-4">
                            No Temples Found
                        </h3>
                        <p className="text-brown/40 font-medium max-w-md mx-auto mb-12">
                            {search
                                ? `No temples currently match your search for "${search}". Please refine your search.`
                                : "No temples currently match your selected filters. Broaden your exploration to discover more."
                            }
                        </p>
                        <button
                            onClick={() => { setSearch(''); setCategory(''); setCity(''); fetchTemples(''); }}
                            className="bg-brown hover:bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-2xl shadow-brown/20"
                        >
                            Reset Exploration
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Temples;
