import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a1e3b] text-white overflow-hidden relative pb-15">
      <div className="container-custom relative z-10">

        {/* === MOBILE FOOTER === */}
        <div className="lg:hidden py-10">
          {/* Brand + socials */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10  flex items-center justify-center">
                <img src="/logo symbol.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
              </div>
              <span className="text-white font-bold text-lg tracking-tighter">Nexus Enliven</span>
            </Link>
            <div className="flex gap-2.5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon size={14} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick contact row */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <a href="tel:+15551234567" className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3.5 py-3">
              <Phone size={15} className="text-secondary shrink-0" />
              <span className="text-xs text-gray-300 font-medium">+1 (555) 123-4567</span>
            </a>
            <a href="mailto:info@nexusenliven.com" className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3.5 py-3">
              <Mail size={15} className="text-secondary shrink-0" />
              <span className="text-xs text-gray-300 font-medium truncate">info@nexusenliven.com</span>
            </a>
          </div>

          {/* Links in two columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'Our Doctors', path: '/doctors' },
              { name: 'About Us', path: '/about' },
              { name: 'Departments', path: '/departments' },
              { name: 'Contact Us', path: '/contact' },
              { name: 'Services', path: '/services' },
              { name: 'Book Appointment', path: '/#book' },
              { name: 'Health Check Packages', path: '/services/health-check-packages' },
              // { name: 'Radiology', path: '/departments/radiology' },
              // { name: 'Pediatrics', path: '/departments/pediatrics' },
              // { name: 'Endocrinology', path: '/departments/endocrinology' }
            ].map((link) => (
              <Link key={link.name} to={link.path} className="text-gray-400 text-xs font-medium py-1">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col gap-3 items-center text-center">
            <p className="text-gray-500 text-[10px] font-medium">© 2026 Nexus Enliven Hospitals. All rights reserved.</p>
            {/* <div className="flex gap-4 text-gray-500 text-[10px] font-medium">
              <Link to="/#privacy">Privacy</Link>
              <Link to="/#terms">Terms</Link>
            </div> */}
          </div>
        </div>

        {/* === DESKTOP FOOTER === */}
        <div className="hidden lg:block pt-24 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
            
            {/* Brand Column */}
            <div className="space-y-8">
              <Link to="/" className="flex items-center gap-3">
                <div className=" flex items-center justify-center rounded-lg shadow-inner">
                  <img
                    src="/logo symbol.png"
                    alt="Logo"
                    className="w-12 h-12 object-contain rounded-lg"
                  />
                </div>
                <div className="leading-none">
                  <span className="text-white font-bold text-2xl tracking-tighter block">Nexus Enliven</span>
                </div>
              </Link>
              <p className="text-gray-400 leading-relaxed font-medium text-sm">
                Providing quality healthcare with compassion and excellence. Your health is our priority.
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
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Our Doctors', path: '/doctors' },
                  { name: 'Departments', path: '/departments' },
                  { name: 'Book Appointment', path: '/#book' },
                  { name: 'Contact Us', path: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-secondary group flex items-center gap-2 transition-all font-semibold text-sm">
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
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
                {[
                  { name: 'Medicine', path: '/departments/medicine' },
                  { name: 'Radiology', path: '/departments/radiology' },
                  { name: 'Pediatrics', path: '/departments/pediatrics' },
                  { name: 'Endocrinology', path: '/departments/endocrinology' },
                  { name: 'View All Departments', path: '/departments' }
                ].map((dept) => (
                  <li key={dept.name}>
                    <Link to={dept.path} className="text-gray-400 hover:text-secondary group flex items-center gap-2 transition-all font-semibold text-sm">
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {dept.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-8 text-white uppercase tracking-tight flex items-center gap-3 font-display">
                <span className="w-1 h-6 bg-secondary rounded-full"></span>
                Services
              </h3>
               <ul className="space-y-4">
                {[
                  { name: 'Clinic', path: '/services/clinic' },
                  { name: 'Consultation', path: '/services/consultation' },
                  { name: 'Health Check Packages', path: '/services/health-check-packages' },
                  { name: 'Diagnostics', path: '/services/diagnostics' },
                  { name: 'View All services', path: '/services' }
                ].map((dept) => (
                  <li key={dept.name}>
                    <Link to={dept.path} className="text-gray-400 hover:text-secondary group flex items-center gap-2 transition-all font-semibold text-sm">
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {dept.name}
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
                <ContactItem icon={Mail} text="info@nexusenliven.com" isLink link="mailto:info@nexusenliven.com" />
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
            <p>© 2026 Nexus Enliven Hospitals. All rights reserved.</p>
            {/* <div className="flex gap-8">
              <Link to="/#privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/#terms" className="hover:text-white">Terms of Service</Link>
            </div> */}
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
