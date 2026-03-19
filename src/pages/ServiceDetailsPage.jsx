import { useParams, Link } from 'react-router-dom';
import { services } from '../data/services';
import { CheckCircle2, Calendar, Phone } from 'lucide-react';
import FAQAccordion from '../components/FAQAccordion';
import CTABanner from '../components/CTABanner';
import Breadcrumb from '../components/Breadcrumb';

const ServiceDetailsPage = () => {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Service Not Found</h2>
          <Link to="/services" className="btn-primary">Back to All Services</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-hospital-bg pt-4 pb-8 sm:pt-6 sm:pb-12 lg:py-24 border-b border-divider">
        <div className="container-custom px-4 sm:px-6 lg:px-0">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Services', path: '/services' },
            { label: service.name }
          ]} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.2fr)] gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
            <div className="order-2 lg:order-1 lg:pr-6 xl:pr-8">
              <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Service Excellence</span>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8 leading-[1.05] font-display">
                {service.name} <br />
                <span className="text-secondary">Services</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed opacity-90 w-full max-w-xl">
                {service.fullDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/book" className="btn-primary px-8 py-4 sm:py-3 lg:px-6 lg:py-2.5 text-base lg:text-sm font-bold flex items-center justify-center gap-2">
                  <Calendar size={18} className="shrink-0" /> Request Consultation
                </Link>
                <a href="tel:+919187634758" className="btn-outline px-8 py-4 sm:py-3 lg:px-6 lg:py-2.5 text-base lg:text-sm font-bold flex items-center justify-center gap-2">
                  <Phone size={18} className="shrink-0" /> Contact Helpline
                </a>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative min-w-0 -mx-4 sm:mx-0">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/80 shadow-2xl shadow-primary/10 ring-1 ring-black/5">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full aspect-4/3 object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 p-8 lg:p-10 rounded-sm">
              <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                <CheckCircle2 className="text-secondary" size={28} />
                Key Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service FAQ */}
      <section className="section-padding bg-hospital-bg border-t border-divider">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">{service.name} FAQs</h2>
              <p className="text-gray-600">Common questions about our {service.name.toLowerCase()} services.</p>
            </div>
            <FAQAccordion faqs={service.faqs} />
          </div>
        </div>
      </section>

      <CTABanner 
        title={`Need More Information About ${service.name}?`}
        subtitle="Our team is ready to assist you with the best medical care. Book your appointment today or give us a call."
        bookingLink="/book"
      />
    </div>
  );
};

export default ServiceDetailsPage;
