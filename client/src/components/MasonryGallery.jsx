import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye } from 'lucide-react';

const MasonryGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                const res = await axios.get('/api/temples');
                const temples = res.data.temples || [];

                // Flatten all images from all temples and associate them with their temple ID
                const allImages = temples.reduce((acc, temple) => {
                    const templeImages = temple.images.map(url => ({
                        url,
                        templeId: temple._id,
                        templeName: temple.name
                    }));
                    return [...acc, ...templeImages];
                }, []);

                // Shuffle or limit if needed, but for now let's show all
                setImages(allImages.slice(0, 12)); // Limiting to top 12 for performance
            } catch (err) {
                console.error('Failed to fetch gallery imagery:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryImages();
    }, []);

    if (loading) return (
        <div className="py-24 bg-cream flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <section className="py-24 bg-cream overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-primary font-bold tracking-widest uppercase mb-4">ॐ Temple Gallery ॐ</h2>
                    <h3 className="text-4xl font-bold font-poppins text-brown">Blessings in Every Frame</h3>
                    <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full" />
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {images.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            className="relative group overflow-hidden rounded-[32px] shadow-xl border border-white/50 bg-white"
                        >
                            <img
                                src={img.url}
                                alt={img.templeName}
                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            <Link
                                to={`/temples/${img.templeId}`}
                                className="absolute inset-0 bg-brown/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center"
                            >
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-4 scale-75 group-hover:scale-100 transition-transform duration-500 border border-white/30">
                                    <Eye size={28} />
                                </div>
                                <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-1">{img.templeName}</h4>
                                <span className="text-white/60 text-[9px] font-bold uppercase tracking-[0.2em]">Explore Sanctuary</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {images.length === 0 && (
                    <div className="text-center py-20 opacity-40 italic font-medium text-brown">
                        The cosmic gallery is currently awaiting its first visual manifestations...
                    </div>
                )}
            </div>
        </section>
    );
};

export default MasonryGallery;
