import { ChevronDown, ChevronRight } from 'lucide-react';
import { diagnosticsServices } from '../../data/diagnosticsServices';

const DiagnosticsSidebar = ({
  servicesMenuOpen,
  setServicesMenuOpen,
  expandedServiceIds,
  toggleServiceSubmenu,
  selectedServiceId,
  selectService,
  setSelectedServiceId,
  scrollTo,
  overviewRef,
  servicesRef,
}) => {
  return (
    <aside className="lg:w-80 xl:w-96 shrink-0 bg-blue-50/80 border-b lg:border-b-0 lg:border-r border-divider">
      <div className="sticky top-20 p-6 lg:p-8 space-y-8">
        <div>
          <nav className="space-y-1">
            <button
              onClick={() => scrollTo(overviewRef)}
              className="block w-full text-left py-2.5 px-3 text-sm font-semibold uppercase tracking-wider text-primary hover:text-secondary hover:bg-white/60 rounded-lg transition-colors"
            >
              Overview
            </button>
            <div>
              <button
                onClick={() => {
                  const wasOpen = servicesMenuOpen;
                  setServicesMenuOpen(!servicesMenuOpen);
                  if (!wasOpen) {
                    scrollTo(servicesRef);
                    setSelectedServiceId(null);
                  }
                }}
                className="flex items-center justify-between w-full text-left py-2.5 px-3 text-sm font-semibold uppercase tracking-wider text-primary hover:text-secondary hover:bg-white/60 rounded-lg transition-colors"
              >
                Our Services
                {servicesMenuOpen ? (
                  <ChevronDown size={16} className="shrink-0" />
                ) : (
                  <ChevronRight size={16} className="shrink-0" />
                )}
              </button>
              {servicesMenuOpen && (
                <div className="pl-4 mt-1 space-y-0.5 border-l-2 border-primary/20 ml-3">
                  {diagnosticsServices.map((service) => {
                    const hasSubServices = service.subServices?.length > 0;
                    const isExpanded = expandedServiceIds.has(service.id);
                    return (
                      <div key={service.id}>
                        <button
                          onClick={() => {
                            if (hasSubServices) {
                              toggleServiceSubmenu(service.id);
                            }
                            selectService(service.id);
                          }}
                          className={`flex items-center justify-between w-full text-left py-2 px-2 text-sm font-medium rounded-r-lg transition-colors ${
                            selectedServiceId === service.id
                              ? 'text-secondary bg-primary/10'
                              : isExpanded
                                ? 'text-secondary bg-primary/10'
                                : 'text-gray-700 hover:text-secondary hover:bg-white/60'
                          }`}
                        >
                          {service.name}
                          {hasSubServices && (
                            isExpanded ? (
                              <ChevronDown size={14} className="shrink-0" />
                            ) : (
                              <ChevronRight size={14} className="shrink-0" />
                            )
                          )}
                        </button>
                        {hasSubServices && isExpanded && (
                          <div className="pl-3 space-y-0.5 border-l border-primary/10 ml-2">
                            {service.subServices.map((sub, idx) => (
                              <button
                                key={idx}
                                onClick={() => selectService(service.id)}
                                className="block w-full text-left py-1.5 px-2 text-xs text-gray-600 hover:text-primary rounded-r transition-colors"
                              >
                                ({String.fromCharCode(65 + idx)}) {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default DiagnosticsSidebar;
