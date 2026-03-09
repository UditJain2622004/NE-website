import { Link } from 'react-router-dom';
import { Heart, Brain, Users, ArrowRight, Activity, Eye, Bone, Microscope, Clock } from 'lucide-react';

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
  const isComingSoon = department.comingSoon;

  return (
    <Link 
      to={`/departments/${department.slug}`}
      className="card-modern group h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 isolate"
    >
      {/* Image Container - taller on mobile for clearer image display */}
      <div className="relative h-56 md:h-56 overflow-hidden rounded-t-xl">
        <img 
          src={department.image} 
          alt={department.name}
          loading="eager"
          className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 ${isComingSoon ? 'grayscale-[40%]' : ''}`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Coming Soon Ribbon */}
        {isComingSoon && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
              <Clock size={12} />
              Coming Soon
            </div>
          </div>
        )}

        {/* Floating Icon Badge - solid bg for visibility on light images */}
        <div className="absolute bottom-5 right-8 w-14 h-14 bg-secondary text-white flex items-center justify-center rounded-full shadow-xl ring-2 ring-white group-hover:bg-primary group-hover:text-white transition-all duration-300 z-10">
          <Icon size={28} />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 sm:px-6 py-2 pt-2 flex flex-col grow">
        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1 uppercase tracking-tight font-display">{department.name}</h3>
        
        <p className="text-gray-600 mb-3 line-clamp-5 sm:line-clamp-3 leading-relaxed text-base sm:text-sm grow break-words overflow-hidden">
          {department.shortDescription || department.fullDescription.substring(0, 120) + "..."}
        </p>

        <div className="flex items-center justify-between border-t border-divider pt-3 mt-auto">
          {isComingSoon ? (
            <span className="w-full bg-amber-50 text-amber-600 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2">
              <Clock size={14} /> Coming Soon
            </span>
          ) : (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '#booking';
              }}
              className="w-full bg-gray-100 text-primary px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all transform active:scale-95"
            >
              Book Visit
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default DepartmentCard;

