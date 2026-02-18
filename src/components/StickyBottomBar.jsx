import { Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const StickyBottomBar = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-divider shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex">
      <a 
        href="tel:+1234567890" 
        className="flex-1 flex items-center justify-center gap-2 py-4 text-primary font-bold border-r border-divider hover:bg-gray-50 active:bg-gray-100"
      >
        <Phone size={20} /> Call Now
      </a>
      <Link 
        to="/#book" 
        className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold hover:bg-primary/90 active:bg-primary/95 transition-colors"
      >
        <Calendar size={20} /> Book Appointment
      </Link>
    </div>
  );
};

export default StickyBottomBar;
