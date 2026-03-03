import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Clock, Award, CheckCircle2 } from 'lucide-react';

const HERO_IMAGES = ['/image1.jpg', '/image2.jpg', '/image3.jpg', '/image4.jpg'];

const AboutUsPage = () => {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const stats = [
    { label: 'Successful Surgeries', value: '15,000+' },
    { label: 'Expert Doctors', value: '120+' },
    { label: 'Modern Rooms', value: '250+' },
    { label: 'Satisfied Patients', value: '50,000+' },
  ];

  const founders = [
    {
      name: 'Dr. Abhijith Reddy A',
      credentials: 'MBBS, FICCC, FICD, MBA (UK)',
      role: 'Founder & Clinical Consultant',
      image: '/intro2.png',
      bio: 'Dr. Abhijith Reddy A combines medical expertise with strong healthcare leadership. He leads with a vision to build a patient-centered, ethical, and innovative healthcare institution focused on quality care and sustainable growth.',
      slug: 'abhijith-reddy',
    },
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
      title: 'Day Care & 24/7 Service',
      description: 'Round-the-clock medical observation and specialized day care services for a swift recovery.',
      icon: Clock
    }
  ];

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-12 lg:py-20 relative overflow-hidden">
        {/* Rotating background - one image every 5 seconds with crossfade */}
        {HERO_IMAGES.map((src, idx) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${src})`,
              opacity: idx === bgIndex ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-primary/50"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 skew-x-12 translate-x-1/4"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">Our Story</span>
            <h1 className="text-4xl lg:text-7xl font-bold mb-8 font-display leading-[1.1] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
              The Future of <br className="hidden lg:block"/> Healthcare is Here
            </h1>
            <p className="text-white/80 text-lg lg:text-xl leading-relaxed mb-10">
              Nexus Enliven is a next-generation healthcare destination, purpose-built to deliver state-of-the-art medical services with advanced technology and unmatched patient comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="-mt-16 container-custom relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-divider p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center lg:border-r last:border-0 border-divider">
              <p className="text-3xl lg:text-5xl font-bold text-primary mb-2 font-display">{stat.value}</p>
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Content Section */}
      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Hospital Building"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* <div className="absolute -bottom-8 -right-8 bg-secondary p-8 rounded-2xl shadow-xl hidden lg:block">
                <CheckCircle2 size={48} className="text-white mb-4" />
                <p className="text-white font-bold uppercase tracking-widest text-xs">NABH Accredited</p>
              </div> */}
            </div>
            
            <div>
              <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Who We Are</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-8 font-display">Modern Care, Built for You</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Nexus Enliven was established with a singular vision: to create a premium healthcare ecosystem that integrates cutting-edge medical innovation with deeply personalized care. We aren't just a hospital; we are a modern medical center designed to set new benchmarks in patient experience.
                </p>
                <p>
                  Our facility features quality infrastructure, sophisticated diagnostic tools, and contemporary clinical environments. By bringing together a team of exceptionally talented specialists and utilizing the latest healthcare protocols, we ensure that every patient receives the highest standard of modern medicine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="relative py-16 lg:py-20 bg-gray-50 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -right-32 -top-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-secondary/10 blur-2xl" />
        <div className="absolute right-0 bottom-0 w-[400px] h-64 rounded-[50%_50%_30%_70%_/60%_40%_60%_40%] bg-primary/5" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-32 rounded-[40%_60%_70%_30%_/40%_50%_60%_50%] bg-secondary/8" />

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 px-4">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Our Leadership</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-4 font-display">Meet Our Founder</h2>
            <p className="text-gray-600 text-lg">The visionary behind our mission to deliver exceptional healthcare with compassion and excellence.</p>
          </div>

          <div className="flex flex-col items-center max-w-3xl mx-auto">
            {founders.map((founder, index) => (
              <Link
                key={index}
                to={founder.slug ? `/doctors/${founder.slug}` : '#'}
                className="flex flex-col sm:flex-row gap-8 items-start w-full rounded-2xl bg-white/90 backdrop-blur-sm border border-divider shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/20"
              >
                <div className="shrink-0 w-full sm:w-64">
                  <div className="aspect-square sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-secondary font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Founder</span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-2 font-display">{founder.name}</h3>
                  <p className="text-secondary font-semibold text-base mb-1">{founder.credentials}</p>
                  <p className="text-primary font-bold uppercase tracking-wide text-sm mb-4">{founder.role}</p>
                  <p className="text-gray-600 leading-relaxed">{founder.bio}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-hospital-bg py-16 lg:py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12 px-4">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Core Values</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-4 font-display">What We Stand For</h2>
            <p className="text-gray-600 text-lg">Our values are the foundation of our institution and guide every decision we make in our daily practice.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-3xl border border-divider hover:shadow-xl transition-all duration-300">
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
