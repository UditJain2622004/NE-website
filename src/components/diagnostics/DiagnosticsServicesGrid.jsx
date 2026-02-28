import { iconMap } from './diagnosticsConstants';
import { diagnosticsServices } from '../../data/diagnosticsServices';

const DiagnosticsServicesGrid = ({ onSelectService }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-primary mb-8">Our Diagnostic Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {diagnosticsServices.map((service, index) => {
          const IconComponent = iconMap[service.icon] || iconMap.ScanLine;
          const hasSubServices = service.subServices && service.subServices.length > 0;

          return (
            <div
              key={service.id}
              id={`service-${service.id}`}
              className="bg-white border border-divider rounded-lg overflow-hidden shadow-sm scroll-mt-24 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => onSelectService(service.id)}
            >
              {service.image && (
                <div className="h-32 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-start gap-4 p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <IconComponent className="text-primary" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-primary mb-1">
                    {index + 1}. {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  {hasSubServices && (
                    <ul className="space-y-2 border-t border-divider pt-4">
                      {service.subServices.map((sub, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary font-semibold shrink-0">({String.fromCharCode(65 + idx)})</span>
                          <div>
                            <span className="font-medium text-gray-800">{sub.name}: </span>
                            <span className="text-gray-600">{sub.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DiagnosticsServicesGrid;
