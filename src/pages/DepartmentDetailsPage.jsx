import { useParams, Link } from 'react-router-dom';
import { departments } from '../data/departments';
import { doctors } from '../data/doctors';
import { CheckCircle2, Calendar, Phone, Users, ArrowRight, Clock } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import FAQAccordion from '../components/FAQAccordion';
import CTABanner from '../components/CTABanner';
import Breadcrumb from '../components/Breadcrumb';

const DepartmentDetailsPage = () => {
  const { slug } = useParams();
  const department = departments.find((d) => d.slug === slug);
  const deptDoctors = doctors.filter((d) => d.department === department?.name);

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Department Not Found</h2>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-hospital-bg pt-4 pb-8 sm:pt-6 sm:pb-12 lg:py-24 border-b border-divider">
        <div className="container-custom px-4 sm:px-6 lg:px-0">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Clinical Departments', path: '/departments' },
            { label: department.name }
          ]} />

          {department.comingSoon && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 sm:mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-amber-800 font-bold text-sm">Coming Soon</p>
                <p className="text-amber-700 text-xs sm:text-sm">This department is currently being set up and will be available shortly. Stay tuned for updates!</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.2fr)] gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
            <div className="order-2 lg:order-1 lg:pr-6 xl:pr-8">
              <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Department Excellence</span>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8 leading-[1.05] font-display">
                {department.name} <br />
                <span className="text-secondary">Specialized Care</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed opacity-90 w-full max-w-xl">
                {department.fullDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {department.comingSoon ? (
                  <span className="bg-amber-500 text-white px-8 py-4 sm:py-3 lg:px-6 lg:py-2.5 text-base lg:text-sm font-bold flex items-center justify-center gap-2 rounded-xl">
                    <Clock size={18} className="shrink-0" /> Coming Soon
                  </span>
                ) : (
                  <>
                    <button className="btn-primary px-8 py-4 sm:py-3 lg:px-6 lg:py-2.5 text-base lg:text-sm font-bold flex items-center justify-center gap-2">
                      <Calendar size={18} className="shrink-0" /> Request Consultation
                    </button>
                    <a href="tel:+1234567890" className="btn-outline px-8 py-4 sm:py-3 lg:px-6 lg:py-2.5 text-base lg:text-sm font-bold flex items-center justify-center gap-2">
                      <Phone size={18} className="shrink-0" /> Department Helpline
                    </a>
                  </>
                )}
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative min-w-0 -mx-4 sm:mx-0">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/80 shadow-2xl shadow-primary/10 ring-1 ring-black/5">
                <img 
                  src={department.image} 
                  alt={department.name} 
                  className={`w-full aspect-4/3 object-cover object-center ${department.comingSoon ? 'grayscale-[30%]' : ''}`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions & Procedures */}
      <section className="section-padding bg-white">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-blue-50 p-10 rounded-sm">
            <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
              <CheckCircle2 className="text-secondary" size={28} />
              Conditions Treated
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {department.conditions.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-hospital-bg p-10 border border-divider rounded-sm">
            <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
              <CheckCircle2 className="text-secondary" size={28} />
              Procedures Offered
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {department.procedures.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                  <ArrowRight className="text-primary" size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Available Doctors */}
      <section className="section-padding bg-hospital-bg">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Expert Team</span>
            <h2 className="text-4xl lg:text-6xl font-bold text-primary font-display">Specialists in {department.name}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {deptDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          
          {deptDoctors.length === 0 && (
            <div className="text-center p-12 bg-white border border-dashed border-divider rounded-sm">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold">No specialists found in this department currently.</p>
            </div>
          )}
        </div>
      </section>

      {/* Department FAQ */}
      <section className="section-padding bg-white border-t border-divider">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">{department.name} FAQs</h2>
              <p className="text-gray-600">Common questions related to treatment and appointments in our {department.name.toLowerCase()} department.</p>
            </div>
            <FAQAccordion faqs={department.faqs} />
          </div>
        </div>
      </section>

      <CTABanner 
        title={`Need Expert Advice on ${department.name}?`}
        subtitle="Our team is ready to assist you with the best medical care. Book your appointment today or give us a call."
      />
    </div>
  );
};

export default DepartmentDetailsPage;
