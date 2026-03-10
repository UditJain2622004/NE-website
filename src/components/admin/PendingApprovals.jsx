// Pending Appointments Review Page
import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  Loader2, Check, X, Clock, 
  User, Phone, Calendar,
  AlertCircle, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

export default function PendingApprovals({ doctorId }) {
  const { user, apiCall } = useAdminAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const targetId = doctorId || user?.doctorId;
      // Fetch all pending appointments (no date filter)
      const url = `/api/admin/bookings?status=pending${targetId ? `&doctorId=${targetId}` : ''}`;
      const res = await apiCall(url);
      setAppointments(res.bookings || []);
    } catch (err) {
      console.error('Fetch pending failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    const handleRefresh = () => fetchPending();
    window.addEventListener('refreshBookings', handleRefresh);
    return () => window.removeEventListener('refreshBookings', handleRefresh);
  }, [doctorId]);

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this appointment?`)) return;
    setProcessingId(id);
    try {
      const res = await apiCall('/api/admin/bookings', {
        method: 'PATCH',
        body: JSON.stringify({ appointmentId: id, action })
      });
      if (res.success) {
        fetchPending();
        // Notify other components to refresh (like the badge)
        window.dispatchEvent(new Event('refreshBookings'));
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl flex items-start gap-4">
        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-yellow-900">Pending Requests</h3>
          <p className="text-sm text-yellow-800/70 leading-relaxed">
            These appointments are awaiting your confirmation. Once confirmed, they will appear in your main Schedule.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-divider">
            <div className="w-16 h-16 bg-hospital-bg rounded-2xl flex items-center justify-center mx-auto mb-4 border border-divider">
              <Check className="w-8 h-8 text-green-500/30" />
            </div>
            <h3 className="text-lg font-bold text-text-main/40">All Caught Up!</h3>
            <p className="text-sm text-text-main/30 mt-1">There are no pending appointments to review.</p>
          </div>
        ) : (
          appointments.map((app) => (
            <div 
              key={app.id}
              className="bg-white p-6 rounded-2xl border border-divider hover:border-primary/20 hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="flex items-center gap-4 shrink-0 md:w-56">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-bold text-primary leading-tight">{format(new Date(app.appointmentDate + 'T00:00:00'), 'MMM d, yyyy')}</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-text-main/40 uppercase tracking-widest mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {app.timeSlot}
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-divider md:hidden"></div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-lg text-text-main capitalize">{app.patientName}</h4>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] uppercase font-black rounded-full border border-yellow-200">Pending</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-main/60 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    {app.patientPhone}
                  </div>
                  {user?.role === 'admin' && (
                    <div className="flex items-center gap-1.5 bg-primary/5 text-primary px-2 py-0.5 rounded-lg text-xs font-bold">
                      <User className="w-3.5 h-3.5" />
                      {app.doctorName}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  disabled={processingId === app.id}
                  onClick={() => handleAction(app.id, 'confirm')}
                  className="flex-1 md:flex-none h-12 px-6 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-95 disabled:opacity-50"
                >
                  {processingId === app.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Confirm</>}
                </button>
                <button
                  disabled={processingId === app.id}
                  onClick={() => handleAction(app.id, 'reject')}
                  className="h-12 px-4 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100 active:scale-95 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
