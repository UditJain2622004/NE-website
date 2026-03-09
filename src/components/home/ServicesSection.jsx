import { useRef, useState, useEffect, useCallback } from 'react';
import ServiceCard from '../ServiceCard';
import { services } from '../../data/services';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getScrollMetrics = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return { cardWidth: 0, gap: 24, paddingLeft: 0 };
    const cardWidth = container.firstElementChild?.offsetWidth || 0;
    const gap = parseInt(getComputedStyle(container).gap) || 24;
    const paddingLeft = parseInt(getComputedStyle(container).paddingLeft) || 0;
    return { cardWidth, gap, paddingLeft };
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const { cardWidth, gap, paddingLeft } = getScrollMetrics();
    const scrollLeft = container.scrollLeft;
    const index = Math.round((scrollLeft - paddingLeft) / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(0, index), services.length - 1));
  }, [getScrollMetrics]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToCard = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const { cardWidth, gap, paddingLeft } = getScrollMetrics();
    container.scrollTo({ left: paddingLeft + index * (cardWidth + gap), behavior: 'smooth' });
  };

  const goPrev = () => {
    scrollToCard(Math.max(0, activeIndex - 1));
  };

  const goNext = () => {
    scrollToCard(Math.min(services.length - 1, activeIndex + 1));
  };

  return (
    <section id="services" className=" relative section-padding">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-hospital-bg to-transparent -z-10"></div>

      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20 px-5 lg:px-0">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Healthcare Services</span>
          <h2 className="text-3xl lg:text-6xl font-bold text-primary leading-tight mb-4 lg:mb-6 font-display">
            Explore Our Services
          </h2>
          <p className="hidden lg:block text-gray-600 text-sm lg:text-lg">
            From clinical consultations to diagnostics and specialized health programs, we provide a comprehensive suite of healthcare services designed for your well-being.
          </p>
        </div>

        <div className="relative px-6 sm:px-10 lg:px-16">
          {/* Left arrow */}
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white shadow-lg text-primary border border-gray-200 transition-colors hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary"
            aria-label="Previous service"
          >
            <ChevronLeft size={24} />
          </button>
          {/* Right arrow */}
          <button
            onClick={goNext}
            disabled={activeIndex === services.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white shadow-lg text-primary border border-gray-200 transition-colors hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary"
            aria-label="Next service"
          >
            <ChevronRight size={24} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 lg:gap-10 overflow-x-auto pb-6 lg:pb-12 scrollbar-hide snap-x snap-mandatory pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
          >
            {services.map((service) => (
              <div key={service.id} className="shrink-0 w-[calc(100vw-5rem)] min-w-[280px] md:min-w-0 md:w-[420px] snap-start">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>

        {/* scroll indicator dots */}
        <div className="flex justify-center gap-2 pb-6">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? 'w-7 bg-primary'
                  : 'w-2.5 bg-primary/20'
              }`}
            />
          ))}
        </div>

        <div className="mt-2 lg:mt-4 text-center px-5 lg:px-0">
          <Link to="/services" className="btn-outline w-full lg:w-auto inline-flex items-center justify-center gap-3 px-2 lg:px-12 py-4 rounded-xl">
            Explore All Services <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
