import { Link } from 'react-router-dom';
import { packages } from '../data/packages';
import { services } from '../data/services';
import { CheckCircle2, IndianRupee, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const HealthCarePackagesPage = () => {
  const service = services.find(s => s.slug === 'health-care-packages');

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      {/* Hero Header */}
      <div className="bg-primary/5 py-4 lg:py-10">
        <div className="container-custom text-center">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Our Services', path: '/services' },
            { label: 'Health Check Packages' }
          ]} />
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Preventive Care</span>
          <h1 className="text-4xl lg:text-7xl font-bold text-primary mb-6 font-display">
            Health Check Packages
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg lg:text-xl px-4 lg:px-0">
            {service?.fullDescription || 'Choose from our curated health checkup packages designed to give you a complete picture of your well-being.'}
          </p>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {packages.map((pkg) => (
            <Link
              key={pkg.id}
              to={`/services/health-care-packages/${pkg.slug}`}
              className="card-modern group h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 isolate"
            >
              {/* Image Container */}
              <div className="relative h-44 md:h-52 overflow-hidden rounded-t-xl">
                <img 
                  src={pkg.image} 
                  alt={pkg.name}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/30 to-transparent"></div>
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                  <IndianRupee size={14} className="text-secondary" />
                  <span className="text-primary font-bold text-base">{pkg.price.toLocaleString('en-IN')}</span>
                </div>

                {/* Package Name on Image */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
                  <h3 className="text-xl font-bold text-white font-display leading-tight">{pkg.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="px-5 pt-4 pb-2 flex flex-col grow">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">{pkg.description}</p>
                
                {/* Inclusions Preview */}
                <div className="mb-4 grow">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Includes</p>
                  <ul className="space-y-1.5">
                    {pkg.inclusions.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={13} className="text-secondary shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                    {pkg.inclusions.length > 4 && (
                      <li className="text-xs font-bold text-secondary pl-5">
                        + {pkg.inclusions.length - 4} more included
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA */}
                <div className="border-t border-divider pt-3 mt-auto">
                  <span className="w-full bg-gray-100 text-primary px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-center group-hover:bg-secondary group-hover:text-white transition-all flex items-center justify-center gap-2">
                    View Details <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthCarePackagesPage;
