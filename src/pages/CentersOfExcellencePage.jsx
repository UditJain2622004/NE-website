import { departments } from '../data/departments';
import DepartmentCard from '../components/DepartmentCard';
import Breadcrumb from '../components/Breadcrumb';

const CentersOfExcellencePage = () => {
  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      <div className="bg-primary/5 py-4 lg:py-10">
        <div className="container-custom text-center">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Clinical Departments' }
          ]} />
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Clinical Departments</span>
          <h1 className="text-3xl lg:text-6xl font-bold text-primary mt-2 font-display">
            Explore Our Departments
          </h1>
          <p className="text-gray-600 text-sm lg:text-lg mt-5">
            World-class medical facilities and expertise across a wide range of specialties, dedicated to providing the highest quality of patient care.
          </p>
        </div>
      </div>

      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {departments.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CentersOfExcellencePage;
