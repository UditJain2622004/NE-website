import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import {
  Loader2, ChevronLeft, ChevronRight, Calendar,
  CheckCircle2, Clock, Phone, Mail, User,
  Check, X, Package, IndianRupee, RefreshCw, Search
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { format, addDays } from 'date-fns';

export default function HealthCheckupsList() {
  const { user, apiCall } = useAdminAuth();
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'confirmed', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const [statusFilter, setStatusFilter] = useState('confirmed');
  const [dateFilter, setDateFilter] = useState('');

  const statusColors = {
    confirmed: 'bg-green-100 text-green-700 font-bold border border-green-200',
    completed: 'bg-blue-100 text-blue-700 font-bold border border-blue-200',
    cancelled: 'bg-red-100 text-red-600 font-bold border border-red-200',
  };

  const fetchCheckups = async () => {
    setIsRefreshing(true);
    try {
      let url = `/api/admin/healthCheckups?status=${statusFilter}`;
      if (dateFilter) {
        url += `&dateFrom=${dateFilter}&dateTo=${dateFilter}`;
      }
      const res = await apiCall(url);
      setCheckups(res.checkups || []);
    } catch (err) {
      console.error('Fetch health checkups failed:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    let q = query(
      collection(db, 'healthCheckups'),
      where('status', '==', statusFilter)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCheckups(docs);
      setLoading(false);
      setIsRefreshing(false);
    }, (err) => {
      console.error('Snapshot error:', err);
      setLoading(false);
      setIsRefreshing(false);
    });

    return () => unsubscribe();
  }, [statusFilter]);

  const filteredCheckups = checkups
    .filter(b => {
      // Date filter
      const matchesDate = !dateFilter || b.preferredDate === dateFilter;
      if (!matchesDate) return false;

      // Search filter
      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return b.patientName?.toLowerCase().includes(s) || b.patientPhone?.includes(s);
    })
    .sort((a, b) => (a.preferredDate || '').localeCompare(b.preferredDate || ''));

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this health checkup?`)) return;
    try {
      const res = await apiCall('/api/admin/healthCheckups', {
        method: 'PATCH',
        body: JSON.stringify({ checkupId: id, action }),
      });
      if (res.success) {
        fetchCheckups();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this health checkup record?')) return;
    try {
      const res = await apiCall(`/api/admin/healthCheckups?checkupId=${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        fetchCheckups();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const changeDate = (days) => {
    const base = dateFilter ? new Date(dateFilter) : new Date();
    const nextDate = addDays(base, days);
    setDateFilter(format(nextDate, 'yyyy-MM-dd'));
  };


  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-hospital-bg p-2 rounded-2xl flex items-center gap-3 px-4 border border-divider/50">
        <Search className="w-5 h-5 text-text-main/20" />
        <input
          type="text"
          placeholder="Search bookings by patient name or phone..."
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

          <div className="relative flex-1 lg:w-48">
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
        </div>



        <div className="flex flex-wrap items-center gap-3">


          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${statusFilter === tab.id
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'bg-white text-text-main/40 border-divider hover:border-text-main/20'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>


        </div>

        <div className="flex w-full lg:w-[260px] gap-2 lg:ml-auto">
          {/* Left section - takes 85% */}
          <button
            onClick={() => setDateFilter('')}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${!dateFilter
              ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20'
              : 'bg-white text-text-main/40 border-divider hover:border-text-main/20'
              }`}
          >
            {dateFilter ? 'See All Dates' : 'Showing All Dates'}
          </button>

          {/* Right section - takes 15% */}
          <button
            onClick={fetchCheckups}
            className="w-10 flex items-center justify-center p-2 border border-divider rounded-xl hover:bg-hospital-bg transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Checkups List */}
      <div className="space-y-3">
        {loading ? (
          <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-divider">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredCheckups.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-divider">
            <div className="w-16 h-16 bg-hospital-bg rounded-2xl flex items-center justify-center mx-auto mb-4 border border-divider">
              <Package className="w-8 h-8 text-text-main/20" />
            </div>
            <h3 className="text-lg font-bold text-text-main/40">No Health Checkups Found</h3>
            <p className="text-sm text-text-main/30 mt-1 max-w-xs mx-auto">
              {dateFilter
                ? 'There are no health checkup bookings matching your criteria for this date.'
                : 'There are no health checkup bookings matching your criteria.'}
            </p>
          </div>
        ) : (
          filteredCheckups.map((checkup) => (
            <div
              key={checkup.id}
              className="bg-white p-4 lg:p-5 rounded-2xl border border-divider hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group lg:flex lg:items-center gap-6"
            >
              {/* Package badge */}
              <div className="flex items-center gap-4 lg:w-56 shrink-0">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary border border-secondary/10">
                  <Package className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-primary leading-tight truncate">{checkup.packageName}</div>
                  {checkup.packagePrice && (
                    <div className="flex items-center gap-0.5 text-[11px] text-text-main/40 font-bold mt-0.5">
                      <IndianRupee className="w-3 h-3" />
                      {Number(checkup.packagePrice).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px w-full bg-divider my-4 lg:hidden" />

              {/* Patient info */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-lg text-text-main truncate capitalize">{checkup.patientName}</h4>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black shrink-0 ${statusColors[checkup.status]}`}>
                    {checkup.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-main/60">
                  <a href={`tel:${checkup.patientPhone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="font-medium">{checkup.patientPhone}</span>
                  </a>
                  {checkup.patientEmail && (
                    <div className="hidden sm:flex items-center gap-1.5 overflow-hidden">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[150px]">{checkup.patientEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-text-main/40">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{checkup.preferredDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0 lg:shrink-0 lg:w-64 lg:justify-end">
                {checkup.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleAction(checkup.id, 'complete')}
                      className="flex-1 lg:flex-none p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 px-4 shadow-lg shadow-primary/20"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold">Complete</span>
                    </button>
                    <button
                      onClick={() => handleAction(checkup.id, 'cancel')}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                      title="Cancel Checkup"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}
                {['cancelled', 'completed'].includes(checkup.status) && (
                  <button
                    onClick={() => handleDelete(checkup.id)}
                    className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                    title="Delete Record"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
