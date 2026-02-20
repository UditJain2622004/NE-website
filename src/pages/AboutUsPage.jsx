import { Shield, Users, Clock, Award, CheckCircle2 } from 'lucide-react';

const AboutUsPage = () => {
  const stats = [
    { label: 'Successful Surgeries', value: '15,000+' },
    { label: 'Expert Doctors', value: '120+' },
    { label: 'Modern Rooms', value: '250+' },
    { label: 'Satisfied Patients', value: '50,000+' },
  ];

  const values = [
    {
      title: 'Patient-First Approach',
      description: 'Everything we do is centered around the well-being and comfort of our patients.',
      icon: Users
    },
    {
      title: 'Excellence in Care',
      description: 'We strive for clinical excellence through local and international collaboration.',
      icon: Award
    },
    {
      title: 'Trust & Safety',
      description: 'Maintaining the highest standards of safety and transparency in all our procedures.',
      icon: Shield
    },
    {
      title: '24/7 Availability',
      description: 'Our emergency and critical care teams are available around the clock.',
      icon: Clock
    }
  ];

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 skew-x-12 translate-x-1/4"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">Our Story</span>
            <h1 className="text-4xl lg:text-7xl font-bold mb-8 font-display leading-[1.1]">
              Redefining Healthcare <br className="hidden lg:block"/> Through Excellence
            </h1>
            <p className="text-white/80 text-lg lg:text-xl leading-relaxed mb-10">
              With a legacy of over 25 years, we are dedicated to providing world-class medical services with a touch of compassion and care.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="-mt-16 container-custom relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-divider p-8 lg:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center lg:border-r last:border-0 border-divider">
              <p className="text-3xl lg:text-5xl font-bold text-primary mb-2 font-display">{stat.value}</p>
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Hospital Building"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-secondary p-8 rounded-2xl shadow-xl hidden lg:block">
                <CheckCircle2 size={48} className="text-white mb-4" />
                <p className="text-white font-bold uppercase tracking-widest text-xs">NABH Accredited</p>
              </div>
            </div>
            
            <div>
              <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Who We Are</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-8 font-display">A Legacy of Care and Commitment</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded in 1998, our hospital has grown to become one of the most trusted names in healthcare. We began with a simple mission: to provide high-quality, affordable medical care to our community.
                </p>
                <p>
                  Today, we house over 25 specialized departments, equipped with the latest diagnostic and surgical technologies. Our team consists of world-renowned specialists and dedicated support staff who work together to ensure optimal patient outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-hospital-bg py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20 px-4">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Core Values</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-6 font-display">What We Stand For</h2>
            <p className="text-gray-600 text-lg">Our values are the foundation of our institution and guide every decision we make in our daily practice.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-10 rounded-3xl border border-divider hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4 font-display">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
