import { Link } from 'react-router-dom';
import { CheckCircle2, IndianRupee, ArrowRight } from 'lucide-react';

const PackageCard = ({ pkg }) => {
  return (
    <Link
      to={`/services/health-check-packages/${pkg.slug}`}
      className="card-modern group h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 isolate"
    >
      {/* Image Container */}
      <div className="relative h-40 md:h-48 overflow-hidden rounded-t-xl">
        <img 
          src={pkg.image} 
          alt={pkg.name}
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/30 to-transparent"></div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
          <IndianRupee size={12} className="text-secondary" />
          <span className="text-primary font-bold text-sm">{pkg.price.toLocaleString('en-IN')}</span>
        </div>

        {/* Package Name on Image */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-3 z-10">
          <h3 className="text-lg font-bold text-white font-display leading-tight">{pkg.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-3 pb-2 flex flex-col grow">
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3">{pkg.description}</p>
        
        {/* Inclusions Preview */}
        <div className="mb-3 grow">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Includes</p>
          <ul className="space-y-1">
            {pkg.inclusions.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[13px] text-gray-700">
                <CheckCircle2 size={12} className="text-secondary shrink-0 mt-0.5" />
                <span className="leading-snug line-clamp-1">{item}</span>
              </li>
            ))}
            {pkg.inclusions.length > 3 && (
              <li className="text-[10px] font-bold text-secondary pl-5">
                + {pkg.inclusions.length - 3} more included
              </li>
            )}
          </ul>
        </div>

        {/* CTA */}
        <div className="border-t border-divider pt-2.5 mt-auto">
          <span className="w-full bg-gray-100 text-primary px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-center group-hover:bg-secondary group-hover:text-white transition-all flex items-center justify-center gap-2">
            View Details <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
