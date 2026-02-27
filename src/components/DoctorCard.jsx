import { Link } from 'react-router-dom';
import { Star, ChevronRight, Building2, Stethoscope } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  const reviewCount = Math.floor(Math.random() * 100 + 50);
  const rating = (Math.random() * 0.5 + 4.5).toFixed(1);

  return (
    <Link to={`/doctors/${doctor.slug}`} className="block">
      {/* Desktop: vertical card */}
      <div className="hidden md:flex card-modern group flex-col h-full bg-white">
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

        <div className="p-6 flex flex-col flex-grow">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold text-primary mb-1 uppercase tracking-tight font-display  leading-7 min-h-[3.5rem]">{doctor.name}</h3>
            {/** center the text */}
            <p className="text-xs text-secondary tracking-widest mb-1 text-center">
              {doctor.qualifications}
            </p>
            <p className="text-xs text-primary tracking-widest text-center">
              {doctor.speciality}
            </p>
            
            {/* <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                ({reviewCount} Reviews)
              </span>
            </div> */}
          </div>

          <div className="mt-auto border-t border-divider">
            {/* <Link 
              to={`/doctors/${doctor.slug}`} 
              className="btn-outline py-2.5 px-0 text-xs flex items-center justify-center gap-2 border-divider text-primary hover:border-primary hover:bg-primary/5 rounded-md transition-all font-bold uppercase tracking-widest"
            >
              Profile
            </Link> */}
            <Link 
              to="#book" 
              className="btn-primary py-2.5 px-0 text-xs flex items-center justify-center gap-2 rounded-md shadow-sm font-bold tracking-widest"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: horizontal card */}
      <div className="md:hidden flex items-center gap-4 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 group">
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-primary font-display truncate">{doctor.name}</h3>
          <p className="flex items-center gap-1 text-xs text-gray-500 mb-1 truncate">
            <Building2 size={13} className="text-secondary shrink-0" />
            <span className="truncate">{doctor.speciality}</span>
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-500 mb-1 truncate">
            <Stethoscope size={13} className="text-secondary shrink-0" />
            <span className="truncate">{doctor.department}</span>
          </p>
          {/* <div className="flex items-center gap-1.5 mt-1.5">
            <Star size={13} className="text-yellow-400" fill="currentColor" />
            <span className="text-xs font-bold text-primary">{rating}</span>
            <span className="text-xs text-secondary">({reviewCount} Reviews)</span>
          </div> */}
        </div>

        <div className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-secondary group-hover:text-secondary transition-colors">
          <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );
};

export default DoctorCard;
