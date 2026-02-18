import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Star } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="card-modern group flex flex-col h-full bg-white">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={doctor.image} 
          alt={doctor.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-secondary/90 backdrop-blur-sm text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md">
          {doctor.department}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-primary mb-1 uppercase tracking-tight font-display">{doctor.name}</h3>
          <p className="text-xs text-secondary font-bold uppercase tracking-widest mb-3">
            {doctor.qualifications} — {doctor.speciality}
          </p>
          
          {/* Ratings */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              ({(Math.random() * 100 + 50).toFixed(0)} Reviews)
            </span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-divider grid grid-cols-2 gap-3">
          <Link 
            to={`/doctors/${doctor.slug}`} 
            className="btn-outline py-2.5 px-0 text-xs flex items-center justify-center gap-2 border-divider text-primary hover:border-primary hover:bg-primary/5 rounded-md transition-all font-bold uppercase tracking-widest"
          >
            Profile
          </Link>
          <Link 
            to={`#book`} 
            className="btn-primary py-2.5 px-0 text-xs flex items-center justify-center gap-2 rounded-md shadow-sm font-bold uppercase tracking-widest"
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
