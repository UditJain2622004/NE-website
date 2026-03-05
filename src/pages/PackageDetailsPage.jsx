import { useParams, Link } from 'react-router-dom';
import { packages } from '../data/packages';
import { CheckCircle2, IndianRupee, Calendar, Phone, ClipboardList, ShieldCheck, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import CTABanner from '../components/CTABanner';

const PackageDetailsPage = () => {
  const { packageSlug } = useParams();
  const pkg = packages.find((p) => p.slug === packageSlug);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Package Not Found</h2>
          <Link to="/services/health-check-packages" className="btn-primary">Back to All Packages</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-hospital-bg pt-4 pb-8 sm:pt-6 sm:pb-12 lg:py-20 border-b border-divider">
        <div className="container-custom px-4 sm:px-6 lg:px-0">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Services', path: '/services' },
            { label: 'Health Check Packages', path: '/services/health-check-packages' },
            { label: pkg.name }
          ]} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.2fr)] gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-start">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Health Check Package</span>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8 leading-[1.05] font-display">
                {pkg.name}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed opacity-90 max-w-xl">
                {pkg.description}
              </p>

              {/* Price inline */}
              <div className="flex items-center gap-3 mb-8 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 w-fit">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Package Price</span>
                <div className="flex items-center gap-0.5">
                  <IndianRupee size={22} className="text-secondary" />
                  <span className="text-3xl font-bold text-primary font-display">{pkg.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="btn-primary px-8 py-4 sm:py-3 lg:px-6 lg:py-2.5 text-base lg:text-sm font-bold flex items-center justify-center gap-2">
                  <Calendar size={18} className="shrink-0" /> Book This Package
                </button>
                <a href="tel:+919187634758" className="btn-outline px-8 py-4 sm:py-3 lg:px-6 lg:py-2.5 text-base lg:text-sm font-bold flex items-center justify-center gap-2">
                  <Phone size={18} className="shrink-0" /> Contact Helpline
                </a>
              </div>
            </div>

            {/* Right: Image + Inclusions */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Package Image */}
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/80 shadow-2xl shadow-primary/10 ring-1 ring-black/5 -mx-4 sm:mx-0">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className="w-full aspect-16/10 object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
              </div>


            </div>

            
          </div>

          {/* Inclusions Card */}
          <div className="bg-white rounded-2xl border border-divider shadow-lg overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-divider bg-primary/5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">What's Included · {pkg.inclusions.length} tests</p>
                </div>
                <div className="p-6">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pkg.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} className="text-secondary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
        </div>
      </section>

      

      {/* Guidelines Section */}
      <section className="section-padding bg-primary/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3 font-display">
                <ShieldCheck className="text-amber-600" size={28} />
                General Health Check Guidelines
              </h3>
              <p className="text-gray-500 text-sm mb-8">Please follow these guidelines for accurate test results.</p>
              <ul className="space-y-4">
                {pkg.guidelines.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Other Packages */}
      <section className="section-padding bg-hospital-bg border-t border-divider">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Explore More</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-primary font-display">Other Packages</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {packages
              .filter(p => p.id !== pkg.id)
              .slice(0, 3)
              .map((otherPkg) => (
                <Link
                  key={otherPkg.id}
                  to={`/services/health-check-packages/${otherPkg.slug}`}
                  className="group bg-white rounded-xl border border-divider hover:border-secondary/30 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Mini image */}
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={otherPkg.image} 
                      alt={otherPkg.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-0.5 text-secondary font-bold text-sm">
                      <IndianRupee size={12} />
                      {otherPkg.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <h4 className="font-bold text-primary text-lg mb-2">{otherPkg.name}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 grow">{otherPkg.description}</p>
                    <span className="text-secondary font-bold text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services/health-check-packages" className="btn-outline inline-flex items-center gap-2 px-8 py-3 rounded-xl">
              View All Packages <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTABanner 
        title={`Ready to Book the ${pkg.name}?`}
        subtitle="Take charge of your health today. Book your package or call us for more information."
      />
    </div>
  );
};

export default PackageDetailsPage;
