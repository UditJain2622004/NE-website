import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import {
  Loader2, Calendar, Search, Clock,
  Phone, Mail, User, Info, RefreshCw,
  CheckCircle2, XCircle, Trash2, Filter,
  ArrowUpDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, parseISO } from 'date-fns';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

export default function BookingHistory({ doctorId }) {
  const { user, apiCall } = useAdminAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('completed');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [pageHistory, setPageHistory] = useState([]); // Array of first docs for each page
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    rejected: 'bg-gray-100 text-gray-500 border-gray-200',
    cancelled: 'bg-red-100 text-red-600 border-red-200',
  };

  // Switch to async fetch instead of onSnapshot for strict pagination control
  useEffect(() => {
    const targetId = doctorId || user?.doctorId;

    const loadFirstPage = async () => {
      setLoading(true);
      try {
        let q = query(
          collection(db, 'appointments'),
          where('status', '==', statusFilter)
        );

        if (targetId) q = query(q, where('doctorId', '==', targetId));
        if (dateFilter) q = query(q, where('appointmentDate', '==', dateFilter));

        q = query(
          q,
          orderBy('appointmentDate', 'desc'),
          orderBy('timeSlot', 'desc'),
          limit(itemsPerPage + 1)
        );

        const snapshot = await getDocs(q);
        const docs = snapshot.docs.slice(0, itemsPerPage).map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(docs);
        setLastVisible(snapshot.docs[docs.length - 1]);
        setPageHistory([snapshot.docs[0]]);
        setHasMore(snapshot.docs.length > itemsPerPage);
      } catch (err) {
        console.error('Load first page error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFirstPage();
    setCurrentPage(1);
  }, [doctorId, statusFilter, user?.doctorId, dateFilter]);

  const handleNext = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const targetId = doctorId || user?.doctorId;
      let q = query(
        collection(db, 'appointments'),
        where('status', '==', statusFilter)
      );

      if (targetId) q = query(q, where('doctorId', '==', targetId));
      if (dateFilter) q = query(q, where('appointmentDate', '==', dateFilter));

      q = query(
        q,
        orderBy('appointmentDate', 'desc'),
        orderBy('timeSlot', 'desc'),
        startAfter(lastVisible),
        limit(itemsPerPage + 1)
      );

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.slice(0, itemsPerPage).map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(docs);
      setPageHistory(prev => [...prev, snapshot.docs[0]]);
      setLastVisible(snapshot.docs[docs.length - 1]);
      setHasMore(snapshot.docs.length > itemsPerPage);
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      console.error('Next page error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = async () => {
    if (currentPage === 1 || loading) return;
    setLoading(true);
    try {
      const targetId = doctorId || user?.doctorId;
      let finalQuery;

      let baseQ = query(
        collection(db, 'appointments'),
        where('status', '==', statusFilter)
      );
      if (targetId) baseQ = query(baseQ, where('doctorId', '==', targetId));
      if (dateFilter) baseQ = query(baseQ, where('appointmentDate', '==', dateFilter));

      if (currentPage === 2) {
        finalQuery = query(
          baseQ,
          orderBy('appointmentDate', 'desc'),
          orderBy('timeSlot', 'desc'),
          limit(itemsPerPage + 1)
        );
      } else {
        finalQuery = query(
          baseQ,
          orderBy('appointmentDate', 'desc'),
          orderBy('timeSlot', 'desc'),
          startAfter(pageHistory[currentPage - 3]),
          limit(itemsPerPage + 1)
        );
      }

      const snapshot = await getDocs(finalQuery);
      const docs = snapshot.docs.slice(0, itemsPerPage).map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(docs);
      setLastVisible(snapshot.docs[docs.length - 1]);
      setPageHistory(prev => prev.slice(0, -1));
      setHasMore(true);
      setCurrentPage(prev => prev - 1);
    } catch (err) {
      console.error('Prev page error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this historical record?')) return;
    try {
      const res = await apiCall(`/api/admin/bookings?appointmentId=${id}`, {
        method: 'DELETE'
      });
      if (!res.success) alert(res.error);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      b.patientName?.toLowerCase().includes(s) ||
      b.patientPhone?.includes(s) ||
      b.patientEmail?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Stats Summary Placeholder */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Appointment History
          </h2>
          <p className="text-xs text-text-main/40 font-bold tracking-widest mt-1">Search through completed appointments</p>
        </div>

        {/* <div className="flex items-center gap-2">
           <div className="bg-hospital-bg px-4 py-2 rounded-xl border border-divider">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-main/30 block">Page</span>
              <span className="text-lg font-display font-bold text-primary leading-none">{currentPage}</span>
           </div>
        </div> */}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-divider flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-hospital-bg border border-divider rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-64">
          <div className="relative flex-1 group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/20 group-focus-within:text-primary transition-colors" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-hospital-bg border border-divider rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold"
            />
          </div>

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="p-2 border border-divider rounded-xl hover:bg-hospital-bg transition-colors"
            >
              <XCircle className="w-4 h-4 text-text-main/40 hover:text-primary" />
            </button>
          )}
        </div>
      </div>

      {/* Table-like List */}
      <div className="space-y-3">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-divider">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs font-bold text-text-main/30 uppercase tracking-widest">Loading history...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-divider">
            <Info className="w-12 h-12 text-text-main/10 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text-main/40">No records found</h3>
            <p className="text-sm text-text-main/30 mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredBookings.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-divider hover:border-primary/20 transition-all group lg:flex lg:items-center gap-6">
                <div className="flex items-center gap-4 lg:w-40 shrink-0">
                  <div className="w-10 h-10 bg-hospital-bg rounded-xl flex items-center justify-center text-text-main/30 border border-divider">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-main leading-tight">
                      {(item.appointmentDate || item.date) && /^\d/.test(item.appointmentDate || item.date)
                        ? format(parseISO(item.appointmentDate || item.date), 'dd MMM yyyy')
                        : 'No Date'}
                    </div>
                    <div className="text-[10px] font-bold text-text-main/30 uppercase tracking-widest font-display">{item.timeSlot || item.time || 'N/A'}</div>
                  </div>
                </div>

                <div className="h-px lg:h-8 w-full lg:w-px bg-divider my-2 lg:my-0"></div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-text-main text-base truncate capitalize">{item.patientName}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-text-main/50 font-medium">
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {item.patientPhone}</span>
                    {item.patientEmail && <span className="hidden sm:flex items-center gap-1.5"><Mail className="w-3 h-3" /> {item.patientEmail}</span>}
                  </div>
                </div>

                {user?.role === 'admin' && (
                  <div className="lg:w-40 text-left lg:text-right hidden sm:block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-main/20 block mb-0.5">Assigned Doctor</span>
                    <span className="text-xs font-bold text-primary truncate block">{item.doctorName || 'N/A'}</span>
                  </div>
                )}

                <div className="mt-3 lg:mt-0 lg:w-12 flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-text-main/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {(currentPage > 1 || hasMore) && (
          <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-2xl border border-divider shadow-sm">
            <div className="text-xs font-bold text-text-main/40 uppercase tracking-widest">
              Viewing results {((currentPage - 1) * itemsPerPage) + 1} - {((currentPage - 1) * itemsPerPage) + bookings.length}
            </div>

            <div className="flex items-center gap-4">
              <button
                disabled={currentPage === 1 || loading}
                onClick={handlePrev}
                className="flex items-center gap-2 px-4 py-2 border border-divider rounded-xl hover:bg-hospital-bg transition-all disabled:opacity-20 disabled:cursor-not-allowed text-text-main/60 font-bold text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                disabled={!hasMore || loading}
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 border border-divider rounded-xl hover:bg-hospital-bg transition-all disabled:opacity-20 disabled:cursor-not-allowed text-text-main/60 font-bold text-xs"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
