import { Home, Calendar, Plus, Users, MessageCircle } from 'lucide-react';
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
  const isHome = location.pathname === '/';

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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-end justify-around px-4 pt-2 pb-3 relative">
        <NavItem icon={Home} label="Home" to="/" active={isHome} onNav={handleNav} />
        <NavItem icon={Calendar} label="Book" to="/#book" onNav={handleNav} />
        
        {/* Center floating action button */}
        <div className="flex flex-col items-center -mt-5">
          <button 
            onClick={() => handleNav('/#book')}
            className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg shadow-secondary/30 active:scale-95 transition-transform"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>

        <NavItem icon={Users} label="Doctors" to="/#doctors" onNav={handleNav} />
        <NavItem icon={MessageCircle} label="Chat" to="/#chat" onNav={handleNav} />
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, to, active, onNav }) => (
  <button onClick={() => onNav(to)} className="flex flex-col items-center gap-1 min-w-[48px] bg-transparent border-none cursor-pointer">
    <Icon size={22} className={active ? 'text-secondary' : 'text-gray-400'} />
    <span className={`text-[10px] font-semibold ${active ? 'text-secondary' : 'text-gray-400'}`}>{label}</span>
  </button>
);

export default StickyBottomBar;
