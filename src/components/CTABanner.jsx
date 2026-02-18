import { Link } from 'react-router-dom';
import { Calendar, Phone } from 'lucide-react';

const CTABanner = ({ 
  title = "Need Medical Assistance?", 
  subtitle = "Our dedicated medical professionals are here to provide you with the best care 24/7.",
  showButtons = true 
}) => {
  return (
    <section className="bg-primary text-white py-16 px-6 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      
      <div className="container-custom relative z-10 text-center">
        <h2 className="text-3xl lg:text-4xl font-black mb-4 text-white uppercase tracking-tight">
          {title}
        </h2>
        <p className="text-blue-100 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>
        
        {showButtons && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/#book" className="btn-secondary px-10 py-4 text-lg font-bold flex items-center gap-3 w-full sm:w-auto justify-center">
              <Calendar size={22} /> Book Appointment
            </Link>
            <a href="tel:+1234567890" className="bg-white text-primary hover:bg-blue-50 px-10 py-4 text-lg font-bold flex items-center gap-3 w-full sm:w-auto justify-center transition-colors rounded-sm">
              <Phone size={22} /> Call Now
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default CTABanner;
