import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, ArrowRight } from 'lucide-react';

const BookingCTA = () => {
  return (
    <section id="book" className="py-20 lg:py-32 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 transform translate-x-1/3 -z-0"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Info */}
          <div className="text-white">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Easy Scheduling</span>
            <h2 className="text-4xl lg:text-7xl font-bold text-white leading-[1.05] mb-8 font-display">
              Book Your Appointment <br />
              <span className="text-secondary">Online</span>
            </h2>
            <p className="text-blue-100/80 text-lg mb-12 max-w-lg leading-relaxed">
              Avoid the waiting room. Schedule your visit with our specialists in just a few clicks. Get confirmation instantly.
            </p>
            
            <div className="space-y-6">
              <CheckItem text="Choose your preferred doctor" />
              <CheckItem text="Select a convenient time slot" />
              <CheckItem text="Receive instant confirmation" />
            </div>
          </div>

          {/* Right Side: CTA Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_rgba(28,78,149,0.15)] border border-divider flex flex-col animate-in fade-in zoom-in duration-700">
              
              {/* Card Image Header */}
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="/general images/clinic2.jpg" 
                  alt="Modern Clinic" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                <div className="absolute bottom-4 left-8">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <Calendar size={28} className="text-secondary" />
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-10 text-left space-y-8">
                <div className="space-y-3">
                  <h3 className="text-2xl lg:text-3xl font-bold text-primary font-display">Ready for your visit?</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    Select your preferred department and specialist to book your slot in less than a minute.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-secondary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Direct Specialist Access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-secondary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Convenient Time Slots</span>
                  </div>
                </div>

                <Link 
                  to="/book" 
                  className="w-full py-4.5 bg-secondary text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-secondary/20 hover:bg-secondary/90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 group/btn"
                >
                  Schedule Appointment
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CheckItem = ({ text }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
      <CheckCircle2 size={18} className="text-white" />
    </div>
    <span className="font-bold text-lg font-display tracking-tight opacity-90">{text}</span>
  </div>
);

export default BookingCTA;
