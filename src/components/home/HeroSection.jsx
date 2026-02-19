import { Link } from 'react-router-dom';
import { Calendar, Siren, ArrowRight, Users, Search } from 'lucide-react';
import HeroCarousel from './HeroCarousel';

const HeroSection = () => {
  return (
    <section className="relative pt-16 lg:pt-28 pb-2 lg:pb-0 overflow-hidden bg-white">
      {/* Background patterns - desktop only */}
      {/* <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-red-50/50 -skew-x-12 right-[-10%] translate-x-1/3 z-0"></div> */}
        <div className="hidden lg:block absolute inset-y-0 right-[-8%] w-3/5 
  bg-gradient-to-l from-primary/15 to-primary/5 
  skew-x-9 origin-top-right z-0">
</div>

      
      <div className="relative">
        {/* === MOBILE HERO (visible < lg) === */}
        <div className="lg:hidden flex flex-col px-2">
          <div className="relative overflow-hidden h-[220px] mb-6 bg-gray-100 shadow-lg">
            <HeroCarousel className="absolute inset-0" />
          </div>
          {/* Mobile Heading & Text */}
          <div className="mb-1 px-4">
            <h1 className="text-3xl font-bold text-primary leading-tight mb-4 font-display">
              Your Health, <br />
              <span className="text-4xl text-secondary">Our Priority.</span>
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Experience world-class healthcare with a personal touch. Our dedicated team is committed to your well-being.
            </p>
            <div className="flex items-center gap-4 border-divider pt-4">
              <div>
                <p className="text-2xl font-bold text-primary font-display tracking-tight">15k+</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Happy Patients</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary font-display tracking-tight">350+</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Expert Doctors</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary font-display tracking-tight">24/7</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Emergency Care</p>
              </div>
            </div>
          </div>

          {/* Mobile Carousel Section */}
          

          {/* Mobile Actions */}
          {/* <div className="flex flex-row gap-2">
            <Link to="/#doctors" className="btn-primary px-0 flex-1 flex items-center justify-center gap-2 py-3.5 text-sm whitespace-nowrap">
              Find Doctor <ArrowRight size={16} />
            </Link>
            <Link to="/#book" className="bg-white border-2 border-divider text-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-sm rounded-md font-bold shadow-sm whitespace-nowrap">
              <Calendar size={16} /> Book Appointment
            </Link>
          </div> */}
        </div>

        {/* === DESKTOP HERO (visible >= lg) === */}
        <div className="container-custom hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 z-10">
            <h1 className="text-5xl font-bold text-primary leading-[1.05] mb-8 font-display">
              Your Health, <br />
              <span className="text-7xl text-secondary">Our Priority.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed font-sans">
              Experience world-class healthcare with a personal touch. Our dedicated team of specialists is committed to your well-being, offering cutting-edge treatments in a comfortable environment.
            </p>
            
            {/* <div className="flex flex-row gap-5 mb-16">
              <Link to="/#doctors" className="btn-primary flex items-center gap-3 py-4 px-10 text-lg">
                Find a Doctor <ArrowRight size={20} />
              </Link>
              <Link to="/#services" className="bg-white border-2 border-divider text-primary hover:border-primary hover:bg-gray-50 flex items-center justify-center gap-3 py-4 px-10 text-lg rounded-md font-bold transition-all shadow-sm">
                <Calendar size={20}/> Book Appointment
              </Link>
            </div> */}

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
          <div className="lg:col-span-6 relative lg:h-[500px] flex items-center justify-end my-10">
            <div className="relative w-full lg:w-[110%] lg:-mr-[10%] bg-white rounded-[2.5rem] p-2 border-1 border-white/50 overflow-hidden group h-[500px] lg:h-[500px]">
              <HeroCarousel className="w-full h-full rounded-4xl" />
              
              {/* Floating Doctor Info Card */}
              {/* <div className="absolute bottom-6 left-12 right-12 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary shadow-md shrink-0">
                  <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200" alt="Dr. Sarah Mitchell" />
                </div>
                <div className="grow">
                  <h4 className="font-bold text-primary text-lg leading-tight uppercase tracking-tight">Dr. Sarah Mitchell</h4>
                  <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">Head of Cardiology</p>
                  <p className="text-gray-600 text-[10px] leading-tight opacity-80 max-w-xs italic">
                    "We prioritize listening to our patients. Understanding your story is the first step to accurate diagnosis."
                  </p>
                </div>
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Calendar size={18} />
                </div>
              </div> */}
            </div>
            
            {/* Background blobs */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-20"></div>
            <div className="absolute top-1/2 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-20"></div>
          </div>
        </div>

        {/* Desktop Hero Content Ends */}
      </div>
    </section>
  );
};

export default HeroSection;
