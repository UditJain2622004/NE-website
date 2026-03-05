import { Phone } from 'lucide-react';

const FloatingCallButton = () => {
  return (
    <a 
      href="tel:+919187634758" 
      className="hidden lg:flex fixed bottom-8 right-8 z-40 bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-secondary/90 transition-all items-center justify-center"
      aria-label="Call Emergency"
    >
      <Phone size={24} />
    </a>
  );
};

export default FloatingCallButton;
