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
    <Link 
      to={`/departments/${department.slug}`}
      className="card-modern group h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 isolate"
    >
      {/* Image Container */}
      <div className="relative h-40 md:h-48 overflow-hidden rounded-t-xl">
        <img 
          src={department.image} 
          alt={department.name}
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating Icon Badge */}
        <div className="absolute -bottom-6 right-8 w-14 h-14 bg-white text-secondary flex items-center justify-center rounded-full shadow-lg border border-divider group-hover:bg-secondary group-hover:text-white transition-all duration-300 z-10">
          <Icon size={28} />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-2 pt-2 flex flex-col grow">
        <h3 className="text-2xl font-bold text-primary mb-1 uppercase tracking-tight font-display">{department.name}</h3>
        
        <p className="text-gray-600 mb-3 line-clamp-3 leading-relaxed text-sm grow">
          {department.shortDescription || department.fullDescription.substring(0, 120) + "..."}
        </p>

        <div className="flex items-center justify-between border-t border-divider pt-3 mt-auto">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add booking logic here if needed
              window.location.href = '#booking';
            }}
            className="w-full bg-gray-100 text-primary px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all transform active:scale-95"
          >
            Book Visit
          </button>
        </div>
      </div>
    </Link>
  );
};

export default DepartmentCard;
