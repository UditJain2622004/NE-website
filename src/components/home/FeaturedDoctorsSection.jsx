import DoctorCard from '../DoctorCard';
import { doctors } from '../../data/doctors';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedDoctorsSection = () => {
  return (
    <section id="doctors" className="section-padding bg-hospital-bg">
      <div className="container-custom">
        {/* header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20 px-5 lg:px-0">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Experts</span>
          <h2 className="text-3xl lg:text-6xl font-bold text-primary leading-tight mb-4 lg:mb-6 font-display">
            Meet Our Doctors
          </h2>
          <p className="hidden lg:block text-gray-600 text-sm lg:text-lg">
            Qualified and experienced doctors ready to serve you with the best medical care.
          </p>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        <div className="mt-8  text-center px-5 lg:px-0">
          <Link to="/doctors" className="btn-outline w-full lg:w-auto inline-flex items-center justify-center gap-3 px-2 lg:px-12 py-4 rounded-xl">
            See All Doctors<ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctorsSection;
