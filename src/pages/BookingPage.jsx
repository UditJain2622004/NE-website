import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, ChevronLeft, ChevronRight, Search, ChevronDown,
  User, Phone, Mail, Loader2, CheckCircle2, AlertCircle, Building2,
  Stethoscope, ArrowLeft, Info, X
} from 'lucide-react';
import {
  format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isBefore, startOfToday, addMonths, subMonths, isToday
} from 'date-fns';

import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { API_BASE } from '../apiConfig';

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatTime12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function BookingPage() {
  const [searchParams] = useSearchParams();

  // Doctors from API
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('department') || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(searchParams.get('doctorId') || '');
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [deptSearch, setDeptSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');

  // Date
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Slots
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [onLeave, setOnLeave] = useState(false);
  const [bookingType, setBookingType] = useState(null);
  const [hasFetchedSlots, setHasFetchedSlots] = useState(false);

  // Booking form
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState(null); // { success, message, appointmentId }
  const [bookingError, setBookingError] = useState(null);

  const deptRef = useRef(null);
  const docRef = useRef(null);

  // ─── Fetch Doctors ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoadingDoctors(true);
      try {
        const q = query(
          collection(db, 'doctors'),
          where('isActive', '==', true)
        );
        const snapshot = await getDocs(q);
        const doctorList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setDoctors(doctorList);

        // If doctorId came from URL, auto-set department
        const preselected = searchParams.get('doctorId');
        if (preselected) {
          const doc = doctorList.find(d => d.id === preselected);
          if (doc) {
            setSelectedDepartment(doc.department || '');
          }
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoadingDoctors(false);
      }
    })();
  }, []);

  // ─── Close dropdowns on outside click ──────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (deptRef.current && !deptRef.current.contains(e.target)) { setIsDeptOpen(false); setDeptSearch(''); }
      if (docRef.current && !docRef.current.contains(e.target)) { setIsDocOpen(false); setDocSearch(''); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── Derived data ─────────────────────────────────────────────────────
  const departments = useMemo(() => {
    const set = new Set(doctors.map(d => d.department).filter(Boolean));
    return [...set].sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      if (selectedDepartment && d.department?.toLowerCase() !== selectedDepartment.toLowerCase()) return false;
      if (docSearch && !d.name.toLowerCase().includes(docSearch.toLowerCase())) return false;
      return true;
    });
  }, [doctors, selectedDepartment, docSearch]);

  // Reset doctor if filter changes
  useEffect(() => {
    if (selectedDoctorId) {
      const valid = doctors.find(d => d.id === selectedDoctorId);
      if (valid && selectedDepartment && valid.department?.toLowerCase() !== selectedDepartment.toLowerCase()) {
        setSelectedDoctorId('');
      }
    }
  }, [selectedDepartment]);

  // ─── Fetch Slots ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) {
      setSlots([]);
      return;
    }

    (async () => {
      setLoadingSlots(true);
      setHasFetchedSlots(false);
      setSlotsError(null);
      setOnLeave(false);
      setSelectedSlot(null);
      try {
        const res = await fetch(`${API_BASE}/slots?doctorId=${selectedDoctorId}&date=${selectedDate}`);
        const data = await res.json();
        if (data.success) {
          setSlots(data.slots || []);
          setOnLeave(data.onLeave || false);
          setBookingType(data.bookingType || null);
        } else {
          setSlotsError(data.error || 'Failed to load slots');
          setSlots([]);
        }
      } catch (err) {
        setSlotsError(err.message);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
        setHasFetchedSlots(true);
      }
    })();
  }, [selectedDoctorId, selectedDate]);

  // Scroll to top on success
  useEffect(() => {
    if (bookingResult?.success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [bookingResult]);

  // ─── Book Appointment ──────────────────────────────────────────────────
  const handleBook = async () => {
    if (!selectedSlot || !patientName.trim() || !patientPhone.trim()) return;

    setBooking(true);
    setBookingError(null);
    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          date: selectedDate,
          time: selectedSlot,
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim(),
          patientEmail: patientEmail.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingResult({
          success: true,
          message: data.message,
          appointmentId: data.appointmentId,
          bookingType: data.bookingType,
          appointmentType: data.appointmentType,
        });
      } else {
        setBookingError(data.error || 'Booking failed');
      }
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBooking(false);
    }
  };

  // ─── Calendar dates ─────────────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(calendarMonth);
    const monthEnd = endOfMonth(calendarMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDow = getDay(monthStart); // 0=Sunday
    return { days, startDow };
  }, [calendarMonth]);

  const today = startOfToday();

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  // ─── Reset booking form ─────────────────────────────────────────────────
  const resetBooking = () => {
    setBookingResult(null);
    setBookingError(null);
    setSelectedSlot(null);
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  // Success screen
  if (bookingResult?.success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-2xl border border-divider text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-primary">Appointment Request Received!</h2>
          <p className="text-text-main/60 leading-relaxed font-medium">
            Your request has been sent to the doctor. 
            <span className="block text-primary font-bold mt-1 italic">Please wait for confirmation before visiting the clinic.</span>
          </p>

          <div className="bg-hospital-bg rounded-2xl p-6 text-left space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-main/40 font-bold uppercase text-[10px] tracking-widest">Doctor</span>
              <span className="font-bold text-primary">{selectedDoctor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-main/40 font-bold uppercase text-[10px] tracking-widest">Date</span>
              <span className="font-bold">{format(new Date(selectedDate + 'T00:00:00'), 'EEEE, dd MMM yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-main/40 font-bold uppercase text-[10px] tracking-widest">Time</span>
              <span className="font-bold">{formatTime12(selectedSlot)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-main/40 font-bold uppercase text-[10px] tracking-widest">Type</span>
              <span className="font-bold capitalize">{bookingResult.appointmentType}</span>
            </div>
          </div>

          {bookingResult.appointmentType === 'followup' && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-left space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                <span className="font-bold text-sm">Follow-up Detected</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Since you've visited <strong>{selectedDoctor?.name}</strong> within the last 7 days, 
                this appointment will be considered a <strong>Follow-up</strong> once confirmed by the doctor.
              </p>
            </div>
          )}

          {bookingResult.bookingType === 'request' && bookingResult.appointmentType !== 'followup' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 font-medium leading-relaxed">
              <Info className="w-4 h-4 inline mr-1 -mt-0.5" />
              This is a request booking. The doctor will review and confirm your appointment.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={resetBooking} className="flex-1 py-3.5 bg-hospital-bg border border-divider rounded-xl font-bold text-sm text-text-main/60 hover:bg-divider/30 transition-all">
              Book Another
            </button>
            <Link to="/" className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold text-sm text-center shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 lg:py-14 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 bg-white border border-divider rounded-xl text-text-main/40 hover:text-primary hover:border-primary transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-primary">Book an Appointment</h1>
          <p className="text-xs font-bold text-text-main/40 uppercase tracking-widest mt-0.5">Choose your doctor and time slot</p>
        </div>
      </div>

      {/* ─── Step 1: Filters ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-[2rem] border border-divider shadow-sm p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-black">1</div>
          <h2 className="font-bold text-lg">Select Doctor</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department Filter */}
          <div className="relative" ref={deptRef}>
            <label className="text-[10px] font-black uppercase tracking-widest text-text-main/30 ml-1 mb-1.5 block">Department</label>
            <button
              type="button"
              onClick={() => { setIsDeptOpen(!isDeptOpen); setIsDocOpen(false); }}
              className="w-full flex items-center justify-between gap-2 bg-hospital-bg border border-divider p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm text-primary text-left"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-text-main/30" />
                <span className="truncate">{selectedDepartment ? (selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1)) : 'All Departments'}</span>
              </div>
              <ChevronDown size={18} className={`text-text-main/30 transition-transform duration-300 shrink-0 ${isDeptOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDeptOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-divider rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 bg-hospital-bg border-b border-divider">
                  <div className="relative">
                    <input
                      type="text" placeholder="Search departments..."
                      className="w-full bg-white border border-divider rounded-xl py-2 px-3 pl-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)} autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-main/30" size={14} />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  <div className="px-4 py-2.5 hover:bg-primary/5 cursor-pointer text-xs font-bold text-primary transition-colors"
                    onClick={() => { setSelectedDepartment(''); setIsDeptOpen(false); setDeptSearch(''); }}>
                    All Departments
                  </div>
                  {departments
                    .filter(d => d.toLowerCase().includes(deptSearch.toLowerCase()))
                    .map(dept => (
                      <div key={dept}
                        className={`px-4 py-2.5 hover:bg-primary/5 cursor-pointer text-xs font-medium transition-colors ${selectedDepartment === dept ? 'bg-primary/5 text-primary font-bold' : 'text-text-main/60'}`}
                        onClick={() => { setSelectedDepartment(dept); setIsDeptOpen(false); setDeptSearch(''); }}>
                        {dept.charAt(0).toUpperCase() + dept.slice(1)}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Doctor Filter */}
          <div className="relative" ref={docRef}>
            <label className="text-[10px] font-black uppercase tracking-widest text-text-main/30 ml-1 mb-1.5 block">Doctor</label>
            <button
              type="button"
              onClick={() => { setIsDocOpen(!isDocOpen); setIsDeptOpen(false); }}
              disabled={loadingDoctors}
              className="w-full flex items-center justify-between gap-2 bg-hospital-bg border border-divider p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm text-primary text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-4 h-4 text-text-main/30" />
                <span className="truncate">
                  {loadingDoctors ? 'Loading...' : selectedDoctor ? selectedDoctor.name : 'Select Doctor'}
                </span>
              </div>
              <ChevronDown size={18} className={`text-text-main/30 transition-transform duration-300 shrink-0 ${isDocOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDocOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-divider rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 bg-hospital-bg border-b border-divider">
                  <div className="relative">
                    <input
                      type="text" placeholder="Search doctors..."
                      className="w-full bg-white border border-divider rounded-xl py-2 px-3 pl-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={docSearch} onChange={(e) => setDocSearch(e.target.value)} autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-main/30" size={14} />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {filteredDoctors.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-text-main/30 font-medium">No doctors found</div>
                  ) : (
                    filteredDoctors.map(doc => (
                      <div key={doc.id}
                        className={`px-4 py-3 hover:bg-primary/5 cursor-pointer transition-colors flex items-center gap-3 ${selectedDoctorId === doc.id ? 'bg-primary/5' : ''}`}
                        onClick={() => { setSelectedDoctorId(doc.id); setIsDocOpen(false); setDocSearch(''); }}>
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {doc.name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${selectedDoctorId === doc.id ? 'text-primary' : 'text-text-main'}`}>{doc.name}</p>
                          <p className="text-[10px] text-text-main/40 truncate">{doc.specialization || doc.department}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Doctor Info */}
        {selectedDoctor && (
          <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg shrink-0">
              {selectedDoctor.name?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-primary text-sm truncate">{selectedDoctor.name}</p>
              <p className="text-xs text-text-main/50 truncate">{selectedDoctor.specialization || selectedDoctor.department}</p>
            </div>
            <button onClick={() => setSelectedDoctorId('')} className="p-2 text-text-main/30 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* ─── Step 2 & 3: Date & Slots ─────────────────────────────────── */}
      {selectedDoctorId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ─── Step 2: Date Selection ──────────────────────────────────────── */}
          <section className="bg-white rounded-[2rem] border border-divider shadow-sm p-5 lg:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
            <div className="flex items-center gap-3 text-primary">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-black">2</div>
              <h2 className="font-bold text-lg">Choose Date</h2>
            </div>

            {/* Desktop: Full Calendar */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                  className="p-1.5 hover:bg-hospital-bg rounded-xl transition-colors text-text-main/40 hover:text-primary">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="font-display font-bold text-base text-primary">{format(calendarMonth, 'MMMM yyyy')}</h3>
                <button onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                  className="p-1.5 hover:bg-hospital-bg rounded-xl transition-colors text-text-main/40 hover:text-primary">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[9px] font-black uppercase tracking-widest text-text-main/30 py-1.5">{d}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for offset */}
                {Array.from({ length: calendarDays.startDow }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {calendarDays.days.map(day => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isPast = isBefore(day, today);
                  const isSelected = dateStr === selectedDate;
                  const isTodayDate = isToday(day);

                  return (
                    <button
                      key={dateStr}
                      disabled={isPast}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`
                        relative py-2.5 rounded-xl text-xs font-bold transition-all
                        ${isPast ? 'text-text-main/15 cursor-not-allowed' :
                          isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' :
                          isTodayDate ? 'bg-secondary/10 text-secondary border-2 border-secondary/20 hover:bg-secondary/20' :
                          'text-text-main/70 hover:bg-primary/5 hover:text-primary'}
                      `}
                    >
                      {format(day, 'd')}
                      {isTodayDate && !isSelected && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile: Date Navigator */}
            <div className="lg:hidden">
              <div className="flex items-center gap-2 bg-hospital-bg p-1.5 rounded-2xl border border-divider">
                <button onClick={() => {
                  const d = new Date(selectedDate + 'T00:00:00');
                  d.setDate(d.getDate() - 1);
                  if (!isBefore(d, today)) setSelectedDate(format(d, 'yyyy-MM-dd'));
                }}
                  className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-text-main/60">
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex-1 flex items-center justify-center gap-2.5">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <input
                    type="date"
                    value={selectedDate}
                    min={format(today, 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent font-bold text-sm outline-none text-center"
                  />
                </div>

                <button onClick={() => {
                  const d = new Date(selectedDate + 'T00:00:00');
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(format(d, 'yyyy-MM-dd'));
                }}
                  className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-text-main/60">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Quick date pills */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {[0, 1, 2, 3, 4, 5, 6].map(i => {
                  const d = addDays(today, i);
                  const ds = format(d, 'yyyy-MM-dd');
                  const isActive = ds === selectedDate;
                  return (
                    <button key={ds} onClick={() => setSelectedDate(ds)}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                          : 'bg-white border-divider text-text-main/60 hover:border-primary/30'
                      }`}>
                      <span className="block text-[10px] uppercase tracking-wider opacity-70">{i === 0 ? 'Today' : format(d, 'EEE')}</span>
                      <span className="block">{format(d, 'dd MMM')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs font-bold text-text-main/60 pt-2 border-t border-divider/50">
              Selected: <span className="text-primary">{format(new Date(selectedDate + 'T00:00:00'), 'EEEE, dd MMMM yyyy')}</span>
            </div>
          </section>

          {/* ─── Step 3: Available Slots ─────────────────────────────────────── */}
          {selectedDate && selectedDoctorId && (
            <section className="bg-white rounded-[2rem] border border-divider shadow-sm p-5 lg:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
              <div className="flex items-center gap-3 text-primary">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-black">3</div>
                <h2 className="font-bold text-lg">Pick a Time Slot</h2>
              </div>

              {(loadingSlots || !hasFetchedSlots) ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-bold text-text-main/30 uppercase tracking-widest">Loading available slots...</p>
                </div>
              ) : slotsError ? (
                <div className="py-12 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                  <p className="text-sm text-red-600 font-medium">{slotsError}</p>
                </div>
              ) : onLeave ? (
                <div className="py-12 text-center space-y-3">
                  <Calendar className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-amber-700">Doctor is on leave for this date</p>
                  <p className="text-xs text-text-main/40">Please choose a different date</p>
                </div>
              ) : (slots.length === 0 && hasFetchedSlots) ? (
                <div className="py-12 text-center space-y-3">
                  <Info className="w-10 h-10 text-text-main/15 mx-auto" />
                  <p className="text-sm font-bold text-text-main/50">No slots available</p>
                  <p className="text-xs text-text-main/30">The doctor does not have working hours on this day or all slots are booked.</p>
                </div>
              ) : (
                <>
                  {bookingType === 'request' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>This date is more than 20 days away. Your booking will be a <strong>request</strong>.</span>
                    </div>
                  )}

                  {/* Slot Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3">
                    {slots.map(slot => {
                      const isBooked = slot.booked;
                      const isActive = selectedSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(isActive ? null : slot.time)}
                          className={`
                            py-3 rounded-xl lg:rounded-2xl text-center transition-all border-2 font-bold
                            ${isBooked
                              ? 'bg-gray-50 border-divider text-text-main/20 cursor-not-allowed line-through'
                              : isActive
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                                : 'bg-white border-divider text-text-main/70 hover:border-primary hover:text-primary hover:shadow-md'}
                          `}
                        >
                          <Clock className={`w-3.5 h-3.5 mx-auto mb-1 ${isActive ? 'text-white' : isBooked ? 'text-text-main/15' : 'text-text-main/30'}`} />
                          <span className="text-xs">{formatTime12(slot.time)}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-[10px] font-bold text-text-main/30 uppercase tracking-widest pt-2 border-t border-divider/50">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400" /> Available</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-300" /> Booked</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Selected</span>
                  </div>
                </>
              )}
            </section>
          )}
        </div>
      )}

      {/* ─── Step 4: Patient Details ─────────────────────────────────────── */}
      {selectedSlot && (
        <section className="bg-white rounded-[2rem] border border-divider shadow-sm p-6 lg:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 text-primary">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-black">4</div>
            <h2 className="font-bold text-lg">Your Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-main/30 ml-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/20" />
                <input
                  type="text" placeholder="e.g. John Doe"
                  value={patientName} onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-hospital-bg border border-divider rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-text-main/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-main/30 ml-1">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/20" />
                <input
                  type="tel" placeholder="e.g. 9876543210"
                  value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-hospital-bg border border-divider rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-text-main/20"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-main/30 ml-1">Email (optional)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/20" />
                <input
                  type="email" placeholder="john@example.com"
                  value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-hospital-bg border border-divider rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-text-main/20"
                />
              </div>
            </div>
          </div>

          {/* Follow-up Note */}
          <div className="bg-hospital-bg rounded-2xl p-4 border border-divider/50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-main/30">Follow-up Policy</p>
              <p className="text-xs text-text-main/60 leading-relaxed">
                If you have visited this doctor in the last 7 days, this appointment will be treated as a <strong className="text-primary">Follow-up</strong> after doctor confirmation.
              </p>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-hospital-bg rounded-2xl p-5 space-y-3 border border-divider/50">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-main/30">Appointment Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span className="font-bold text-text-main/70 truncate">{selectedDoctor?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-bold text-text-main/70">{format(new Date(selectedDate + 'T00:00:00'), 'dd MMM yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-bold text-text-main/70">{formatTime12(selectedSlot)}</span>
              </div>
            </div>
          </div>

          {bookingError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 font-medium">{bookingError}</p>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={booking || !patientName.trim() || !patientPhone.trim()}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {booking ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Booking...</>
            ) : (
              <><CheckCircle2 className="w-5 h-5" /> Confirm Appointment</>
            )}
          </button>
        </section>
      )}
    </div>
  );
}
