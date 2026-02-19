import DepartmentCard from '../DepartmentCard';
import { departments } from '../../data/departments';
import { ArrowRight, Heart, Brain, Users, Activity, Eye, Bone, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const deptIcons = {
  HeartIcon: Heart,
  BrainIcon: Brain,
  UserGroupIcon: Users,
  ActivityIcon: Activity,
  EyeIcon: Eye,
  BoneIcon: Bone,
  MicroscopeIcon: Microscope,
};

const mobileLabels = {
  Cardiology: 'Heart',
  Neurology: 'Neuro',
  Pediatrics: 'Child',
};

const DepartmentsSection = () => {
  return (
    <section id="departments" className="bg-white relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-hospital-bg to-transparent -z-10"></div>

      {/* === MOBILE LAYOUT === */}
      <div className="lg:hidden px-5 py-8">
        <h2 className="text-xl font-bold text-primary font-display mb-6">Departments</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {departments.map((dept) => {
            const Icon = deptIcons[dept.icon] || Activity;
            return (
              <Link
                key={dept.id}
                to={`/departments/${dept.slug}`}
                className="shrink-0 w-44 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-4 right-3 w-9 h-9 bg-white text-secondary flex items-center justify-center rounded-full shadow border border-gray-100">
                    <Icon size={16} />
                  </div>
                </div>
                <div className="p-3 pt-3.5">
                  <h3 className="text-sm font-bold text-primary font-display">{dept.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{dept.shortDescription}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* === DESKTOP LAYOUT === */}
      <div className="hidden lg:block section-padding">
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
      </div>
    </section>
  );
};

export default DepartmentsSection;
