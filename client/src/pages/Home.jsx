import { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import TempleCard from '../components/TempleCard';
import MasonryGallery from '../components/MasonryGallery';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Heart, Shield, Landmark } from 'lucide-react';

const Home = () => {
    const [featuredTemples, setFeaturedTemples] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const { data } = await axios.get('/api/temples?limit=3');
                setFeaturedTemples(data.temples);
            } catch (err) {
                console.error('Failed to fetch temples', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTemples();
    }, []);

    return (
        <div className="bg-[#FDFCFB]">
            <Hero />

            <div className="relative z-40">
                <AboutSection />
            </div>

            {/* Featured Temples - Premium Nexus Style */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none">
                    <Landmark size={400} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 mb-6"
                            >
                                <div className="w-12 h-[2px] bg-primary" />
                                <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">Divine Selection</span>
                            </motion.div>
                            <h3 className="text-4xl md:text-6xl font-black text-brown tracking-tighter leading-none mb-6">
                                Discover Sacred <br /> <span className="text-primary">Destinations</span>
                            </h3>
                            <p className="text-brown/40 text-lg font-medium max-w-lg">Explore our hand-picked Temples, chosen for their spiritual significance and architectural majesty.</p>
                        </div>
                        <Link to="/temples" className="group flex items-center gap-4 bg-brown text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl active:scale-95">
                            View All Temples
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="h-[500px] bg-cream/50 animate-pulse rounded-[40px] border border-cream-dark" />
                            ))
                        ) : (
                            featuredTemples.map((temple, i) => (
                                <motion.div
                                    key={temple._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <TempleCard temple={temple} />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Donation CTA - The Grand Offering */}
            <section className="py-32 relative overflow-hidden bg-brown mandala-bg border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-[2px] bg-primary" />
                                <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">Sacred Contribution</span>
                            </div>
                            <h3 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                                Every <span className="text-primary">Offering</span> <br /> Ignites A Flame
                            </h3>
                            <p className="text-white/40 text-xl leading-relaxed font-medium">
                                Your devotion through donation fuels the preservation of our ancient heritage and supports the continuation of sacred rituals and community service.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <Link to="/donations" className="px-14 py-6 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/40 active:scale-95">
                                    Donate Now
                                </Link>
                                <div className="flex items-center gap-4 px-8 py-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-black text-xs">✓</div>
                                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Secure & Verified</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            <div className="rounded-[80px_0px_80px_0px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] h-[600px] border border-white/10">
                                <img src="https://iskcondwarka.org/wp-content/uploads/2025/01/Significance-of-Temple-Donations.jpg" alt="Offering" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[40px] shadow-3xl border border-cream-dark flex flex-col items-center gap-2 z-20 hover:scale-105 transition-transform cursor-default">
                                <span className="text-6xl font-black text-primary tracking-tighter leading-none">500+</span>
                                <span className="text-[10px] font-black text-brown/40 uppercase tracking-[0.2em] text-center leading-tight">Devotees <br /> Contributed</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>



            <MasonryGallery />
        </div>
    );
};

export default Home;
