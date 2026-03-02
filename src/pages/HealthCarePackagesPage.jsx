import { packages } from '../data/packages';
import { services } from '../data/services';
import Breadcrumb from '../components/Breadcrumb';
import PackageCard from '../components/PackageCard';
import PackageCardWithoutImage from '../components/PackageCardWithoutImage';



const HealthCarePackagesPage = () => {
  const service = services.find(s => s.slug === 'health-check-packages');

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      {/* Header Container */}
      <div className="container-custom py-8 lg:py-12">
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'Services', path: '/services' },
          { label: 'Health Check Packages' }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mt-8">
          {/* Feature Image */}
          <div className="relative aspect-[4/3] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group order-1 lg:order-2">
            <img 
              src="/health checkup/family2.jpg" 
              alt="Health Check Packages"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent"></div>
          </div>

          {/* Title and Description */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Preventive Care</span>
            <h1 className="text-4xl lg:text-7xl font-bold text-primary mb-6 font-display leading-tight">
              Health Check Packages
            </h1>
            <p className="text-gray-600 text-sm lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {service?.fullDescription || 'Choose from our curated health checkup packages designed to give you a complete picture of your well-being.'}
            </p>
          </div>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {packages.map((pkg) => (
            // <PackageCardWithoutImage key={pkg.id} pkg={pkg} />
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthCarePackagesPage;
