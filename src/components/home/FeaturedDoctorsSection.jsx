import DoctorCard from '../DoctorCard';
import { doctors } from '../../data/doctors';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedDoctorsSection = () => {
  return (
    <section id="doctors" className="section-padding bg-hospital-bg">
      <div className="container-custom">
        {/* Desktop header */}
        <div className="hidden md:flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Experts</span>
            <h2 className="text-4xl lg:text-6xl font-bold text-primary leading-tight font-display mb-6">
              Meet Our Doctors
            </h2>
            <p className="text-gray-600 text-lg">
              Qualified and experienced doctors ready to serve you with the best medical care.
            </p>
          </div>
          <Link to="/doctors" className="text-primary font-bold uppercase tracking-widest text-xs inline-flex items-center gap-2 hover:text-secondary transition-colors group pb-2 border-b-2 border-primary/10 hover:border-secondary">
            See All Doctors <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile header */}
        <div className="md:hidden mb-6">
          <h2 className="text-2xl font-bold text-primary font-display">Our Doctors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctorsSection;
