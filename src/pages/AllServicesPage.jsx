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
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Healthcare Services</span>
          <h1 className="text-3xl lg:text-6xl font-bold text-primary mt-2 font-display">
            Our Services
          </h1>
          <p className="text-gray-600 text-sm lg:text-lg mt-5">
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
