import { doctors } from '../data/doctors';
import DoctorCard from '../components/DoctorCard';
import { Search } from 'lucide-react';
import { useState } from 'react';

const AllDoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      <div className="bg-primary/5 py-4 lg:py-10">
        <div className="container-custom text-center">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Experts</span>
          <h1 className="text-4xl lg:text-7xl font-bold text-primary mb-8 font-display">
            Meet Our Doctors
          </h1>
          <div className="max-w-2xl mx-auto relative px-4 lg:px-0">
            <input 
              type="text" 
              placeholder="Search by name, speciality or department..." 
              className="w-full bg-white border border-divider rounded-2xl py-5 px-6 pl-14 shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm lg:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="container-custom py-16 lg:py-24">
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No doctors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDoctorsPage;
