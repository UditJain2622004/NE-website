import { Calendar, Users, Phone, Stethoscope } from 'lucide-react';
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
    <>
      {/* Mobile: Full-width centered bar */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl lg:hidden">
        <div className="bg-white/70 backdrop-blur-3xl rounded-2xl shadow-[0_8px_32px_rgba(28,78,149,0.18)] border border-primary/10 px-2 py-2 flex items-center justify-between gap-3">
          <button 
            onClick={() => handleNav('/#doctors')}
            className="flex flex-col items-center justify-center gap-1 bg-primary/80 text-white rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all px-2 py-3 flex-1 cursor-pointer"
          >
            <Stethoscope size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider leading-none">Find Doctors</span>
          </button>
          <button 
            onClick={() => handleNav('/#book')}
            className="flex flex-col items-center justify-center gap-1 bg-secondary/80 text-white rounded-xl shadow-lg shadow-secondary/20 active:scale-95 transition-all px-2 py-3 flex-1 cursor-pointer"
          >
            <Calendar size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider leading-none whitespace-nowrap">Book Appointment</span>
          </button>
          <button 
            onClick={() => window.location.href = 'tel:112'}
            className="flex flex-col items-center justify-center gap-1 text-red-600 border border-red-600 rounded-xl shadow-lg shadow-emergency/20 active:scale-95 transition-all px-2 py-3 flex-1 cursor-pointer"
          >
            <Phone size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider leading-none whitespace-nowrap">Emergency</span>
          </button>
        </div>
      </div>

      {/* Laptop: Vertical stack centered on right side - each expands on hover */}
      <div className="hidden lg:flex fixed top-1/2 right-6 z-40 -translate-y-1/2 flex-col items-end gap-4">
        <div className="relative h-14 w-14">
          <button 
            onClick={() => handleNav('/#book')}
            className="group/btn absolute right-0 top-0 flex items-center gap-3 h-14 w-14 rounded-full p-1.5 bg-primary/20 hover:bg-primary/30 transition-all duration-300 hover:w-[200px] overflow-hidden cursor-pointer"
          >
            <div className="shrink-0 w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white">
              <Calendar size={22} strokeWidth={2.5} />
            </div>
            <span className="whitespace-nowrap text-sm font-semibold text-primary opacity-0 max-w-0 group-hover/btn:opacity-100 group-hover/btn:max-w-[140px] transition-all duration-300">Book Appointment</span>
          </button>
        </div>
        <div className="relative h-14 w-14">
          <button 
            onClick={() => handleNav('/doctors')}
            className="group/btn absolute right-0 top-0 flex items-center gap-3 h-14 w-14 rounded-full p-1.5 bg-violet-200 hover:bg-violet-300 transition-all duration-300 hover:w-[180px] overflow-hidden cursor-pointer"
          >
            <div className="shrink-0 w-11 h-11 rounded-full bg-violet-600 flex items-center justify-center text-white">
              <Stethoscope size={22} strokeWidth={2.5} />
            </div>
            <span className="whitespace-nowrap text-sm font-semibold text-violet-700 opacity-0 max-w-0 group-hover/btn:opacity-100 group-hover/btn:max-w-[140px] transition-all duration-300">Find Doctors</span>
          </button>
        </div>
        <div className="relative h-14 w-14">
          <a 
            href="tel:112"
            className="group/btn absolute right-0 top-0 flex items-center gap-3 h-14 w-14 rounded-full p-1.5 bg-red-200 hover:bg-red-300 transition-all duration-300 hover:w-[180px] overflow-hidden"
          >
            <div className="shrink-0 w-11 h-11 rounded-full bg-red-600 flex items-center justify-center text-white">
              <Phone size={22} strokeWidth={2.5} />
            </div>
            <span className="whitespace-nowrap text-sm font-semibold text-red-700 opacity-0 max-w-0 group-hover/btn:opacity-100 group-hover/btn:max-w-[140px] transition-all duration-300">Emergency</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default StickyBottomBar;
