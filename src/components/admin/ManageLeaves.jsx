// Block Days/Slots management for admins
// Interacts with /api/admin/leaves and /api/admin/doctors

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  Loader2, Plus, Calendar, 
  Trash2, User, AlertCircle,
  X, Check, Info
} from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';

export default function ManageLeaves() {
  const { apiCall } = useAdminAuth();
  const [leaves, setLeaves] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reason, setReason] = useState('Personal Emergency');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [{ leaves: lData }, { doctors: dData }] = await Promise.all([
        apiCall('/api/admin/leaves'),
        apiCall('/api/admin/doctors')
      ]);
      setLeaves(lData || []);
      setDoctors(dData || []);
      if (dData?.[0]) setSelectedDoctor(dData[0].id);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddLeave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiCall('/api/admin/leaves', {
        method: 'POST',
        body: JSON.stringify({ doctorId: selectedDoctor, startDate, endDate, reason })
      });
      if (res.success) {
        setShowAddModal(false);
        fetchData();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to unblock these date(s)?')) return;
    try {
      const res = await apiCall(`/api/admin/leaves?id=${id}`, { method: 'DELETE' });
      if (res.success) fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-divider">
        <div className="space-y-1">
          <h2 className="text-xl font-display font-bold text-primary">Service Blocks</h2>
          <p className="text-xs font-bold text-text-main/40 uppercase tracking-widest leading-none">Manage doctor availability</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-3 px-6 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Blockage</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaves.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 bg-white/50 border-2 border-dashed border-divider p-12 rounded-3xl text-center">
            <Info className="w-10 h-10 text-text-main/20 mx-auto mb-4" />
            <p className="text-sm font-bold text-text-main/40">No active blockages currently found.</p>
          </div>
        ) : (
          leaves.map((leave) => {
            const doctor = doctors.find(d => d.id === leave.doctorId);
            const isOngoing = !isAfter(new Date(), parseISO(leave.endDate));
            
            return (
              <div key={leave.id} className="bg-white rounded-2xl border border-divider overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className={`h-1.5 w-full ${isOngoing ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm text-text-main truncate">{doctor?.name || leave.doctorId}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-main/30 truncate leading-tight mt-0.5">{doctor?.specialization}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(leave.id)}
                      className="p-1.5 text-text-main/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-hospital-bg p-3 rounded-xl border border-divider/50 space-y-2 relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-text-main/30">From</span>
                        <span className="text-sm font-bold text-text-main">{format(parseISO(leave.startDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="h-4 w-px bg-divider"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-text-main/30">To</span>
                        <span className="text-sm font-bold text-text-main">{format(parseISO(leave.endDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-text-main/50 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-100">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate italic">"{leave.reason}"</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 lg:p-10 animate-slide-up sm:animate-fade-in relative max-h-[90vh] overflow-y-auto border-t border-white/20">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-6 top-6 p-2 rounded-xl hover:bg-hospital-bg text-text-main/40 transition-all border border-divider/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-primary">Block Booking</h3>
                <p className="text-xs font-bold text-text-main/30 uppercase tracking-widest leading-none">Prevent new request creation</p>
              </div>
            </div>

            <form onSubmit={handleAddLeave} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Select Doctor</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30" />
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    required
                    className="block w-full pl-10 pr-10 py-3 bg-hospital-bg border border-divider rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none font-bold text-sm h-12"
                  >
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1 text-center block">Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-hospital-bg border border-divider rounded-xl font-bold text-sm h-12 outline-none text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1 text-center block">End Date</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-hospital-bg border border-divider rounded-xl font-bold text-sm h-12 outline-none text-center"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Reason for block</label>
                <input 
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Personal Emergency, Out of town, etc."
                  required
                  className="w-full px-4 py-3 bg-hospital-bg border border-divider rounded-xl font-medium text-sm h-12 outline-none placeholder:text-text-main/20"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 mt-4 text-sm font-bold shadow-xl shadow-primary/20 h-14"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" />Confirm Blockage</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
