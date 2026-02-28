import FAQAccordion from '../FAQAccordion';
import { diagnosticsFAQs } from './diagnosticsConstants';

const DiagnosticsFAQ = ({ faqRef }) => {
  return (
    <section ref={faqRef} className="relative py-10 lg:py-16 px-4 sm:px-6 lg:px-0 bg-gray-50/50 border-t border-divider overflow-hidden">
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/8 blur-2xl" />
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
          <FAQAccordion faqs={diagnosticsFAQs} />
        </div>
      </div>
    </section>
  );
};

export default DiagnosticsFAQ;
