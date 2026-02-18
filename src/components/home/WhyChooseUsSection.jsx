import { ShieldCheck, Clock, Award, HeartPulse } from 'lucide-react';

const WhyChooseUsSection = () => {
  const highlights = [
    {
      icon: Award,
      title: "Experienced Specialists",
      description: "Our team consists of board-certified medical professionals with decades of combined experience."
    },
    {
      icon: Clock,
      title: "24/7 Emergency Care",
      description: "Immediate medical response for critical situations, available every second of every day."
    },
    {
      icon: ShieldCheck,
      title: "Advanced Technology",
      description: "Equipped with state-of-the-art diagnostic and surgical equipment for precision care."
    },
    {
      icon: HeartPulse,
      title: "Patient-Centered Care",
      description: "We prioritize your comfort and well-being with personalized treatment plans."
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-3 block">Why Choose NE Hospital</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary leading-tight mb-8">
              Dedicated to Providing the <br />
              Best Medical Healthcare
            </h2>
            
            <div className="space-y-8">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-blue-50 text-secondary flex items-center justify-center rounded-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-secondary/5 rounded-sm rotate-3 transform z-0 scale-105"></div>
            <div className="relative z-10 rounded-sm overflow-hidden border-2 border-white shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000&h=1200" 
                alt="Modern Medical Equipment"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
