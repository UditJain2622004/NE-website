import { ArrowLeft } from 'lucide-react';
import { iconMap } from './diagnosticsConstants';

const DiagnosticsServiceDetail = ({ service, onBack }) => {
  const IconComponent = iconMap[service.icon] || iconMap.ScanLine;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-secondary font-semibold text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> View All Services
      </button>
      {/* Row 1: Heading (col 1) | Image (col 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
            <IconComponent className="text-primary" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">{service.name}</h2>
            <p className="text-gray-600 leading-relaxed">{service.description}</p>
          </div>
        </div>
        {service.image && (
          <div className="overflow-hidden rounded-xl border border-divider">
            <img
              src={service.image}
              alt={service.name}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}
      </div>

      {/* Row 2 & 3: Services Included - 2x2 grid */}
      {service.subServices?.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">Services Included</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.subServices.map((sub, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-divider">
                <span className="text-secondary font-bold shrink-0 text-lg">
                  ({String.fromCharCode(65 + idx)})
                </span>
                <div>
                  <h4 className="font-bold text-primary mb-1">{sub.name}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{sub.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsServiceDetail;
