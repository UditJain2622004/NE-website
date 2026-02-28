import { useRef, useState, useEffect, useCallback } from 'react';
import DepartmentCard from '../DepartmentCard';
import { departments } from '../../data/departments';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DepartmentsSection = () => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild?.offsetWidth || 1;
    const gap = 24;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, departments.length - 1));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToCard = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.firstElementChild?.offsetWidth || 0;
    const gap = 24;
    container.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
  };

  return (
    <section id="departments" className=" relative section-padding">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-hospital-bg to-transparent -z-10"></div>

      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20 px-5 lg:px-0">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Clinical Departments</span>
          <h2 className="text-3xl lg:text-6xl font-bold text-primary leading-tight mb-4 lg:mb-6 font-display">
            Explore Our Departments
          </h2>
          <p className="hidden lg:block text-gray-600 text-sm lg:text-lg">
            We offer comprehensive medical services across a wide range of specialties, all under one roof. Our clinical departments are equipped with the latest technology.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 lg:gap-10 overflow-x-auto pb-6 lg:pb-12 scrollbar-hide -mx-5 px-5 lg:mx-0 lg:px-0 snap-x snap-mandatory"
        >
          {departments.map((dept) => (
            <div key={dept.id} className="shrink-0 w-[85vw] md:w-[420px] snap-start">
              <DepartmentCard department={dept} />
            </div>
          ))}
        </div>

        {/* Mobile scroll indicator dots */}
        <div className="flex justify-center gap-2 pb-6">
          {departments.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-7 bg-primary'
                  : 'w-2.5 bg-primary/20'
              }`}
            />
          ))}
        </div>

        <div className="mt-2 lg:mt-4 text-center px-5 lg:px-0">
          <Link to="/departments" className="btn-outline w-full lg:w-auto inline-flex items-center justify-center gap-3 px-2 lg:px-12 py-4 rounded-xl">
            Explore All Departments <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
