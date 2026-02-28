import { Link } from 'react-router-dom';
import { Stethoscope, MessageSquare, Pill, Sun, ScanLine, HardHat, Activity, ArrowRight } from 'lucide-react';

const icons = {
  StethoscopeIcon: Stethoscope,
  MessageSquareIcon: MessageSquare,
  PillIcon: Pill,
  SunIcon: Sun,
  ScanLineIcon: ScanLine,
  HardHatIcon: HardHat
};

const ServiceCard = ({ service }) => {
  const Icon = icons[service.icon] || Activity;

  return (
    <Link 
      to={`/services/${service.slug}`}
      className="card-modern group h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 isolate"
    >
      {/* Image Container */}
      <div className="relative h-40 md:h-48 overflow-hidden rounded-t-xl">
        <img 
          src={service.image} 
          alt={service.name}
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating Icon Badge */}
        <div className="absolute -bottom-6 right-8 w-14 h-14 bg-white text-secondary flex items-center justify-center rounded-full shadow-lg border border-divider group-hover:bg-secondary group-hover:text-white transition-all duration-300 z-10">
          <Icon size={28} />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-2 pt-2 flex flex-col grow">
        <h3 className="text-2xl font-bold text-primary mb-1 uppercase tracking-tight font-display">{service.name}</h3>
        
        <p className="text-gray-600 mb-3 line-clamp-3 leading-relaxed text-sm grow">
          {service.shortDescription}
        </p>

        <div className="flex items-center justify-between border-t border-divider pt-3 mt-auto">
          <span className="w-full bg-gray-100 text-primary px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-center group-hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
            Learn More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
