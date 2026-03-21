// Create New Booking Modal for Admins
// Fetches slots from /api/slots and posts to /api/admin/bookings or /api/healthCheckups

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  Loader2, X, User, Phone, 
  Mail, Calendar, Clock, 
  Check, ChevronRight,
  UserPlus, HeartPulse, ClipboardList, Info
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { API_BASE } from '../../apiConfig';
import { packages } from '../../data/packages';

export default function CreateBookingModal({ onClose, onSuccess, initialDoctorId }) {
  const { apiCall } = useAdminAuth();
  const [step, setStep] = useState(0); // 0: Type, 1: Info, 2: Patient
  const [bookingType, setBookingType] = useState(null); // 'appointment' | 'healthCheckup'
  
  // Data State
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [hasFetchedSlots, setHasFetchedSlots] = useState(false);
 
  // Shared Form State
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [saving, setSaving] = useState(false);

  // Appointment State
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctorId || '');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Health Checkup State
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [followUpType, setFollowUpType] = useState(null); // 'followup' | 'new'

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { doctors: dData } = await apiCall('/api/admin/doctors');
        setDoctors(dData || []);
        if (dData?.[0] && !selectedDoctor) setSelectedDoctor(dData[0].id);
      } catch (err) {
        console.error('Fetch doctors failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [initialDoctorId]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);


  const fetchSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;
    setSlotsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/slots?doctorId=${selectedDoctor}&date=${selectedDate}`);
      const data = await res.json();
      setSlots(data.slots || []);
      setSelectedSlot('');
      setHasFetchedSlots(true);
    } catch (err) {
      console.error('Fetch slots failed:', err);
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (bookingType === 'appointment' && step === 1) {
      fetchSlots();
    }
  }, [step, selectedDoctor, selectedDate, bookingType]);

  // Check for follow-up
  useEffect(() => {
    const checkFollowUp = async () => {
      if (bookingType === 'appointment' && patientPhone.length >= 10 && selectedDoctor) {
        try {
          const res = await apiCall(`/api/admin/bookings?checkFollowup=true&patientPhone=${patientPhone}&doctorId=${selectedDoctor}`);
          if (res.success) {
            setFollowUpType(res.type);
          }
        } catch (err) {
          console.error('Follow-up check failed:', err);
        }
      } else {
        setFollowUpType(null);
      }
    };
    checkFollowUp();
  }, [bookingType, patientPhone, selectedDoctor]);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (bookingType === 'appointment') {
      if (!selectedSlot) return alert('Please select a time slot');
    } else {
      if (!selectedPackage) return alert('Please select a health checkup package');
    }
    
    setSaving(true);
    try {
      let url, body;
      if (bookingType === 'appointment') {
        url = '/api/admin/bookings';
        body = {
          doctorId: selectedDoctor,
          date: selectedDate,
          time: selectedSlot,
          patientName,
          patientPhone,
          patientEmail,
          status: 'confirmed'
        };
      } else {
        url = '/api/healthCheckups';
        body = {
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          packagePrice: selectedPackage.price,
          patientName,
          patientPhone,
          patientEmail,
          preferredDate: selectedDate,
          status: 'confirmed'
        };
      }

      const res = await apiCall(url, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (res.success) {
        onSuccess?.();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Create failed:', err);
      alert('An error occurred. Please check console.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4 overscroll-none">
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-10 animate-slide-up sm:animate-fade-in relative max-h-[90vh] overflow-y-auto border-t border-white/20">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-xl hover:bg-hospital-bg text-text-main/40 transition-all border border-divider/50 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 sm:mb-8 pr-12">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/20 shrink-0">
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-display font-bold text-primary truncate">
              {bookingType === 'healthCheckup' ? 'New Health Check' : bookingType === 'appointment' ? 'New Appointment' : 'Create New Booking'}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-main/20 mt-0.5 leading-none">Admin Creation Panel</p>
          </div>
        </div>

        {step === 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-bold text-text-main/60 mb-6 text-center">What would you like to create today?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => { setBookingType('appointment'); setStep(1); }}
                className="group p-6 rounded-3xl border-2 border-divider hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-4 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="block font-bold text-lg text-primary">Doctor Visit</span>
                  <span className="block text-[10px] uppercase font-black tracking-widest text-text-main/40">Regular Appointment</span>
                </div>
              </button>

              <button
                onClick={() => { setBookingType('healthCheckup'); setStep(1); }}
                className="group p-6 rounded-3xl border-2 border-divider hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-4 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <HeartPulse className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="block font-bold text-lg text-primary">Health Checkup</span>
                  <span className="block text-[10px] uppercase font-black tracking-widest text-text-main/40">Preventive Package</span>
                </div>
              </button>
            </div>
          </div>
        ) : step === 1 ? (
          <div className="space-y-6">
            {bookingType === 'appointment' ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Select Doctor</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                    {doctors.map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDoctor(d.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                          selectedDoctor === d.id 
                            ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20' 
                            : 'bg-white border-divider hover:bg-hospital-bg'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm ${selectedDoctor === d.id ? 'bg-primary text-white' : 'bg-hospital-bg text-text-main/40'}`}>
                          {d.name.charAt(0)}
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <div className="font-bold text-sm text-text-main leading-tight capitalize truncate">{d.name}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-text-main/30 mt-0.5 truncate">{d.specialization}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Select Date</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
                    {[...Array(14)].map((_, i) => {
                      const d = addDays(new Date(), i);
                      const dStr = format(d, 'yyyy-MM-dd');
                      return (
                        <button
                          key={dStr}
                          type="button"
                          onClick={() => setSelectedDate(dStr)}
                          className={`min-w-[70px] flex flex-col items-center p-3 rounded-2xl border transition-all ${
                            selectedDate === dStr 
                              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                              : 'bg-white text-text-main/40 border-divider hover:border-text-main/20'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-black opacity-60 truncate">{format(d, 'EEE')}</span>
                          <span className="text-lg font-bold font-display leading-tight">{format(d, 'd')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Select Package</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                    {packages.map(pkg => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                          selectedPackage?.id === pkg.id 
                            ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20' 
                            : 'bg-white border-divider hover:bg-hospital-bg'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                           <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm ${selectedPackage?.id === pkg.id ? 'bg-primary text-white' : 'bg-hospital-bg text-text-main/40'}`}>
                            {pkg.id}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-text-main leading-tight truncate">{pkg.name}</div>
                            <div className="text-[10px] font-bold text-text-main/30 mt-0.5">₹{pkg.price}</div>
                          </div>
                        </div>
                        {selectedPackage?.id === pkg.id && <Check className="w-5 h-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Preferred Date</label>
                  <input 
                    type="date"
                    min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-hospital-bg border border-divider rounded-xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/10"
                  />
                  <p className="text-[10px] text-text-main/40 ml-1 mt-1 font-medium">Health checkups can be booked from next day onwards.</p>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex-1 px-4 py-4 bg-white border border-divider text-text-main/60 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-hospital-bg transition-colors h-14"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={(bookingType === 'appointment' && !selectedDoctor) || (bookingType === 'healthCheckup' && !selectedPackage)}
                className="flex-[2] btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-xl shadow-primary/20 h-14"
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-6 animate-fade-in">
            {bookingType === 'appointment' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Available Slots</label>
                {slotsLoading ? (
                  <div className="flex items-center justify-center h-20 bg-hospital-bg rounded-2xl border border-divider">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (slots.length === 0 && hasFetchedSlots) ? (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100">
                    No slots available for this doctor on selected date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        disabled={s.booked}
                        onClick={() => setSelectedSlot(s.time)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          s.booked 
                            ? 'bg-red-50 text-red-200 border-red-50 cursor-not-allowed opacity-50' 
                            : selectedSlot === s.time
                              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.05]'
                              : 'bg-white text-text-main/60 border-divider hover:border-primary/40'
                        }`}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Patient Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-hospital-bg border border-divider rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-bold text-sm h-12"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30" />
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-hospital-bg border border-divider rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-bold text-sm h-12"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            {followUpType === 'followup' && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-primary">Follow-up Detected</p>
                  <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                    This patient has visited the doctor in the last 7 days. This booking will be marked as a <strong>Follow-up</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1 text-center block">Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30" />
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-hospital-bg border border-divider rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-bold text-sm h-12"
                  placeholder="patient@example.com"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-4 bg-white border border-divider text-text-main/60 rounded-xl font-bold text-sm hover:bg-hospital-bg transition-colors h-14"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={saving || (bookingType === 'appointment' && slots.length === 0)}
                className="flex-[2] btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-xl shadow-primary/20 h-14"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" />Confirm Booking</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
