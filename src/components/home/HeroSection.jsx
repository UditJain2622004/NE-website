import { Link } from 'react-router-dom';
import { Search, Calendar, Siren, ArrowRight, Play, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 lg:pt-48 pb-16 lg:pb-0 overflow-hidden bg-white">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 transform translate-x-1/4 -z-10"></div>
      
      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 z-10">
            <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-full mb-8 font-bold text-xs tracking-wider uppercase shadow-sm">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              Top Rated Hospital 2024
            </div>
            
            <h1 className="text-3xl lg:text-7xl font-bold text-primary leading-[1.1] lg:leading-[1.05] mb-6 lg:mb-8 font-display">
              Compassionate Care, <br />
              <span className="text-secondary">Advanced Medicine.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-xl leading-relaxed font-sans">
              Experience world-class healthcare with a personal touch. Our dedicated team of specialists is committed to your well-being, offering cutting-edge treatments in a comfortable environment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 mb-16">
              <Link to="/#doctors" className="btn-primary flex items-center gap-3 py-4 px-10 text-lg">
                Find a Doctor <ArrowRight size={20} />
              </Link>
              <Link to="/#services" className="bg-white border-2 border-divider text-primary hover:border-primary hover:bg-gray-50 flex items-center justify-center gap-3 py-4 px-10 text-lg rounded-md font-bold transition-all shadow-sm">
                Explore Services
              </Link>
            </div>

            <div className="flex items-center gap-12 border-divider pt-0">
              <div>
                <p className="text-4xl font-bold text-primary font-display tracking-tight">15k+</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Happy Patients</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary font-display tracking-tight">350+</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Expert Doctors</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary font-display tracking-tight">24/7</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Emergency Care</p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="lg:col-span-6 relative lg:h-[600px] flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none lg:w-[110%] lg:-mr-[10%] bg-white rounded-[2.5rem] p-4 lg:p-6 shadow-2xl border-8 border-white/50 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000&h=800"
                alt="Friendly Doctor"
                className="w-full h-full object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Floating Doctor Info Card */}
              <div className="absolute bottom-6 left-6 right-6 lg:left-12 lg:right-12 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary shadow-md flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200" alt="Dr. Sarah Mitchell" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-primary text-lg leading-tight uppercase tracking-tight">Dr. Sarah Mitchell</h4>
                  <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">Head of Cardiology</p>
                  <p className="text-gray-600 text-[10px] leading-tight opacity-80 max-w-xs italic">
                    "We prioritize listening to our patients. Understanding your story is the first step to accurate diagnosis."
                  </p>
                </div>
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Calendar size={18} />
                </div>
              </div>
            </div>
            
            {/* Background blobs */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-20"></div>
            <div className="absolute top-1/2 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-20"></div>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="mt-20 lg:mt-32 grid grid-cols-1 md:grid-cols-3 gap-0 hidden lg:grid rounded-t-2xl overflow-hidden shadow-2xl border border-divider">
          <QuickAction 
            icon={Search} 
            title="Find a Doctor" 
            desc="Choose by name or specialty"
            linkText="Search Now"
            color="bg-primary text-white"
          />
          <QuickAction 
            icon={Calendar} 
            title="Book Appointment" 
            desc="Schedule your visit online"
            linkText="Book Now"
            color="bg-[#1a3a6b] text-white"
            active
          />
          <QuickAction 
            icon={Siren} 
            title="Emergency Care" 
            desc="24/7 Ambulance support"
            linkText="Call 911"
            color="bg-[#152e55] text-white"
          />
        </div>
      </div>
    </section>
  );
};

const QuickAction = ({ icon: Icon, title, desc, linkText, color, active }) => (
  <div className={`${color} p-10 flex items-center gap-6 group transition-all duration-300 relative overflow-hidden`}>
    <div className={`p-4 rounded-full ${active ? 'bg-secondary' : 'bg-white/10 group-hover:bg-secondary'} transition-colors duration-300`}>
      <Icon size={32} />
    </div>
    <div>
      <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{title}</h3>
      <p className="text-sm opacity-70 mb-3 font-medium">{desc}</p>
      <Link to="/#action" className="inline-flex items-center gap-2 text-sm font-bold border-b-2 border-transparent hover:border-secondary hover:text-secondary p-0 transition-all uppercase tracking-widest leading-none">
        {linkText} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
    <div className="absolute -bottom-4 -right-4 opacity-5 transform rotate-12 group-hover:scale-125 transition-transform">
      <Icon size={120} />
    </div>
  </div>
);

export default HeroSection;
