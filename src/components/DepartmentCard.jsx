import { Link } from 'react-router-dom';
import { Heart, Brain, Users, ArrowRight, Activity, Eye, Bone, Microscope } from 'lucide-react';

const icons = {
  HeartIcon: Heart,
  BrainIcon: Brain,
  UserGroupIcon: Users,
  ActivityIcon: Activity,
  EyeIcon: Eye,
  BoneIcon: Bone,
  MicroscopeIcon: Microscope
};

const DepartmentCard = ({ department }) => {
  const Icon = icons[department.icon] || Activity;

  return (
    <div className="card-modern group h-full flex flex-col">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={department.image} 
          alt={department.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating Icon Badge */}
        <div className="absolute -bottom-6 right-8 w-14 h-14 bg-white text-secondary flex items-center justify-center rounded-full shadow-lg border border-divider group-hover:bg-secondary group-hover:text-white transition-all duration-300 z-10">
          <Icon size={28} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 pt-10 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-primary mb-3 uppercase tracking-tight font-display">{department.name}</h3>
        
        <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed text-sm flex-grow">
          {department.shortDescription || department.fullDescription.substring(0, 120) + "..."}
        </p>

        <div className="flex items-center justify-between border-t border-divider pt-6 mt-auto">
          <Link 
            to={`/departments/${department.slug}`} 
            className="text-primary font-bold text-sm inline-flex items-center gap-2 hover:text-secondary transition-colors uppercase tracking-widest"
          >
            View Details
          </Link>
          <button className="bg-gray-100 text-primary px-4 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">
            Book Visit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
