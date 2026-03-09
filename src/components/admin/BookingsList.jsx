// List of Bookings with Filters and Actions
// Fetches data from /api/admin/bookings

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  Loader2, Filter, ChevronLeft, 
  ChevronRight, Calendar, Search,
  CheckCircle2, XCircle, Clock,
  MoreVertical, Phone, Mail,
  Check, X, FileEdit, User
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

export default function BookingsList() {
  const { user, apiCall } = useAdminAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending,confirmed');
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Status map for colors
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 font-bold border border-yellow-200',
    confirmed: 'bg-green-100 text-green-700 font-bold border border-green-200',
    completed: 'bg-blue-100 text-blue-700 font-bold border border-blue-200',
    rejected: 'bg-gray-100 text-gray-500 font-bold border border-gray-200',
    cancelled: 'bg-red-100 text-red-600 font-bold border border-red-200',
  };

  const fetchBookings = async () => {
    setIsRefreshing(true);
    try {
      const { bookings: data } = await apiCall(`/api/admin/bookings?status=${statusFilter}&dateFrom=${dateFilter}&dateTo=${dateFilter}`);
      setBookings(data || []);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Listen for refresh events from other components
    const handleRefresh = () => fetchBookings();
    window.addEventListener('refreshBookings', handleRefresh);
    return () => window.removeEventListener('refreshBookings', handleRefresh);
  }, [statusFilter, dateFilter]);

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this appointment?`)) return;
    try {
      const res = await apiCall('/api/admin/bookings', {
        method: 'PATCH',
        body: JSON.stringify({ appointmentId: id, action })
      });
      if (res.success) {
        fetchBookings();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const changeDate = (days) => {
    const nextDate = addDays(new Date(dateFilter), days);
    setDateFilter(format(nextDate, 'yyyy-MM-dd'));
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-divider flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => changeDate(-1)} 
            className="p-2 border border-divider rounded-xl hover:bg-hospital-bg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-text-main/60" />
          </button>
          
          <div className="relative group flex-1 lg:w-48">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-hospital-bg border border-divider rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/10 transition-all outline-none"
            />
          </div>

          <button 
            onClick={() => changeDate(1)} 
            className="p-2 border border-divider rounded-xl hover:bg-hospital-bg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-text-main/60" />
          </button>
          
          <button 
            onClick={() => setDateFilter(format(new Date(), 'yyyy-MM-dd'))}
            className="text-xs font-bold text-primary px-3 py-2 bg-primary/5 rounded-lg hover:bg-primary/10"
          >
            Today
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['pending,confirmed', 'completed', 'rejected,cancelled'].map((val) => (
            <button
              key={val}
              onClick={() => setStatusFilter(val)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                statusFilter === val 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                  : 'bg-white text-text-main/40 border-divider hover:border-text-main/20'
              }`}
            >
              {val === 'pending,confirmed' ? 'Active' : val === 'rejected,cancelled' ? 'Closed' : val}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-divider">
            <div className="w-16 h-16 bg-hospital-bg rounded-2xl flex items-center justify-center mx-auto mb-4 border border-divider">
              <Clock className="w-8 h-8 text-text-main/20" />
            </div>
            <h3 className="text-lg font-bold text-text-main/40">No Bookings Found</h3>
            <p className="text-sm text-text-main/30 mt-1 max-w-xs mx-auto">
              There are no appointments matching your criteria for this date.
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white p-4 lg:p-5 rounded-2xl border border-divider hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group lg:flex lg:items-center gap-6"
            >
              <div className="flex items-center gap-4 lg:w-48 shrink-0">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-bold font-display text-primary leading-tight">{booking.timeSlot}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-main/30 mt-0.5">Time Slot</div>
                </div>
              </div>

              <div className="h-px w-full bg-divider my-4 lg:hidden"></div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-lg text-text-main truncate capitalize">{booking.patientName}</h4>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-main/60">
                  <a href={`tel:${booking.patientPhone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="font-medium">{booking.patientPhone}</span>
                  </a>
                  {booking.patientEmail && (
                    <div className="hidden sm:flex items-center gap-1.5 overflow-hidden">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[150px]">{booking.patientEmail}</span>
                    </div>
                  )}
                  {user?.role === 'admin' && (
                    <div className="flex items-center gap-1.5 text-primary/70 font-bold bg-primary/5 px-2 py-0.5 rounded-lg text-xs leading-none">
                      <User className="w-3 h-3" />
                      <span>{booking.doctorName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0 lg:shrink-0 lg:w-48 lg:justify-end">
                {booking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleAction(booking.id, 'confirm')}
                      className="flex-1 lg:flex-none p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 px-4 shadow-lg shadow-green-500/20"
                    >
                      <Check className="w-5 h-5" />
                      <span className="lg:hidden font-bold">Confirm</span>
                    </button>
                    <button 
                      onClick={() => handleAction(booking.id, 'reject')}
                      className="flex-1 lg:flex-none p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 px-4 border border-red-100"
                    >
                      <X className="w-5 h-5" />
                      <span className="lg:hidden font-bold">Reject</span>
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <>
                    <button 
                      onClick={() => handleAction(booking.id, 'complete')}
                      className="flex-1 lg:flex-none p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 px-4 shadow-lg shadow-primary/20"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="lg:hidden font-bold">Mark Complete</span>
                    </button>
                    <button 
                       onClick={() => handleAction(booking.id, 'cancel')}
                       className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                       title="Cancel Appointment"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}
                {['rejected', 'cancelled', 'completed'].includes(booking.status) && (
                  <div className="text-[10px] font-black uppercase tracking-widest text-text-main/20 italic p-2 px-4 border border-divider rounded-xl w-full text-center lg:w-auto">
                    Entry Archived
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
