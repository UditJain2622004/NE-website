import { testimonials } from '../../data/testimonials';
import { Quote, Star } from 'lucide-react';

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-hospital-bg">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-3 block">Testimonials</span>
          <h2 className="text-3xl lg:text-4xl font-black text-primary leading-tight mb-4">
            Hear What Our Patients Say About Us
          </h2>
          <p className="text-gray-600">
            We are proud of the trust our patients place in us. Their stories of recovery and care motivate us to continue our mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white border border-divider p-8 rounded-sm hover:border-secondary transition-colors relative group">
              <Quote className="absolute top-4 right-4 text-gray-100 group-hover:text-secondary/10 transition-colors" size={60} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-secondary text-secondary" />
                ))}
              </div>
              
              <p className="text-gray-600 italic mb-8 leading-relaxed relative z-10">
                "{t.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-primary flex items-center justify-center rounded-full font-black text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-primary">{t.name}</p>
                  <p className="text-xs text-secondary font-bold uppercase tracking-wider">Verified Patient</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
