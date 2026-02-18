import { CheckCircle2, Calendar, Phone, User, Grid, Clock } from 'lucide-react';

const AppointmentSection = () => {
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

          {/* Right Side: Form Card */}
          <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 animate-in fade-in zoom-in duration-700">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Department" icon={Grid}>
                  <select className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary">
                    <option>Select Department</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Pediatrics</option>
                  </select>
                </InputGroup>
                
                <InputGroup label="Doctor" icon={User}>
                  <select className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary">
                    <option>Select Doctor</option>
                    <option>Dr. Sarah Johnson</option>
                    <option>Dr. Michael Chen</option>
                  </select>
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Your Name" icon={User}>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary placeholder:opacity-40"
                  />
                </InputGroup>
                
                <InputGroup label="Phone Number" icon={Phone}>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary placeholder:opacity-40"
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Date" icon={Calendar}>
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary"
                  />
                </InputGroup>
                
                <InputGroup label="Time" icon={Clock}>
                  <select className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary">
                    <option>Select Time</option>
                    <option>09:00 AM</option>
                    <option>10:30 AM</option>
                    <option>02:00 PM</option>
                  </select>
                </InputGroup>
              </div>

              <button className="btn-secondary w-full py-5 rounded-xl text-lg font-bold uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-[1.01]">
                Book Appointment Now
              </button>
            </form>
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

const InputGroup = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
      {label}
    </label>
    <div className="relative">
      {children}
    </div>
  </div>
);

export default AppointmentSection;
