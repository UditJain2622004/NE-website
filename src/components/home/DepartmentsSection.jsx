import DepartmentCard from '../DepartmentCard';
import { departments } from '../../data/departments';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DepartmentsSection = () => {
  return (
    <section id="departments" className="bg-primary/5 relative section-padding">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-hospital-bg to-transparent -z-10"></div>

      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20 px-5 lg:px-0">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Centers of Excellence</span>
          <h2 className="text-3xl lg:text-6xl font-bold text-primary leading-tight mb-4 lg:mb-6 font-display">
            Our Centers of Excellence
          </h2>
          <p className="hidden lg:block text-gray-600 text-sm lg:text-lg">
            We offer comprehensive medical services across a wide range of specialties, all under one roof. Our centers of excellence are equipped with the latest technology.
          </p>
        </div>

        <div className="flex gap-6 lg:gap-10 overflow-x-auto pb-12 scrollbar-hide -mx-5 px-5 lg:mx-0 lg:px-0">
          {departments.map((dept) => (
            <div key={dept.id} className="shrink-0 w-[85vw] md:w-[420px]">
              <DepartmentCard department={dept} />
            </div>
          ))}
        </div>

        <div className="mt-2 lg:mt-4 text-center px-5 lg:px-0">
          <Link to="/#all-departments" className="btn-outline w-full lg:w-auto inline-flex items-center justify-center gap-3 px-2 lg:px-12 py-4 rounded-xl">
            Explore All Departments <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
