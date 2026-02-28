import { Calendar, Phone } from 'lucide-react';
import Breadcrumb from '../Breadcrumb';

const DiagnosticsHero = ({ overviewRef }) => {
  return (
    <section ref={overviewRef} className="bg-hospital-bg pt-4 pb-8 sm:pt-6 sm:pb-12 lg:py-24 border-b border-divider">
      <div className="container-custom px-4 sm:px-6 lg:px-0">
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'Our Services', path: '/services' },
          { label: 'Diagnostics' }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.2fr)] gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
          <div className="order-2 lg:order-1 lg:pr-6 xl:pr-8">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Service Excellence</span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8 leading-[1.05] font-display">
              Diagnostics <br />
              <span className="text-secondary">Services</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed opacity-90 w-full max-w-xl">
              Our Diagnostics department provides accurate and comprehensive diagnostic services. From routine laboratory tests and pathology to advanced imaging and specialized screening, we deliver reliable results with quick turnaround times. Our skilled technicians and diagnostic specialists ensure precision in every test.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="/#book" className="btn-primary px-8 py-4 sm:py-3 lg:px-6 lg:py-2.5 text-base lg:text-sm font-bold flex items-center justify-center gap-2">
                <Calendar size={18} className="shrink-0" /> Request Consultation
              </a>
              <a href="tel:+1234567890" className="btn-outline px-8 py-4 sm:py-3 lg:px-6 lg:py-2.5 text-base lg:text-sm font-bold flex items-center justify-center gap-2">
                <Phone size={18} className="shrink-0" /> Contact Helpline
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative min-w-0 -mx-4 sm:mx-0">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/80 shadow-2xl shadow-primary/10 ring-1 ring-black/5">
              <img
                src="/general images/diagnostic.jpg"
                alt="Diagnostics"
                className="w-full aspect-4/3 object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticsHero;
