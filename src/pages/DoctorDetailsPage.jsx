import { useParams, Link } from 'react-router-dom';
import { doctors } from '../data/doctors';
import { Calendar, MessageSquare, Phone, Globe, Star, Award, GraduationCap } from 'lucide-react';
import CTABanner from '../components/CTABanner';
import Breadcrumb from '../components/Breadcrumb';

const DoctorDetailsPage = () => {
  const { slug } = useParams();
  const doctor = doctors.find((d) => d.slug === slug);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Doctor Not Found</h2>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-32">
      <div className="container-custom py-8">
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'Find a Doctor', path: '/doctors' },
          { label: doctor.name }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-start">

          {/* Image — visible on mobile as compact card, full sidebar on desktop */}
          <div className="lg:col-span-1 lg:row-span-2 space-y-8">
            <div className="rounded-2xl lg:rounded-sm overflow-hidden border border-divider shadow-md">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-auto max-h-72 lg:max-h-none lg:aspect-[3/4] object-cover"
              />
            </div>

            {/* Profile info below image on mobile */}
            <div className="lg:hidden text-center">
              <h1 className="text-2xl font-bold text-primary mb-5 leading-tight">{doctor.name}</h1>
              <div className=''>

              <span className="text-secondary font-bold mb-5 tracking-[0.2em] text-sm mb-1 block"><span className="text-primary"></span> {doctor.designation}</span>
              <span className="text-secondary font-bold  mb-5 tracking-[0.2em] text-sm mb-1 block"><span className="text-primary">Department -</span> {doctor.department}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-2 rounded-sm text-xs font-bold text-gray-600">
                  <GraduationCap size={14} /> {doctor.qualifications}
                </div>
                {/* <div className="flex items-center gap-1.5 bg-secondary/10 px-2 py-0.5 rounded-sm text-xs font-bold text-secondary">
                  <Phone size={14} /> Available Today
                </div> */}
              </div>
            </div>

            {/* CTA buttons on mobile — below image+profile row */}
            <div className="flex flex-col sm:flex-row gap-3 lg:hidden">
              <button className="btn-primary px-4 py-3 text-base font-bold flex items-center justify-center gap-2 flex-1">
                <Calendar size={18} /> Book Appointment
              </button>
              {/* <button className="btn-outline px-6 py-3 text-base font-bold flex items-center justify-center gap-2 flex-1">
                <MessageSquare size={18} /> Online Enquiry
              </button> */}
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 p-6 lg:p-8 rounded-sm space-y-6">
              <h3 className="text-xl font-bold text-primary border-b border-blue-200 pb-3">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white text-secondary flex items-center justify-center rounded-sm">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Experience</p>
                    <p className="font-bold text-primary">{doctor.experience}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white text-secondary flex items-center justify-center rounded-sm">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Languages</p>
                    <p className="font-bold text-primary">{doctor.languages.join(', ')}</p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white text-secondary flex items-center justify-center rounded-sm">
                    <Star size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Consultation Fee</p>
                    <p className="font-bold text-primary">{doctor.consultationFee}</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Right Column: Profile & Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Desktop profile header — hidden on mobile since it's shown next to image */}
            <div className="hidden lg:block border-b border-divider pb-8">
              <h1 className="text-5xl font-bold text-primary mb-4 leading-tight">{doctor.name}</h1>
              <div className=''>
                <span className="text-secondary font-bold mb-5 tracking-[0.2em] text-sm mb-1 block"><span className="text-primary"></span> {doctor.designation}</span>
                <span className="text-secondary font-bold  mb-5 tracking-[0.2em] text-sm mb-1 block"><span className="text-primary">Department -</span> {doctor.department}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-sm text-sm font-bold text-gray-600">
                  <GraduationCap size={16} /> {doctor.qualifications}
                </div>
                {/* <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-sm text-sm font-bold text-secondary">
                  <Phone size={16} /> Available Today
                </div> */}
              </div>

              <div className="flex flex-row gap-4">
                <button className="btn-primary px-10 py-4 text-lg font-bold flex items-center justify-center gap-3">
                  <Calendar size={22} /> Book Appointment
                </button>
                {/* <button className="btn-outline px-10 py-4 text-lg font-bold flex items-center justify-center gap-3">
                  <MessageSquare size={22} /> Online Enquiry
                </button> */}
              </div>
            </div>

            <section>
              <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-6 lg:mb-8 flex items-center gap-4 font-display uppercase tracking-tight">
                <span className="w-10 h-1 bg-secondary rounded-full"></span>
                Professional Biography
              </h3>
              <p className="text-gray-600 text-base lg:text-xl leading-relaxed whitespace-pre-line font-normal opacity-90">
                {doctor.about}
              </p>
              {/* <p className="mt-6 lg:mt-8 text-gray-600 leading-relaxed">
                Dr. {doctor.name.split(' ').pop()} is committed to providing the highest quality of care. Her approach combines medical excellence with compassionate patient support, ensuring that every individual receives a personalized treatment plan tailored to their specific needs.
              </p> */}
            </section>

            <section className="bg-blue-50 border border-blue-100 p-5 lg:p-10 rounded-2xl">
              <h3 className="text-lg lg:text-2xl font-bold text-primary mb-4 lg:mb-8 flex items-center gap-3 lg:gap-4 font-display uppercase tracking-tight">
                <span className="w-8 lg:w-10 h-1 bg-secondary rounded-full"></span>
                Working Hours
              </h3>
              <div className="flex flex-col gap-1 lg:gap-0 bg-white rounded-xl p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-2 lg:py-3">
                  <p className="font-bold text-gray-500 uppercase text-[10px] lg:text-xs tracking-widest mb-1 lg:mb-0">Availability</p>
                  <p className="text-primary font-bold text-sm lg:text-base">{doctor.availability}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <CTABanner 
        title={`Looking for Consultation with ${doctor.name}?`}
        subtitle={`Book your slot now.`}
      />
    </div>
  );
};

export default DoctorDetailsPage;
