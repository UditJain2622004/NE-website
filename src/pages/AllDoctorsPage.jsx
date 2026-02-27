import { doctors } from '../data/doctors';
import DoctorCard from '../components/DoctorCard';
import { Activity, UserRound, ChevronDown, Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const AllDoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [specSearch, setSpecSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');

  const specRef = useRef(null);
  const docRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (specRef.current && !specRef.current.contains(event.target)) {
        setIsSpecOpen(false);
        setSpecSearch('');
      }
      if (docRef.current && !docRef.current.contains(event.target)) {
        setIsDocOpen(false);
        setDocSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const specialities = [...new Set(doctors.map(d => d.speciality))].filter(s => 
    s.toLowerCase().includes(specSearch.toLowerCase())
  );
  
  const filteredDoctorNames = doctors
    .filter(d => !selectedSpeciality || d.speciality === selectedSpeciality)
    .filter(d => d.name.toLowerCase().includes(docSearch.toLowerCase()))
    .map(d => d.name);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = !selectedSpeciality || doctor.speciality === selectedSpeciality;
    const matchesDoc = !selectedDoctor || doctor.name === selectedDoctor;
    
    return matchesSearch && matchesSpec && matchesDoc;
  });

  const clearFilters = () => {
    setSelectedSpeciality('');
    setSelectedDoctor('');
    setSearchTerm('');
  };

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      <div className="bg-primary/5 py-4 lg:py-10">
        <div className="container-custom text-center">
          {/* <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Experts</span> */}
          <h1 className="text-3xl lg:text-6xl font-bold text-primary mt-10 font-display">
            Meet Our Doctors
          </h1>
          <p className="text-gray-600 text-sm lg:text-lg mt-5">
            Qualified and experienced doctors ready to serve you with the best medical care.
          </p>
          
          {/* Main Filter Bar */}
          <div className="max-w-5xl mx-auto bg-white border border-blue-100 rounded-3xl shadow-xl shadow-blue-900/5 p-4 lg:p-6 mt-5 mb-8 relative z-30">
            <div className="flex flex-row items-center gap-3 lg:gap-0">
              
              {/* Speciality Dropdown */}
              <div className="flex-1 min-w-0 relative" ref={specRef}>
                <button 
                  onClick={() => { setIsSpecOpen(!isSpecOpen); setIsDocOpen(false); }}
                  className="w-full flex items-center gap-2 lg:gap-4 px-2 lg:px-4 py-2 hover:bg-gray-50 transition-colors rounded-2xl group"
                >
                  <div className="hidden lg:flex w-12 h-12 rounded-full bg-blue-50 text-secondary items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    <Activity size={24} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Speciality</p>
                    <p className="text-gray-700 font-bold  text-sm lg:text-base">
                      {selectedSpeciality || 'Select a Speciality'}
                    </p>
                  </div>
                  <ChevronDown size={18} className={`text-black-300 transition-transform duration-300 shrink-0 ${isSpecOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSpecOpen && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-divider rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Search inside dropdown */}
                    <div className="p-3 bg-gray-50 border-b border-divider">
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="Search..."
                          className="w-full bg-white border border-divider rounded-xl py-2 px-4 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20"
                          value={specSearch}
                          onChange={(e) => setSpecSearch(e.target.value)}
                          
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto py-2">
                      <div 
                        className="px-6 py-3 hover:bg-blue-50 cursor-pointer text-sm font-bold text-primary"
                        onClick={() => { setSelectedSpeciality(''); setIsSpecOpen(false); setSpecSearch(''); }}
                      >
                        All Specialities
                      </div>
                      {specialities.map(spec => (
                        <div 
                          key={spec}
                          className={`px-6 py-3 hover:bg-blue-50 cursor-pointer text-sm font-medium transition-colors ${selectedSpeciality === spec ? 'bg-blue-50 text-secondary font-bold' : 'text-gray-600'}`}
                          onClick={() => { setSelectedSpeciality(spec); setIsSpecOpen(false); setSpecSearch(''); }}
                        >
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vertical divider */}
              <div className="w-px h-12 bg-divider mx-1 lg:mx-8 shrink-0"></div>

              {/* Doctor Dropdown */}
              <div className="flex-1 min-w-0 relative" ref={docRef}>
                <button 
                  onClick={() => { setIsDocOpen(!isDocOpen); setIsSpecOpen(false); }}
                  className="w-full flex items-center gap-2 lg:gap-4 px-2 lg:px-4 py-2 hover:bg-gray-50 transition-colors rounded-2xl group"
                >
                  <div className="hidden lg:flex w-12 h-12 rounded-full bg-blue-50 text-secondary items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    <UserRound size={24} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Doctor</p>
                    <p className="text-gray-700 font-bold  text-sm lg:text-base">
                      {selectedDoctor || 'Select a Doctor'}
                    </p>
                  </div>
                  <ChevronDown size={18} className={`text-black-300 transition-transform duration-300 shrink-0 ${isDocOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDocOpen && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-divider rounded-2xl shadow-2xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Search inside dropdown */}
                    <div className="p-3 bg-gray-50 border-b border-divider">
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="Search..."
                          className="w-full bg-white border border-divider rounded-xl py-2 px-4 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20"
                          value={docSearch}
                          onChange={(e) => setDocSearch(e.target.value)}
                          
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto py-2">
                      <div 
                        className="px-6 py-3 hover:bg-blue-50 cursor-pointer text-sm font-bold text-primary"
                        onClick={() => { setSelectedDoctor(''); setIsDocOpen(false); setDocSearch(''); }}
                      >
                        All Doctors
                      </div>
                      {filteredDoctorNames.map(name => (
                        <div 
                          key={name}
                          className={`px-6 py-3 hover:bg-blue-50 cursor-pointer text-sm font-medium transition-colors ${selectedDoctor === name ? 'bg-blue-50 text-secondary font-bold' : 'text-gray-600'}`}
                          onClick={() => { setSelectedDoctor(name); setIsDocOpen(false); setDocSearch(''); }}
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 ml-0 lg:ml-8">
                {(selectedSpeciality || selectedDoctor || searchTerm) && (
                  <button 
                    onClick={clearFilters}
                    className="p-4 text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear Filters"
                  >
                    <X size={24} />
                  </button>
                )}
                {/* <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search..."
                    className="hidden lg:block w-48 focus:w-64 bg-gray-50 border border-transparent focus:border-secondary/20 focus:bg-white rounded-2xl py-3 px-6 pl-12 transition-all outline-none text-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="lg:absolute lg:left-4 lg:top-1/2 lg:-translate-y-1/2 text-gray-400" size={18} />
                </div> */}
              </div>
            </div>
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
          <div className="text-center py-20 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2 font-display">No Doctors Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any doctors matching your current filters. Try resetting or adjusting your search.</p>
            <button 
              onClick={clearFilters}
              className="mt-8 text-secondary font-extrabold uppercase tracking-widest text-xs border-b-2 border-secondary/20 hover:border-secondary transition-all pb-1"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDoctorsPage;
