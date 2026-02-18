import { useParams, Link } from 'react-router-dom';
import { doctors } from '../data/doctors';
import { Calendar, MessageSquare, Phone, Globe, Star, Award, GraduationCap, ChevronLeft } from 'lucide-react';
import CTABanner from '../components/CTABanner';

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
    <div className="pt-24 lg:pt-32">
      <div className="container-custom py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary font-semibold hover:translate-x-1 transition-transform mb-8">
          <ChevronLeft size={20} /> Back to All Doctors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Column: Image & Quick Stats */}
          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-sm overflow-hidden border border-divider shadow-md">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-auto aspect-[4/5] object-cover"
              />
            </div>
            
            <div className="bg-blue-50 p-8 rounded-sm space-y-6">
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
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white text-secondary flex items-center justify-center rounded-sm">
                    <Star size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Consultation Fee</p>
                    <p className="font-bold text-primary">{doctor.consultationFee}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile & Details */}
          <div className="lg:col-span-2 space-y-12">
            <div className="border-b border-divider pb-8">
              <span className="text-secondary font-bold uppercase tracking-[0.2em] text-sm mb-3 block">{doctor.speciality}</span>
              <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">{doctor.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-sm text-sm font-bold text-gray-600">
                  <GraduationCap size={16} /> {doctor.qualifications}
                </div>
                <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-sm text-sm font-bold text-secondary">
                  <Phone size={16} /> Available Today
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary px-10 py-4 text-lg font-bold flex items-center justify-center gap-3">
                  <Calendar size={22} /> Book Appointment
                </button>
                <button className="btn-outline px-10 py-4 text-lg font-bold flex items-center justify-center gap-3">
                  <MessageSquare size={22} /> Online Enquiry
                </button>
              </div>
            </div>

            <section>
              <h3 className="text-3xl font-bold text-primary mb-8 flex items-center gap-4 font-display uppercase tracking-tight">
                <span className="w-10 h-1 bg-secondary rounded-full"></span>
                Professional Biography
              </h3>
              <p className="text-gray-600 text-lg lg:text-xl leading-relaxed whitespace-pre-line font-normal opacity-90">
                {doctor.about}
              </p>
              <p className="mt-8 text-gray-600 leading-relaxed">
                Dr. {doctor.name.split(' ').pop()} is committed to providing the highest quality of care. Her approach combines medical excellence with compassionate patient support, ensuring that every individual receives a personalized treatment plan tailored to their specific needs.
              </p>
            </section>

            <section className="bg-white border border-divider p-10 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-4 font-display uppercase tracking-tight">
                <span className="w-10 h-1 bg-secondary rounded-full"></span>
                Working Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center py-3 border-b border-divider">
                  <span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Availability</span>
                  <span className="text-primary font-bold">{doctor.availability}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-divider">
                  <span className="font-bold text-gray-600 uppercase text-xs tracking-widest">Emergency</span>
                  <span className="text-emergency font-bold">Available 24/7</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <CTABanner 
        title={`Looking for Consultation with ${doctor.name}?`}
        subtitle={`Book your slot now and get expert medical advice from one of our top specialists in ${doctor.speciality.toLowerCase()}.`}
      />
    </div>
  );
};

export default DoctorDetailsPage;
