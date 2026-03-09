// Create New Booking Modal for Admins
// Fetches slots from /api/slots and posts to /api/admin/bookings

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  Loader2, X, User, Phone, 
  Mail, Calendar, Clock, 
  Check, ChevronRight,
  UserPlus
} from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function CreateBookingModal({ onClose, onSuccess }) {
  const { apiCall } = useAdminAuth();
  const [step, setStep] = useState(1); // 1: Doctor/Date, 2: Slot/Patient
  
  // Data State
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Form State
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { doctors: dData } = await apiCall('/api/admin/doctors');
        setDoctors(dData || []);
        if (dData?.[0]) setSelectedDoctor(dData[0].id);
      } catch (err) {
        console.error('Fetch doctors failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const fetchSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;
    setSlotsLoading(true);
    try {
      const res = await fetch(`/api/slots?doctorId=${selectedDoctor}&date=${selectedDate}`);
      const data = await res.json();
      setSlots(data.slots || []);
      setSelectedSlot('');
    } catch (err) {
      console.error('Fetch slots failed:', err);
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2) fetchSlots();
  }, [step, selectedDoctor, selectedDate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return alert('Please select a time slot');
    
    setSaving(true);
    try {
      const res = await apiCall('/api/admin/bookings', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: selectedDoctor,
          date: selectedDate,
          time: selectedSlot,
          patientName,
          patientPhone,
          patientEmail,
          status: 'confirmed' // Pre-confirm admin bookings
        })
      });
      if (res.success) {
        onSuccess?.();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 lg:p-10 animate-slide-up sm:animate-fade-in relative max-h-[90vh] overflow-y-auto border-t border-white/20">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-xl hover:bg-hospital-bg text-text-main/40 transition-all border border-divider/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-primary">New Appointment</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-main/20 mt-0.5 leading-none">Admin Creation Panel</p>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Select Doctor</label>
              <div className="grid grid-cols-1 gap-2">
                {doctors.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDoctor(d.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                      selectedDoctor === d.id 
                        ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20' 
                        : 'bg-white border-divider hover:bg-hospital-bg'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${selectedDoctor === d.id ? 'bg-primary text-white' : 'bg-hospital-bg text-text-main/40'}`}>
                      {d.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-text-main leading-tight capitalize">{d.name}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-text-main/30 mt-0.5">{d.specialization}</div>
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

            <button
              onClick={() => setStep(2)}
              className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 mt-4 text-sm font-bold shadow-xl shadow-primary/20 h-14"
            >
              Next: Patient Info
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-6 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Available Slots</label>
              {slotsLoading ? (
                <div className="flex items-center justify-center h-20 bg-hospital-bg rounded-2xl border border-divider">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : slots.length === 0 ? (
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
                disabled={saving || slots.length === 0}
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
