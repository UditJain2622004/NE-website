import { useState, useRef } from 'react';
import { diagnosticsServices } from '../data/diagnosticsServices';
import CTABanner from '../components/CTABanner';
import {
  DiagnosticsHero,
  DiagnosticsSidebar,
  DiagnosticsServiceDetail,
  DiagnosticsServicesGrid,
  DiagnosticsFAQ,
} from '../components/diagnostics';

const DiagnosticsPage = () => {
  const [servicesMenuOpen, setServicesMenuOpen] = useState(true);
  const [expandedServiceIds, setExpandedServiceIds] = useState(new Set());
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const overviewRef = useRef(null);
  const servicesRef = useRef(null);
  const faqRef = useRef(null);

  const toggleServiceSubmenu = (serviceId) => {
    setExpandedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  };

  const selectService = (serviceId) => {
    setSelectedServiceId(serviceId);
  };

  const selectedService = selectedServiceId
    ? diagnosticsServices.find((s) => s.id === selectedServiceId)
    : null;

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-16 lg:pt-20 relative">
      <DiagnosticsHero overviewRef={overviewRef} />

      <div className="flex flex-col lg:flex-row">
        <DiagnosticsSidebar
          servicesMenuOpen={servicesMenuOpen}
          setServicesMenuOpen={setServicesMenuOpen}
          expandedServiceIds={expandedServiceIds}
          toggleServiceSubmenu={toggleServiceSubmenu}
          selectedServiceId={selectedServiceId}
          selectService={selectService}
          setSelectedServiceId={setSelectedServiceId}
          scrollTo={scrollTo}
          overviewRef={overviewRef}
          servicesRef={servicesRef}
        />

        <main className="flex-1 bg-white min-w-0">
          <section ref={servicesRef} className="relative py-10 lg:py-16 px-4 sm:px-6 lg:px-10 xl:px-16 bg-white overflow-hidden">
            <div className="absolute -right-24 top-1/4 w-64 h-64 rounded-full bg-primary/8 blur-2xl" />
            <div className="relative z-10">
              {selectedService ? (
                <DiagnosticsServiceDetail
                  service={selectedService}
                  onBack={() => setSelectedServiceId(null)}
                />
              ) : (
                <DiagnosticsServicesGrid onSelectService={selectService} />
              )}
            </div>
          </section>
        </main>
      </div>

      <DiagnosticsFAQ faqRef={faqRef} />

      <CTABanner
        title="Need Diagnostic Testing?"
        subtitle="Our team is ready to assist you. Book your appointment today or give us a call."
        bookingLink="/book?department=radiology"
      />
    </div>
  );
};

export default DiagnosticsPage;
