import { Phone } from 'lucide-react';

const FloatingCallButton = () => {
  return (
    <a 
      href="tel:+1234567890" 
      className="lg:hidden fixed bottom-24 right-6 z-40 bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-secondary/90 transition-all flex items-center justify-center animate-bounce"
      aria-label="Call Emergency"
    >
      <Phone size={24} />
    </a>
  );
};

export default FloatingCallButton;
