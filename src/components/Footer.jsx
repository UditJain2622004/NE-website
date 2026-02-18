import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, HeartPulse, ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a1e3b] text-white pt-24 pb-12 overflow-hidden relative">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded-lg shadow-inner">
                <HeartPulseIcon className="w-8 h-8 text-white" />
              </div>
              <div className="leading-none">
                <span className="text-white font-bold text-2xl tracking-tighter block uppercase">CareConnect</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed font-medium text-sm">
              Providing world-class healthcare with compassion and excellence. Your health is our priority.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all group">
                  <Icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white uppercase tracking-tight flex items-center gap-3 font-display">
              <span className="w-1 h-6 bg-secondary rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-4">
              {['About Us', 'Our Doctors', 'Departments', 'Book Appointment', 'Contact Us'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-gray-400 hover:text-secondary group flex items-center gap-2 transition-all font-semibold text-sm">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white uppercase tracking-tight flex items-center gap-3 font-display">
              <span className="w-1 h-6 bg-secondary rounded-full"></span>
              Departments
            </h3>
            <ul className="space-y-4">
              {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Surgery'].map((dept) => (
                <li key={dept}>
                  <Link to="/" className="text-gray-400 hover:text-secondary group flex items-center gap-2 transition-all font-semibold text-sm">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {dept}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white uppercase tracking-tight flex items-center gap-3 font-display">
              <span className="w-1 h-6 bg-secondary rounded-full"></span>
              Contact Us
            </h3>
            <div className="space-y-6">
              <ContactItem icon={MapPin} text="123 Medical Center Drive, Health City, HC 90210" />
              <ContactItem icon={Phone} text="+1 (555) 123-4567" isLink link="tel:+15551234567" />
              <ContactItem icon={Mail} text="info@careconnect.com" isLink link="mailto:info@careconnect.com" />
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none mb-1">Mon - Fri</p>
                  <p className="text-xs font-medium">8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <p>© 2024 CareConnect Health System. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/#privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/#terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/#sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
      
      {/* Background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 -skew-x-12 transform translate-x-1/2 pointer-events-none"></div>
    </footer>
  );
};

const ContactItem = ({ icon: Icon, text, isLink, link }) => (
  <div className="flex items-center gap-4 text-gray-400 group">
    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-all">
      <Icon size={18} className="text-secondary" />
    </div>
    {isLink ? (
      <a href={link} className="hover:text-white font-semibold text-sm transition-all">{text}</a>
    ) : (
      <p className="font-semibold text-sm">{text}</p>
    )}
  </div>
);

// Helper Icons
const HeartPulseIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default Footer;
