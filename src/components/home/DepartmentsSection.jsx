import DepartmentCard from '../DepartmentCard';
import { departments } from '../../data/departments';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DepartmentsSection = () => {
  return (
    <section id="departments" className="section-padding bg-white relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-hospital-bg to-transparent -z-10"></div>
      
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Centers of Excellence</span>
          <h2 className="text-4xl lg:text-6xl font-bold text-primary leading-tight mb-6 font-display">
            Specialized Departments
          </h2>
          <p className="text-gray-600 text-lg">
            We offer comprehensive medical services across a wide range of specialties, all under one roof. Our centers of excellence are equipped with the latest technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {departments.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link to="/#all-departments" className="btn-outline inline-flex items-center gap-3 px-12 py-4">
            Explore All Departments <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
