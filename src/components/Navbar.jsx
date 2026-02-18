import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Calendar, Siren, Search, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'Departments', 
      path: '/#departments',
      dropdown: ['Cardiology', 'Neurology', 'Pediatrics', 'Surgery']
    },
    { name: 'Find a Doctor', path: '/#doctors' },
    { name: 'Patients & Visitors', path: '/#patients' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white'}`}>
      {/* Top Strip */}
      <div className={`bg-primary text-white py-2 px-6 lg:px-24 transition-all duration-300 ${isScrolled ? 'hidden lg:flex' : 'flex'} justify-between items-center text-xs lg:text-sm font-medium`}>
        <div className="flex items-center gap-6">
          <a href="tel:911" className="flex items-center gap-1.5 hover:text-secondary whitespace-nowrap">
            <Siren size={14} className="text-secondary" /> Emergency: <span className="font-bold">911</span>
          </a>
          <a href="tel:+1234567890" className="hidden sm:flex items-center gap-1.5 hover:text-secondary whitespace-nowrap">
            <Phone size={14} className="text-secondary" /> +1 (555) 123-4567
          </a>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <Link to="/#portal" className="hover:text-secondary">Patient Portal</Link>
            <div className="w-px h-3 bg-white/20"></div>
            <Link to="/#careers" className="hover:text-secondary">Careers</Link>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-secondary opacity-80 hover:opacity-100 transition-opacity">
              <span className="sr-only">Facebook</span>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33A5.67,5.67,0,0,0,8.38,6.23V7.46H5V12h3.38v11.41h5.12V12h3.85Z"/></svg>
            </a>
            <a href="#" className="hover:text-secondary opacity-80 hover:opacity-100 transition-opacity">
              <span className="sr-only">Twitter</span>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.44,4.47a9.45,9.45,0,0,1-2.7.74,4.74,4.74,0,0,0,2.07-2.61,9.44,9.44,0,0,1-3,1.15,4.74,4.74,0,0,0-8.08,4.32,13.46,13.46,0,0,1-9.78-5,4.74,4.74,0,0,0,1.47,6.32,4.75,4.75,0,0,1-2.15-.59v.06a4.74,4.74,0,0,0,3.8,4.65,4.8,4.8,0,0,1-2.14.08,4.74,4.74,0,0,0,4.43,3.29,9.51,9.51,0,0,1-5.88,2,9.66,9.66,0,0,1-1.13-.07,13.43,13.43,0,0,0,7.27,2.13c8.73,0,13.5-7.23,13.5-13.5q0-.31,0-.62A9.62,9.62,0,0,0,23.44,4.47Z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <nav className="container-custom flex justify-between items-center py-3 lg:py-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 lg:gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-secondary flex items-center justify-center rounded-lg shadow-inner flex-shrink-0">
            <HeartPulseIcon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <div className="leading-none">
            <span className="text-primary font-bold text-xl lg:text-2xl tracking-tighter block uppercase">CareConnect</span>
            <span className="text-secondary text-[8px] lg:text-[10px] font-bold tracking-[0.3em] uppercase opacity-80">Health System</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name} className="relative group">
                <Link
                  to={link.path}
                  className="text-primary font-medium text-sm hover:text-secondary transition-colors py-2 flex items-center gap-1"
                >
                  {link.name}
                  {link.dropdown && <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
                </Link>
                {link.dropdown && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-divider">
                    {link.dropdown.map(item => (
                      <Link key={item} to={`/departments/${item.toLowerCase()}`} className="block px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                        {item}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-32 focus:w-48 transition-all duration-300 bg-gray-100 border-none rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-secondary outline-none"
              />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <Link to="/#book" className="bg-secondary text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-md active:scale-95">
              <Calendar size={18} /> Book Appointment
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          <Link to="/#book" className="bg-secondary text-white p-3 rounded-full shadow-md">
            <Calendar size={20} />
          </Link>
          <button 
            className="p-2 text-primary"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={32} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 bg-primary/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} lg:hidden`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-divider">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary flex items-center justify-center rounded-md">
                <HeartPulseIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-primary font-bold text-xl uppercase tracking-tighter leading-none">CareConnect</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-primary transition-colors">
              <X size={28} />
            </button>
          </div>
          
          <div className="flex flex-col p-6 gap-2 overflow-y-auto">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex justify-between items-center py-4 text-lg font-bold text-primary border-b border-divider group"
                >
                  {link.name}
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ))}
            
            <div className="mt-8 space-y-4">
              <Link 
                to="/#book" 
                onClick={() => setIsOpen(false)}
                className="bg-secondary text-white w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 text-lg shadow-lg"
              >
                <Calendar size={22} /> Book Appointment
              </Link>
              <Link 
                to="/#emergency" 
                onClick={() => setIsOpen(false)}
                className="bg-emergency text-white w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 text-lg shadow-lg uppercase tracking-widest"
              >
                <Siren size={22} /> Emergency Hub
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-divider space-y-6">
              <div className="flex items-center gap-4 text-gray-500">
                <Phone size={20} className="text-secondary" />
                <span className="font-bold">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-4 text-gray-500">
                <User size={20} className="text-secondary" />
                <span className="font-bold">Patient Portal Login</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper SVG Icon
const HeartPulseIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default Navbar;
