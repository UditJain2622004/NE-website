import { services } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import Breadcrumb from '../components/Breadcrumb';

const AllServicesPage = () => {
  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      <div className="bg-primary/5 py-4 lg:py-10">
        <div className="container-custom text-center">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Our Services' }
          ]} />
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Healthcare Solutions</span>
          <h1 className="text-4xl lg:text-7xl font-bold text-primary mb-6 font-display">
            Our Services
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg lg:text-xl px-4 lg:px-0">
            Comprehensive healthcare services designed to meet all your medical needs — from routine consultations to specialized diagnostics and occupational health programs.
          </p>
        </div>
      </div>

      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllServicesPage;
