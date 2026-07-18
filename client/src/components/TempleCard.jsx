import { MapPin, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TempleCard = ({ temple }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-cream-dark/50 group transition-all duration-500"
        >
            {/* Image Container with Premium Badge */}
            <div className="relative h-72 overflow-hidden">
                <img
                    src={temple.images[0] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"}
                    alt={temple.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                />

                {/* Floating Rating Badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center shadow-xl border border-cream-dark/30">
                    <Star size={14} className="text-primary fill-primary mr-2" />
                    <span className="text-xs font-black text-brown">{temple.rating || '4.8'}</span>
                </div>

                {/* Bottom Overlay with Category */}
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-brown/80 via-brown/20 to-transparent">
                    <span className="text-white/90 text-[10px] font-black uppercase tracking-[0.2em]">{temple.category || 'Hindu Temple'}</span>
                </div>
            </div>

            {/* Content Hub */}
            <div className="p-8 space-y-4">
                <h3 className="text-2xl font-black font-poppins text-brown tracking-tighter group-hover:text-primary transition-colors leading-tight">
                    {temple.name}
                </h3>

                <div className="flex items-center text-brown/40 text-xs font-bold uppercase tracking-widest">
                    <MapPin size={16} className="text-primary mr-2 flex-shrink-0" />
                    <span className="truncate">{temple.location.city} • {temple.location.state}</span>
                </div>

                <p className="text-sm text-brown/60 font-medium line-clamp-2 leading-relaxed h-10">
                    {temple.description}
                </p>

                <div className="pt-6 flex items-center justify-between border-t border-cream-dark/50">
                    <span className="text-primary font-black text-xs uppercase tracking-widest">Free Entry</span>
                    <Link
                        to={`/temples/${temple._id}`}
                        className="group/btn flex items-center gap-2 text-xs font-black text-brown uppercase tracking-widest hover:text-primary transition-all"
                    >
                        Explore <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default TempleCard;
