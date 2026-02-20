import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Calendar, Siren, User, Bell, ChevronDown } from 'lucide-react';

const MobileNavLink = ({ link, setIsOpen }) => {
  const [isItemOpen, setIsItemOpen] = useState(false);
  const hasDropdown = !!link.dropdown;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center py-4 border-b border-divider">
        <Link
          to={link.path}
          onClick={() => setIsOpen(false)}
          className="text-lg font-bold text-primary grow"
        >
          {link.name}
        </Link>
        {/* {hasDropdown && (
          <button 
            onClick={() => setIsItemOpen(!isItemOpen)}
            className="p-2 text-gray-400"
          >
            <ChevronDown size={20} className={`transition-transform duration-300 ${isItemOpen ? 'rotate-180' : ''}`} />
          </button>
        )} */}
      </div>

      {/* {hasDropdown && isItemOpen && (
        <div className="bg-gray-50/50 px-4 py-2 mt-2 rounded-xl flex flex-col gap-1 animate-in slide-in-from-top-2 duration-300">
          {link.dropdownType === 'contact' ? (
            link.dropdown.map((item, idx) => (
              <a 
                key={idx}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="flex flex-col py-3 border-b border-divider/50 last:border-0"
              >
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                <span className={`text-base font-bold ${item.isRed ? 'text-emergency' : 'text-primary'}`}>{item.value}</span>
              </a>
            ))
          ) : (
            Object.entries(link.dropdown).map(([name, path]) => (
              <Link
                key={name}
                to={path}
                onClick={() => setIsOpen(false)}
                className="py-3 text-sm font-semibold text-gray-600 hover:text-secondary transition-colors"
              >
                {name}
              </Link>
            ))
          )}
        </div>
      )} */}
    </div>
  );
};

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
    { name: 'About Us', path: '/about' },
    { 
      name: 'Departments', 
      path: '/departments',
      dropdown: {'Cardiology':"/departments/cardiology", 'Neurology':"/departments/neurology", 'Pediatrics':"/departments/pediatrics"}
    },
    { name: 'Find a Doctor', path: '/doctors' },
    { 
      name: 'Contact', 
      path: '/contact', 
      dropdownType: 'contact',
      dropdown: [
        { label: 'Book an Appointment:', value: '080 4969 4969', path: 'tel:08049694969' },
        { label: 'Emergency Number:', value: '080 4962 4962', path: 'tel:08049624962', isRed: true },
        { label: 'Toll free Number:', value: '1800 202 4969', path: 'tel:18002024969' }
      ]
    },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-lg' : ''}`}>
      {/* Top Strip - desktop only */}
      <div className={`bg-primary text-white py-2 px-6 lg:px-24 transition-all duration-300 hidden lg:flex justify-between items-center text-sm font-medium`}>
        <div className="flex items-center gap-6">
          <a href="tel:911" className="flex items-center gap-1.5 hover:text-secondary whitespace-nowrap">
            <Siren size={14} className="text-secondary" /> Emergency: <span className="font-bold">911</span>
          </a>
          <a href="tel:+1234567890" className="flex items-center gap-1.5 hover:text-secondary whitespace-nowrap">
            <Phone size={14} className="text-secondary" /> +1 (555) 123-4567
          </a>
        </div>
        <div className="flex items-center gap-6">
          {/* <div className="flex items-center gap-4">
            <Link to="/#portal" className="hover:text-secondary">Patient Portal</Link>
            <div className="w-px h-3 bg-white/20"></div>
            <Link to="/#careers" className="hover:text-secondary">Careers</Link>
          </div> */}
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

      {/* Mobile Nav Bar */}
      <nav className="lg:hidden flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-white">
        <Link to="/" className="flex items-center">
          <img src="/logo2.png" alt="Logo" className="h-10 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-2">
          <a href="tel:08049624962" className="w-10 h-10 bg-emergency/10 text-emergency rounded-full flex items-center justify-center animate-pulse shadow-sm">
            <Siren size={20} />
          </a>
          <button 
            onClick={() => setIsOpen(true)} 
            className="w-10 h-10 flex items-center justify-center text-primary rounded-full hover:bg-gray-100 transition-colors"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Desktop Nav Bar */}
      <nav className="hidden lg:flex container-custom justify-between items-center py-2">
        <Link to="/" className="flex items-center">
          <img src="/logo2.png" alt="Logo" className="h-14 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-8">
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
                  <div className={`absolute top-full left-0 ${link.dropdownType === 'contact' ? 'w-64' : 'w-48'} bg-white shadow-xl rounded-lg py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-divider`}>
                    {link.dropdownType === 'contact' ? (
                      link.dropdown.map((item, index) => (
                        <div key={index}>
                          <a 
                            href={item.path} 
                            className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                          >
                            <p className="text-sm text-gray-800 mb-1">{item.label}</p>
                            <p className={`text-lg font-bold ${item.isRed ? 'text-emergency' : 'text-primary'}`}>
                              {item.value}
                            </p>
                          </a>
                          {index < link.dropdown.length - 1 && <div className="mx-6 border-b border-divider"></div>}
                        </div>
                      ))
                    ) : (
                      Object.entries(link.dropdown).map(([item, path]) => (
                        <Link key={item} to={path} className="block px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                          {item}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Link to="/#book" className="bg-secondary text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-md active:scale-95">
              <Calendar size={18} /> Book Appointment
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 bg-primary/20 backdrop-blur-sm z-60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} lg:hidden`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-divider">
            <div className="flex items-center">
              <img src="/logo2.png" alt="Logo" className="h-10 w-auto object-contain" />
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-primary transition-colors">
              <X size={28} />
            </button>
          </div>
          
          <div className="flex flex-col p-6 gap-2 overflow-y-auto">
            {navLinks.map((link) => (
              <MobileNavLink key={link.name} link={link} setIsOpen={setIsOpen} />
            ))}
            
            <div className="mt-8 space-y-4">
              <Link 
                to="/#book" 
                onClick={() => setIsOpen(false)}
                className="bg-secondary text-white w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 text-lg shadow-lg"
              >
                <Calendar size={22} /> Book Appointment
              </Link>
              
            </div>

            
          </div>
        </div>
      </div>
    </header>
  );
};


export default Navbar;
