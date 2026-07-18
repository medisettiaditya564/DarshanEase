import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-brown text-cream pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold font-poppins text-primary">DarshanEase</h2>
                        <p className="text-cream-dark leading-relaxed">
                            Your gateway to seamless spiritual experiences. Book darshan tickets,
                            manage rituals, and contribute to temple growth from anywhere in the world.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-primary/10 rounded-full hover:bg-primary hover:text-white transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-primary/10 rounded-full hover:bg-primary hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-primary/10 rounded-full hover:bg-primary hover:text-white transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold font-poppins mb-6 border-b-2 border-primary w-fit pb-1">Quick Links</h3>
                        <ul className="space-y-4 text-cream-dark">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/temples" className="hover:text-primary transition-colors">Explore Temples</Link></li>
                            <li><Link to="/donations" className="hover:text-primary transition-colors">Donate Now</Link></li>
                            <li><Link to="/register" className="hover:text-primary transition-colors">Join Community</Link></li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h3 className="text-xl font-bold font-poppins mb-6 border-b-2 border-primary w-fit pb-1">Information</h3>
                        <ul className="space-y-4 text-cream-dark">
                            <li><a href="#" className="hover:text-primary transition-colors">Our Mission</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Committee Members</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-bold font-poppins mb-6 border-b-2 border-primary w-fit pb-1">Contact Us</h3>
                        <ul className="space-y-4 text-cream-dark">
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-primary" />
                                <span>+91 8074898247</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-primary" />
                                <span>info@darshanease.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MapPin size={18} className="text-primary" />
                                <span>/Kakinada, Andhra Pradesh, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-cream/10 text-center text-sm text-cream-dark">
                    <p>© {new Date().getFullYear()} DarshanEase. All rights reserved. Spiritual Journeys Simplified.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
