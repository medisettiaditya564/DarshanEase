import { motion } from 'framer-motion';

const AboutSection = () => {
    return (
        <section className="py-24 bg-cream mandala-bg overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Visual Side (Two Images from Reference) */}
                    <div className="relative flex items-center justify-center lg:justify-start gap-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: -20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="z-10 rounded-[60px_0px_60px_0px] overflow-hidden shadow-2xl w-2/3 h-[500px]"
                        >
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRutybvrGhQNWU-FBJ2hTIQV9hL4V7SElzhoHudMtSSy6yhLyYCy8qccSa1D7S3k5bAE78&usqp=CAU"
                                alt="Temple Arch"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="z-20 rounded-[40px_0px_40px_0px] overflow-hidden shadow-xl w-1/2 h-[350px] mt-20"
                        >
                            <img
                                src="https://images.picxy.com/cache/2021/5/5/c80659bba585e1cccf99da76f94e4627.jpg"
                                alt="Temple Detail"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Decorative Mandala Overlay */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 opacity-5 pointer-events-none">
                            <img src="/mandala-pattern.png" alt="" className="w-full h-full animate-spin-slow" />
                        </div>
                    </div>

                    {/* Text Side (Divine Discovery) */}
                    <div className="space-y-8 lg:pl-10">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-primary font-black tracking-[0.3em] uppercase mb-4 text-[10px] md:text-xs">
                                Digital Darshan Gateway
                            </h2>
                            <h3 className="text-4xl md:text-5xl font-black font-poppins leading-tight text-brown mb-6 tracking-tighter uppercase">
                                Connecting Hearts, <br /> Bridging <span className="text-primary">Distances</span>
                            </h3>
                            <p className="text-brown/60 leading-relaxed text-base mb-8 font-medium">
                                DarshanEase is India's premier online temple ticketing platform, dedicated to bringing the sacred closer to you. We simplify the spiritual journey by providing a seamless, secure way to book Darshan slots and make offerings, ensuring your focus remains entirely on the divine experience.
                            </p>

                            <button className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-asymmetric font-bold uppercase tracking-widest text-sm transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                                Read More
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;
