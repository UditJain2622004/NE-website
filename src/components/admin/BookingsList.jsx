// List of Bookings with Filters and Actions
// Fetches data from /api/admin/bookings

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  Loader2, Filter, ChevronLeft, 
  ChevronRight, Calendar, Search,
  CheckCircle2, XCircle, Clock,
  MoreVertical, Phone, Mail,
  Check, X, FileEdit, User, RefreshCw
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function BookingsList({ doctorId }) {
  const { user, apiCall } = useAdminAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Tabs configuration based on role
  const tabs = [
    { id: 'confirmed', label: 'Scheduled' },
    { id: 'completed', label: 'Completed' }
  ];

  const [statusFilter, setStatusFilter] = useState('confirmed');

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
    const targetId = doctorId || user?.doctorId;

    setIsRefreshing(true);
    try {
      const url = `/api/admin/bookings?status=${statusFilter}&dateFrom=${dateFilter}&dateTo=${dateFilter}${targetId ? `&doctorId=${targetId}` : ''}`;
      const res = await apiCall(url);
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const targetId = doctorId || user?.doctorId;
    setLoading(true);

    // Build the query - we filter by doctor and status
    // Note: We avoid filtering by date in Firestore to prevent index errors 
    // and match the successful backend API strategy (filter in memory)
    let q = query(
      collection(db, 'appointments'),
      where('status', '==', statusFilter)
    );

    if (targetId) {
      q = query(q, where('doctorId', '==', targetId));
    }

    // Subscribe to changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(docs);
      setLoading(false);
      setIsRefreshing(false);
    }, (err) => {
      console.error('Snapshot error:', err);
      setLoading(false);
      setIsRefreshing(false);
    });

    const handleRefresh = () => fetchBookings();
    window.addEventListener('refreshBookings', handleRefresh);
    
    return () => {
      unsubscribe();
      window.removeEventListener('refreshBookings', handleRefresh);
    };
  }, [statusFilter, dateFilter, doctorId, user?.doctorId]);

  const filteredBookings = bookings.filter(b => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return b.patientName?.toLowerCase().includes(s) || b.patientPhone?.includes(s);
  });



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

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this record?')) return;
    try {
      const res = await apiCall(`/api/admin/bookings?appointmentId=${id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        fetchBookings();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Delete failed:', err);
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
      {/* Search Bar */}
      <div className="bg-hospital-bg p-2 rounded-2xl flex items-center gap-3 px-4 border border-divider/50">
        <Search className="w-5 h-5 text-text-main/20" />
        <input 
          type="text"
          placeholder="Search appointments by patient name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none py-2 flex-1 text-sm font-bold placeholder:text-text-main/20"
        />
        {search && (
          <button onClick={() => setSearch('')} className="p-1 hover:bg-white rounded-lg transition-colors">
            <X className="w-4 h-4 text-text-main/40" />
          </button>
        )}
      </div>

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
          
          {/* <button 
            onClick={() => setDateFilter(format(new Date(), 'yyyy-MM-dd'))}
            className="text-xs font-bold text-primary px-3 py-2 bg-primary/5 rounded-lg hover:bg-primary/10"
          >
            Today
          </button> */}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button 
               onClick={fetchBookings}
               className="p-2 border border-divider rounded-xl hover:bg-hospital-bg transition-colors"
               title="Refresh List"
            >
              <RefreshCw className={`w-4 h-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                  statusFilter === tab.id 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                    : 'bg-white text-text-main/40 border-divider hover:border-text-main/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-divider">
            <div className="w-16 h-16 bg-hospital-bg rounded-2xl flex items-center justify-center mx-auto mb-4 border border-divider">
              <Clock className="w-8 h-8 text-text-main/20" />
            </div>
            <h3 className="text-lg font-bold text-text-main/40">No Bookings Found</h3>
            <p className="text-sm text-text-main/30 mt-1 max-w-xs mx-auto">
              There are no appointments matching your criteria.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white p-4 lg:p-5 rounded-2xl border border-divider hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group lg:flex lg:items-center gap-6"
            >
              <div className="flex items-center gap-4 lg:w-48 shrink-0">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-bold font-display text-primary leading-tight">{booking.timeSlot || booking.time}</div>
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

              <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0 lg:shrink-0 lg:w-64 lg:justify-end">
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
                      <span className="font-bold">Mark Complete</span>
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
                  <div className="flex items-center gap-2 w-full lg:w-auto">
                  
                    <button 
                      onClick={() => handleDelete(booking.id)}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                      title="Delete Entry"
                    >
                      <X className="w-5 h-5" />
                    </button>
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
