import { Link } from 'react-router-dom';

const FounderIntroSection = () => {
  return (
    <section className="relative py-8 lg:py-14 px-4 lg:px-6 bg-gray-50 overflow-hidden bg-primary/5">
      {/* Organic blob shapes - left and bottom */}
      <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute left-0 bottom-0 w-[500px] h-72 rounded-[40%_60%_70%_30%_/40%_50%_60%_50%] bg-secondary/15" />
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-64 h-96 rounded-[60%_40%_30%_70%_/60%_30%_70%_40%] bg-blue-100/60" />
      <div className="absolute left-[15%] -bottom-16 w-72 h-48 rounded-[50%_50%_30%_70%_/60%_40%_60%_40%] bg-gray-200/50" />

      <div className="relative max-w-7xl mx-auto">
        <div  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center transition-opacity hover:opacity-95 cursor-pointer">
          {/* Founder Photo - left side with design frame */}
          <div className="lg:col-span-6 order-1 relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md group">
              {/* Decorative offset block - fills space behind image */}
              {/* <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-primary/15 to-secondary/20 rounded-2xl -z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" /> */}
              
              {/* Accent corner bracket */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-l-4 border-t-4 border-primary/30 rounded-tl-2xl z-20 pointer-events-none" />
              
              {/* Image container */}
              <div className="relative overflow-hidden rounded-xl bg-white shadow-xl aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
                <img
                  src="/intro2.png"
                  alt="Dr. Abhijith Reddy A - Founder & CEO, Nexus Enliven"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle overlay for better integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Decorative dots or elements could go here if needed, but keeping it clean for now */}
            </div>
          </div>

          {/* Founder Content */}
          <div className="lg:col-span-6 order-2">
            <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">
              Meet Our Founder
            </span>
            <Link to="/doctors/abhijith-reddy">
            <h2 className="text-3xl lg:text-4xl font-black text-primary leading-tight mb-3 font-display">
              
              Dr. Abhijith Reddy A
            </h2>
            </Link>
            <p className="text-secondary font-semibold text-lg mb-2">
              MBBS, FICCC, FICD, MBA (UK)
            </p>
            <p className="text-primary font-bold uppercase tracking-wide text-sm mb-4">
              Founder & Clinical Consultant · Nexus Enliven
            </p>

            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>
                Dr. Abhijith Reddy A is the Founder and CEO of Nexus Enliven, combining medical expertise with strong healthcare leadership. After completing his MBBS, he earned fellowships (FICCC, FICD) and pursued an MBA in Healthcare Management in the UK to strengthen his strategic and organizational skills.
              </p>
              <p>
                He leads Nexus Enliven with a clear vision to build a patient-centered, ethical, and innovative healthcare institution focused on quality care, operational excellence, and sustainable growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderIntroSection;
