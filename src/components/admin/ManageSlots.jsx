// Slot Management for Doctors and Admins
// Allows blocking/unblocking individual time slots

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  Loader2, Calendar, Clock, 
  Lock, Unlock, AlertCircle,
  ChevronLeft, ChevronRight,
  RefreshCw, Info
} from 'lucide-react';
import { format, addDays, subDays, parseISO, isBefore, startOfToday } from 'date-fns';

export default function ManageSlots({ doctorId }) {
  const { user, apiCall } = useAdminAuth();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null); // time of the slot being toggled
  const [error, setError] = useState(null);
  const [isOnLeave, setIsOnLeave] = useState(false);
  const [leaveId, setLeaveId] = useState(null);
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isPast = isBefore(parseISO(selectedDate), startOfToday());
  const isTodayOrPast = isPast || selectedDate === todayStr;

  const fetchSlots = async () => {
    const targetId = doctorId || user?.doctorId;
    if (!targetId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await apiCall(`/api/admin/slots?date=${selectedDate}&doctorId=${targetId}`);
      if (res.success) {
        setSlots(res.slots || []);
        setIsOnLeave(res.isOnLeave || false);
        setLeaveId(res.leaveId || null);
      } else {
        setError(res.error || 'Failed to fetch slots');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, doctorId]);


  const handleBlockFullDay = async () => {
    const targetId = doctorId || user?.doctorId;
    if (!targetId) return;

    if (!confirm(`Are you sure you want to block all slots on ${selectedDate}? This will prevent all bookings for this day.`)) return;
    setLoading(true);
    try {
      const res = await apiCall('/api/admin/leaves', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: targetId,
          startDate: selectedDate,
          endDate: selectedDate,
          reason: 'Full day blocked from schedule manager'
        })
      });
      if (res.success) {
        await fetchSlots();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Block failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockFullDay = async () => {
    if (!leaveId) return;
    if (!confirm(`Are you sure you want to unblock ${selectedDate}? Ordinary availability will be restored.`)) return;

    setLoading(true);
    try {
      const res = await apiCall(`/api/admin/leaves?id=${leaveId}`, {
        method: 'DELETE'
      });
      if (res.success) {
        await fetchSlots();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Unblock failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (slot) => {
    const targetId = doctorId || user?.doctorId;
    if (!targetId) return;

    const action = slot.isBlocked ? 'unblock' : 'block';
    
    if (!confirm(`Are you sure you want to ${action} the ${slot.time} slot on ${selectedDate}?`)) return;

    setToggling(slot.time);
    try {
      const res = await apiCall('/api/admin/slots', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: targetId,
          date: selectedDate,
          time: slot.time,
          action
        })
      });
      if (res.success) {
        await fetchSlots();
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setToggling(null);
    }
  };

  const changeDate = (days) => {
    // Robust date shifting: Use local midnight to avoid UTC/ISO shifts
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + days);
    setSelectedDate(format(current, 'yyyy-MM-dd'));
  };


  return (
    <div className="space-y-6">
      {/* Header & Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-divider shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-bold text-primary">Manage Availability</h2>
            <p className="text-xs font-bold text-text-main/40 uppercase tracking-widest leading-none">
              {doctorId === user?.doctorId ? 'Your Personal Schedule' : 'Doctor Slot Management'}
            </p>
          </div>
        </div>



        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-hospital-bg p-1 rounded-xl border border-divider">
            <button 
              onClick={() => !isTodayOrPast && changeDate(-1)}
              disabled={isTodayOrPast}
              className={`p-2 rounded-lg transition-all text-text-main/60 ${isTodayOrPast ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:shadow-sm'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="px-4 py-2 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-primary" />
              <input 
                type="date"
                min={format(new Date(), 'yyyy-MM-dd')}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-bold text-sm outline-none"
              />
            </div>

            <button 
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-text-main/60"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {isOnLeave ? (
            <button
              onClick={handleUnblockFullDay}
              disabled={isPast || loading}
              className="px-4 py-3 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Unlock className="w-4 h-4" />
              Unblock Entire Day
            </button>
          ) : (
            slots.length > 0 && slots.some(s => !s.isBlocked && !s.booked) && (
              <button
                onClick={handleBlockFullDay}
                disabled={isPast || loading}
                className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                Block Entire Day
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-divider overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs font-bold text-text-main/30 uppercase tracking-widest">Loading slots...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-text-main/60 font-medium">{error}</p>
            <button onClick={fetchSlots} className="btn-primary py-2 px-6 rounded-xl inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : slots.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <Info className="w-12 h-12 text-text-main/10 mx-auto" />
            <div className="space-y-1">
              <p className="text-lg font-bold text-text-main/60">No slots available for this day.</p>
              <p className="text-sm text-text-main/40">You might not have a schedule set for this day of the week.</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6 flex items-center gap-4 text-xs font-bold text-text-main/40 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Available</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Blocked</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Booked</span>
            </div>
            <p className="text-xs font-bold text-text-main/40 tracking-widest mb-5">{ isOnLeave ? "The entire day is blocked. Unblock the day to manage individual slots." : "Click on a slot to block/unblock it."}</p>

            {isPast && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Past Date Locked</p>
                  <p className="opacity-80">Slots for past dates cannot be modified. Displaying historical status only.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {slots.map((slot) => {
                const isBookedByPatient = slot.booked && !slot.isBlocked;
                const isProcessing = toggling === slot.time;
                
                return (
                  <button
                    key={slot.time}
                    disabled={isBookedByPatient || isProcessing || isPast || isOnLeave}
                    onClick={() => !isOnLeave && handleToggleBlock(slot)}
                    className={`
                      relative group p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                      ${isPast ? 'opacity-70 cursor-not-allowed' : ''}
                      ${slot.isBlocked 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : isBookedByPatient 
                          ? 'bg-primary/5 border-primary/20 text-primary cursor-not-allowed'
                          : 'bg-white border-divider hover:border-primary hover:shadow-lg hover:shadow-primary/5'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${slot.isBlocked ? 'text-red-500' : isBookedByPatient ? 'text-primary' : 'text-text-main/30'}`} />
                      <span className="font-display font-bold text-lg">{slot.time}</span>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
                      ) : slot.isLeave ? (
                        <><Calendar className="w-3 h-3" /> <span className="text-[10px] font-bold uppercase whitespace-nowrap">Blocked</span></>
                      ) : slot.isBlocked ? (
                        <><Lock className="w-3 h-3" /> <span className="text-[10px] font-bold uppercase">Blocked</span></>
                      ) : isBookedByPatient ? (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold uppercase text-primary">Booked</span>
                          </div>
                          {slot.patientName && (
                            <span className="text-[9px] font-medium text-text-main/60 truncate max-w-[80px] mt-0.5">
                              {slot.patientName}
                            </span>
                          )}
                        </div>
                      ) : (
                        <><Unlock className="w-3 h-3 opacity-30" /> <span className="text-[10px] font-bold uppercase opacity-30">Open</span></>
                      )}
                    </div>


                    {!isBookedByPatient && !isProcessing && !isOnLeave && (
                      <div className="absolute inset-0 bg-primary/90 text-white rounded-[14px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-xs font-bold uppercase tracking-widest">{slot.isBlocked ? 'Unblock' : 'Block'}</span>
                         <span className="text-[10px] opacity-70">Single Slot</span>
                      </div>
                    )}

                    {/* {isOnLeave && (
                       <div className="absolute inset-0 bg-red-500/10 rounded-[14px] flex items-center justify-center">
                          <div className="bg-red-500 text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                            This entire day is blocked. Unblock the day to manage individual slots.
                          </div>
                       </div>
                    )} */}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-blue-900">How slot management works</h4>
          <p className="text-sm text-blue-800/70 leading-relaxed">
            Blocking a slot prevents patients from seeing or booking that specific time on the website. 
            Slots already booked by patients cannot be blocked. To unblock a whole day, use the <strong>Manage Blocks</strong> section instead.
          </p>
        </div>
      </div>
    </div>
  );
}
