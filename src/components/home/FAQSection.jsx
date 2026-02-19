import FAQAccordion from '../FAQAccordion';
import { generalFaqs } from '../../data/faqs';

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Common Questions</span>
          <h2 className="text-4xl lg:text-6xl font-bold text-primary leading-tight mb-6 font-display">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <FAQAccordion faqs={generalFaqs} />
        </div>

        <div className="mt-20 p-10 bg-blue-50 rounded-[2rem] border border-divider flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-2 uppercase tracking-tight font-display">Still have questions?</h3>
            <p className="text-gray-600 font-medium">Can't find the answer you're looking for? Please chat with our friendly team.</p>
          </div>
          <a href="tel:+1234567890" className="btn-primary whitespace-nowrap px-12 py-4">
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
