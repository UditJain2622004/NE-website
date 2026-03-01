import { useState, useEffect, useRef } from 'react';
import { doctors } from '../../data/doctors';
import { departments } from '../../data/departments';
import { CheckCircle2, Calendar, Phone, User, Grid, Clock, ChevronDown, Search } from 'lucide-react';

const AppointmentSection = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [deptSearch, setDeptSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');

  const deptRef = useRef(null);
  const docRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setIsDeptOpen(false);
        setDeptSearch('');
      }
      if (docRef.current && !docRef.current.contains(event.target)) {
        setIsDocOpen(false);
        setDocSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableDepartments = departments
    .filter(d => !d.comingSoon && d.name.toLowerCase().includes(deptSearch.toLowerCase()))
    .map(d => d.slug);
  
  const filteredDoctorNames = doctors
    .filter(d => !selectedDepartment || d.department.toLowerCase() === selectedDepartment.toLowerCase())
    .filter(d => d.name.toLowerCase().includes(docSearch.toLowerCase()))
    .map(d => d.name);

  // Reset selected doctor if they are not in the new filtered list (ignoring search)
  useEffect(() => {
    const validDoctorNames = doctors
      .filter(d => !selectedDepartment || d.department.toLowerCase() === selectedDepartment.toLowerCase())
      .map(d => d.name);
    if (selectedDoctor && !validDoctorNames.includes(selectedDoctor)) {
      setSelectedDoctor('');
    }
  }, [selectedDepartment, selectedDoctor]);

  return (
    <section id="book" className="py-20 lg:py-32 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 transform translate-x-1/3 -z-0"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Info */}
          <div className="text-white">
            <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Easy Scheduling</span>
            <h2 className="text-4xl lg:text-7xl font-bold text-white leading-[1.05] mb-8 font-display">
              Book Your Appointment <br />
              <span className="text-secondary">Online</span>
            </h2>
            <p className="text-blue-100/80 text-lg mb-12 max-w-lg leading-relaxed">
              Avoid the waiting room. Schedule your visit with our specialists in just a few clicks. Get confirmation instantly.
            </p>
            
            <div className="space-y-6">
              <CheckItem text="Choose your preferred doctor" />
              <CheckItem text="Select a convenient time slot" />
              <CheckItem text="Receive instant confirmation" />
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 animate-in fade-in zoom-in duration-700">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Department Dropdown */}
                <div className="relative" ref={deptRef}>
                  <InputGroup label="Department" icon={Grid}>
                    <button 
                      type="button"
                      onClick={() => { setIsDeptOpen(!isDeptOpen); setIsDocOpen(false); }}
                      className="w-full flex items-center justify-between gap-2 bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary text-left"
                    >
                      <span className="truncate">{selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1) || 'Select Department'}</span>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 shrink-0 ${isDeptOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </InputGroup>

                  {isDeptOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-divider rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3 bg-gray-50 border-b border-divider">
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-white border border-divider rounded-lg py-1.5 px-3 pl-8 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20"
                            value={deptSearch}
                            onChange={(e) => setDeptSearch(e.target.value)}
                          />
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto py-1">
                        <div 
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-xs font-bold text-primary"
                          onClick={() => { setSelectedDepartment(''); setIsDeptOpen(false); setDeptSearch(''); }}
                        >
                          All Departments
                        </div>
                        {availableDepartments.map(dept => (
                          <div 
                            key={dept}
                            className={`px-4 py-2 hover:bg-blue-50 cursor-pointer text-xs font-medium transition-colors ${selectedDepartment === dept ? 'bg-blue-50 text-secondary font-bold' : 'text-gray-600'}`}
                            onClick={() => { setSelectedDepartment(dept); setIsDeptOpen(false); setDeptSearch(''); }}
                          >
                            {dept.charAt(0).toUpperCase() + dept.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Doctor Dropdown */}
                <div className="relative" ref={docRef}>
                  <InputGroup label="Doctor" icon={User}>
                    <button 
                      type="button"
                      onClick={() => { setIsDocOpen(!isDocOpen); setIsDeptOpen(false); }}
                      className="w-full flex items-center justify-between gap-2 bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary text-left"
                    >
                      <span className="truncate">{selectedDoctor || 'Select Doctor'}</span>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 shrink-0 ${isDocOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </InputGroup>

                  {isDocOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-divider rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3 bg-gray-50 border-b border-divider">
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-white border border-divider rounded-lg py-1.5 px-3 pl-8 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20"
                            value={docSearch}
                            onChange={(e) => setDocSearch(e.target.value)}
                          />
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto py-1">
                        <div 
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-xs font-bold text-primary"
                          onClick={() => { setSelectedDoctor(''); setIsDocOpen(false); setDocSearch(''); }}
                        >
                          All Doctors
                        </div>
                        {filteredDoctorNames.map(name => (
                          <div 
                            key={name}
                            className={`px-4 py-2 hover:bg-blue-50 cursor-pointer text-xs font-medium transition-colors ${selectedDoctor === name ? 'bg-blue-50 text-secondary font-bold' : 'text-gray-600'}`}
                            onClick={() => { setSelectedDoctor(name); setIsDocOpen(false); setDocSearch(''); }}
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Your Name" icon={User}>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary placeholder:opacity-40"
                  />
                </InputGroup>
                
                <InputGroup label="Phone Number" icon={Phone}>
                  <input 
                    type="tel" 
                    placeholder="1234568790"
                    className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary placeholder:opacity-40"
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Date" icon={Calendar}>
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary"
                  />
                </InputGroup>
                
                <InputGroup label="Time" icon={Clock}>
                  <select className="w-full bg-gray-50 border border-divider p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all font-bold text-sm text-primary">
                    <option>Select Time</option>
                    <option>09:00 AM</option>
                    <option>10:30 AM</option>
                    <option>02:00 PM</option>
                  </select>
                </InputGroup>
              </div>

              <button className="btn-secondary w-full py-5 rounded-xl text-lg font-bold uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-[1.01]">
                Book Appointment Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const CheckItem = ({ text }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
      <CheckCircle2 size={18} className="text-white" />
    </div>
    <span className="font-bold text-lg font-display tracking-tight opacity-90">{text}</span>
  </div>
);

const InputGroup = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
      {label}
    </label>
    <div className="relative">
      {children}
    </div>
  </div>
);

export default AppointmentSection;

