import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { packages } from '../data/packages';
import Breadcrumb from '../components/Breadcrumb';
import {
  User, Phone, Mail, Calendar, IndianRupee,
  CheckCircle2, Loader2, ShieldCheck,
  X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore, isAfter, isSameDay, startOfDay } from 'date-fns';
import { API_BASE } from '../apiConfig';

const BookHealthCheckupPage = () => {
  const { packageSlug } = useParams();
  const pkg = packages.find((p) => p.slug === packageSlug);

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [checkupId, setCheckupId] = useState('');

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Package Not Found</h2>
          <Link to="/services/health-check-packages" className="btn-primary">Back to All Packages</Link>
        </div>
      </div>
    );
  }

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const maxDate = addDays(today, 90);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const canGoPrev = isAfter(monthStart, tomorrow);
  const canGoNext = isBefore(endOfMonth(currentMonth), addDays(today, 120));

  function isDateSelectable(date) {
    return !isBefore(date, tomorrow) && !isAfter(date, maxDate);
  }

  const scrollToError = () => {
    setTimeout(() => {
      document.getElementById('booking-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!preferredDate) {
      setError('Please select a preferred date for your health checkup.');
      scrollToError();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/healthCheckups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          packageName: pkg.name,
          packagePrice: pkg.price,
          patientName,
          patientPhone,
          patientEmail: patientEmail || undefined,
          preferredDate,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setError(`Server returned an unexpected response (HTTP ${res.status}). Please try again.`);
        scrollToError();
        return;
      }

      if (data.success) {
        setSuccess(true);
        setCheckupId(data.checkupId);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        scrollToError();
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      scrollToError();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-hospital-bg">
      {/* Success Popup Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto border-t border-white/20 animate-slide-up">
            <button
              onClick={() => setSuccess(false)}
              className="absolute right-4 top-4 p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary font-display">Booking Confirmed!</h3>
              <p className="text-sm text-gray-500 mt-1">No further approval needed</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-left">
              <p className="text-[10px] font-bold text-green-800 uppercase tracking-widest mb-2">Booking Details</p>
              <div className="space-y-1 text-sm text-green-900">
                <p><span className="font-semibold">Booking ID:</span> {checkupId}</p>
                <p><span className="font-semibold">Package:</span> {pkg.name}</p>
                <p><span className="font-semibold">Date:</span> {preferredDate && format(new Date(preferredDate + 'T00:00:00'), 'EEEE, dd MMM yyyy')}</p>
                <p><span className="font-semibold">Name:</span> {patientName}</p>
                <p><span className="font-semibold">Phone:</span> {patientPhone}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <ShieldCheck size={12} /> Preparation Reminders
              </p>
              <ul className="space-y-1 text-xs text-amber-900">
                {pkg.guidelines.slice(0, 3).map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">{i + 1}.</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              {/* <button
                onClick={() => {
                  setSuccess(false);
                  setPatientName('');
                  setPatientPhone('');
                  setPatientEmail('');
                  setPreferredDate('');
                  setCheckupId('');
                }}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Book Another
              </button> */}
              <Link
                to={`/services/health-check-packages/`}
                className="flex-1 btn border border-gray-200 py-3 rounded-xl font-bold text-sm flex items-center justify-center"
              >
                Book Another
              </Link>
              <Link
                to={`/services/health-check-packages/${pkg.slug}`}
                className="flex-1 btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center"
              >
                Back to Package
              </Link>
            </div>
          </div>
        </div>
      )}
      <section className="py-6 lg:py-12">
        <div className="container-custom px-4 sm:px-6 lg:px-0">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Health Check Packages', path: '/services/health-check-packages' },
            { label: pkg.name, path: `/services/health-check-packages/${pkg.slug}` },
            { label: 'Book' },
          ]} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-12 mt-8">
            {/* Left: Package summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-divider shadow-lg overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/70 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <h2 className="text-xl font-bold text-white font-display leading-tight">{pkg.name}</h2>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{pkg.description}</p>
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 w-fit">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
                    <IndianRupee size={18} className="text-secondary" />
                    <span className="text-2xl font-bold text-primary font-display">{pkg.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Mini inclusions */}
              <div className="bg-white rounded-2xl border border-divider shadow-sm p-5 hidden lg:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">What's Included</p>
                <ul className="space-y-1.5">
                  {pkg.inclusions.slice(0, 6).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 size={12} className="text-secondary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                  {pkg.inclusions.length > 6 && (
                    <li className="text-[10px] font-bold text-secondary pl-5">
                      + {pkg.inclusions.length - 6} more
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Right: Booking form */}
            <div className="bg-white rounded-2xl border border-divider shadow-xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-primary">Book Health Checkup</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">Instant Confirmation</p>
                </div>
              </div>

              {error && (
                <div id="booking-error" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-slide-up">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Details */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Details</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none font-medium text-sm h-12"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                          type="tel"
                          required
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none font-medium text-sm h-12"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email (Optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none font-medium text-sm h-12"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Date picker */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Preferred Date *</p>

                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => canGoPrev && setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                        className={`p-2 rounded-lg transition-colors ${canGoPrev ? 'hover:bg-white text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}
                        disabled={!canGoPrev}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <h4 className="font-bold text-sm text-primary font-display">
                        {format(currentMonth, 'MMMM yyyy')}
                      </h4>
                      <button
                        type="button"
                        onClick={() => canGoNext && setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                        className={`p-2 rounded-lg transition-colors ${canGoNext ? 'hover:bg-white text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}
                        disabled={!canGoNext}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1">{d}</div>
                      ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: startPad }).map((_, i) => (
                        <div key={`pad-${i}`} />
                      ))}
                      {daysInMonth.map((date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const selectable = isDateSelectable(date);
                        const selected = preferredDate === dateStr;
                        const isToday = isSameDay(date, today);

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            disabled={!selectable}
                            onClick={() => selectable && setPreferredDate(dateStr)}
                            className={`aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all relative ${
                              selected
                                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                : selectable
                                  ? 'hover:bg-white hover:shadow-sm text-gray-700 cursor-pointer'
                                  : 'text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {format(date, 'd')}
                            {isToday && !selected && (
                              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {preferredDate && (
                      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-secondary" />
                        <span className="font-semibold text-primary">
                          {format(new Date(preferredDate + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-xl shadow-primary/20 h-14 mt-4"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirm Booking — {pkg.price.toLocaleString('en-IN')}
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  By booking, you agree to follow the preparation guidelines.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookHealthCheckupPage;
