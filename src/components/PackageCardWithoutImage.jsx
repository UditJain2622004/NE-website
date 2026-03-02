import { Link } from 'react-router-dom';
import { CheckCircle2, IndianRupee, ArrowRight, Activity } from 'lucide-react';

const PackageCardWithoutImage = ({ pkg }) => {
  return (
    <Link
      to={`/services/health-check-packages/${pkg.slug}`}
      className="card-modern group h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 isolate bg-white border border-divider rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Subtle Accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary opacity-20 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Title and Price in one tight block */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1.5 text-secondary">
              <Activity size={12} strokeWidth={3} />
              <span className="font-bold uppercase tracking-widest text-[9px]">Package</span>
            </div>
            <h3 className="text-xl font-bold text-primary font-display leading-tight group-hover:text-secondary transition-colors line-clamp-2">
              {pkg.name}
            </h3>
          </div>
          
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-0.5 text-primary">
              <IndianRupee size={13} className="text-secondary font-bold" />
              <span className="text-lg font-bold font-display">{pkg.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Scaled-down Description */}
        <div className="mb-4">
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 italic opacity-85">
            {pkg.description}
          </p>
        </div>

        {/* Compact Inclusions */}
        <div className="mb-5 grow">
          <div className="h-px bg-divider w-full mb-3 opacity-50"></div>
          <ul className="space-y-2">
            {pkg.inclusions.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[13px] text-gray-700">
                <CheckCircle2 size={13} className="text-secondary shrink-0 mt-0.5" />
                <span className="leading-tight line-clamp-1">{item}</span>
              </li>
            ))}
            {pkg.inclusions.length > 3 && (
              <li className="text-[10px] font-bold text-secondary/70 pl-6 pt-0.5">
                + {pkg.inclusions.length - 3} more clinical tests
              </li>
            )}
          </ul>
        </div>

        {/* Action area */}
        <div className="flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
          <span className="text-primary font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
            Details <ArrowRight size={12} />
          </span>
          <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCardWithoutImage;
