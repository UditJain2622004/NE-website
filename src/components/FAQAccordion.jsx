import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className="bg-white border border-divider rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/20"
        >
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full text-left px-8 py-6 flex justify-between items-center group"
          >
            <span className={`text-lg font-semibold transition-colors font-display ${openIndex === index ? 'text-secondary' : 'text-primary'}`}>
              {faq.question}
            </span>
            <div className={`transition-all duration-300 ${openIndex === index ? 'rotate-180 text-secondary' : 'text-gray-300 group-hover:text-primary'}`}>
              {openIndex === index ? <Minus size={24} /> : <Plus size={24} />}
            </div>
          </button>
          
          <div 
            className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="px-8 pb-8 text-gray-500 leading-relaxed font-normal">
              <div className="w-full h-px bg-divider mb-6"></div>
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
