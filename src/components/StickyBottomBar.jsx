import { Home, Calendar, Users, Phone, Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const scrollToHash = (hash) => {
  const id = hash.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const StickyBottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (to) => {
    const [path, hash] = to.split('#');
    const targetPath = path || '/';

    if (hash) {
      if (location.pathname === targetPath) {
        scrollToHash(`#${hash}`);
      } else {
        navigate(targetPath);
        setTimeout(() => scrollToHash(`#${hash}`), 300);
      }
    } else {
      navigate(targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-50 w-[95%] lg:w-[50%] max-w-2xl">
      <div className="bg-white/70 backdrop-blur-3xl rounded-2xl shadow-[0_8px_32px_rgba(28,78,149,0.18)] border border-primary/10 px-2 py-2 flex items-center justify-between gap-3">
        {/* Doctors CTA */}
        <button 
          onClick={() => handleNav('/#doctors')}
          className="flex flex-col items-center justify-center gap-1 bg-primary/80 text-white rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all px-2 py-3 flex-1 cursor-pointer"
        >
          <Users size={22} strokeWidth={2.5} />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-none">Find Doctors</span>
        </button>

        {/* Book CTA - Highlighted */}
        <button 
          onClick={() => handleNav('/#book')}
          className="flex flex-col items-center justify-center gap-1 bg-secondary/80 text-white rounded-xl shadow-lg shadow-secondary/20 active:scale-95 transition-all px-2 py-3 flex-1 cursor-pointer"
        >
          <Calendar size={22} strokeWidth={2.5} />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-none whitespace-nowrap">Book Appointment</span>
        </button>

        {/* Emergency CTA */}
        <button 
          onClick={() => window.location.href = 'tel:911'}
          className="flex flex-col items-center justify-center gap-1 text-red-600 border-1 border-red-600 rounded-xl shadow-lg shadow-emergency/20 active:scale-95 transition-all px-2 py-3 flex-1 cursor-pointer"
        >
          <Phone size={22} strokeWidth={2.5} />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-none whitespace-nowrap">Emergency</span>
        </button>
      </div>
    </div>
  );
};

const CTAButton = ({ icon: Icon, label, to, active, onNav }) => (
  <button 
    onClick={() => onNav(to)} 
    className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 border-none cursor-pointer transition-colors ${active ? 'text-primary' : 'text-gray-400'}`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className={`text-[10px] font-bold uppercase tracking-wider leading-none`}>{label}</span>
  </button>
);

export default StickyBottomBar;
