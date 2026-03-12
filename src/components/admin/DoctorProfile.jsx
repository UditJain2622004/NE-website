import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  User, Clock, Save, Loader2, AlertCircle, 
  CheckCircle2, Plus, Trash2, Briefcase, 
  Activity, Calendar, Play, StopCircle,
  Coffee, Lock, Unlock, Info
} from 'lucide-react';

export default function DoctorProfile({ doctorId }) {
  const { user, apiCall } = useAdminAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  const days = [
    { id: '1', label: 'Monday' },
    { id: '2', label: 'Tuesday' },
    { id: '3', label: 'Wednesday' },
    { id: '4', label: 'Thursday' },
    { id: '5', label: 'Friday' },
    { id: '6', label: 'Saturday' },
    { id: '0', label: 'Sunday' },
  ];

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const targetId = doctorId || user?.doctorId;
      const res = await apiCall(`/api/admin/account?doctorId=${targetId}`);
      if (res.success) {
        setProfile(res.profile);
      }
    } catch (err) {
      console.error('Fetch profile failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [doctorId]);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const targetId = doctorId || user?.doctorId;
      const res = await apiCall(`/api/admin/account?doctorId=${targetId}`, {
        method: 'PATCH',
        body: JSON.stringify(profile)
      });
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
        setIsEditingSchedule(false);
      } else {
        setMessage({ type: 'error', text: res.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const updateSchedule = (dayId, field, value) => {
    const newSchedule = { ...(profile.weeklySchedule || {}) };
    if (!newSchedule[dayId]) {
      newSchedule[dayId] = { startTime: '09:00', endTime: '17:00', slotDuration: 10 };
    }
    newSchedule[dayId] = { ...newSchedule[dayId], [field]: value };
    setProfile({ ...profile, weeklySchedule: newSchedule });
  };

  const toggleDay = (dayId) => {
    const newSchedule = { ...(profile.weeklySchedule || {}) };
    if (newSchedule[dayId]) {
      delete newSchedule[dayId];
    } else {
      newSchedule[dayId] = { startTime: '09:00', endTime: '17:00', slotDuration: 10 };
    }
    setProfile({ ...profile, weeklySchedule: newSchedule });
  };

  const addBreak = () => {
    const newBreaks = [...(profile.breakTimes || []), { start: '13:00', end: '14:00' }];
    setProfile({ ...profile, breakTimes: newBreaks });
  };

  const updateBreak = (index, field, value) => {
    const newBreaks = [...(profile.breakTimes || [])];
    newBreaks[index] = { ...newBreaks[index], [field]: value };
    setProfile({ ...profile, breakTimes: newBreaks });
  };

  const removeBreak = (index) => {
    const newBreaks = profile.breakTimes.filter((_, i) => i !== index);
    setProfile({ ...profile, breakTimes: newBreaks });
  };

  const formatTime12h = (time24) => {
    if (!time24) return 'N/A';
    const [h, m] = time24.split(':');
    const hours = parseInt(h);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${m} ${suffix}`;
  };

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-sm font-bold text-text-main/40 uppercase tracking-widest">Fetching profile...</p>
    </div>
  );

  if (!profile) return (
    <div className="p-12 text-center bg-white rounded-3xl border border-divider max-w-md mx-auto mt-20">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
      <h3 className="text-xl font-bold text-text-main">Doctor Not Found</h3>
      <p className="text-text-main/60 mt-2">The requested doctor profile could not be loaded.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32 relative">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-primary">Doctor Profile</h1>
        <p className="text-text-main/60 font-medium">Manage professional identity and clinic availability.</p>
      </header>

      {/* Main Identity Section - Full Width */}
      <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-divider shadow-sm space-y-8">
        <div className="flex items-center gap-4 pb-6 border-b border-divider/50">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">General Information</h2>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-text-main/40 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-main/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full pl-14 pr-6 py-4 bg-hospital-bg border border-divider rounded-[1.25rem] text-lg font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm truncate"
                placeholder="e.g. Dr. Jane Smith"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-main/40 ml-1">Working Title / Specialization</label>
              <div className="relative group">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-main/20 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={profile.specialization}
                  onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                  className="w-full pl-14 pr-6 py-4 bg-hospital-bg border border-divider rounded-[1.25rem] font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm truncate"
                  placeholder="e.g. Consultant Paediatrician"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-main/40 ml-1">Primary Department</label>
              <div className="relative group">
                <Activity className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-main/20 group-focus-within:text-primary transition-colors" />
                <select 
                  value={profile.department}
                  onChange={(e) => setProfile({...profile, department: e.target.value})}
                  className="w-full pl-14 pr-10 py-4 bg-hospital-bg border border-divider rounded-[1.25rem] font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none text-sm truncate"
                >
                  <option value="medicine">General Medicine</option>
                  <option value="pediatrics">Paediatrics</option>
                  <option value="radiology">Radiology</option>
                  <option value="ent">ENT</option>
                  <option value="nutrition">Nutrition</option>
                </select>
              </div>
            </div>
          </div>

          {/* <div className="pt-4">
             <button 
                type="button"
                onClick={() => setProfile({...profile, isActive: !profile.isActive})}
                className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all group ${
                  profile.isActive ? 'bg-green-50/50 border-green-200/50 text-green-700' : 'bg-gray-50 border-divider text-gray-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profile.isActive ? 'bg-green-100' : 'bg-divider/50'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm">{profile.isActive ? 'Active on Website' : 'Hidden from Patients'}</span>
                    <span className="block text-[10px] font-black uppercase tracking-tighter opacity-50">Patient Visibility Status</span>
                  </div>
                </div>
                <div className={`w-12 h-7 rounded-full relative transition-colors ${profile.isActive ? 'bg-green-500' : 'bg-divider'}`}>
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${profile.isActive ? 'translate-x-5' : ''}`} />
                </div>
              </button>
          </div> */}
        </div>
      </section>

      {/* Schedule Summary Section */}
      <section className="bg-white p-4 md:p-8 lg:p-10 rounded-[2.5rem] border border-divider shadow-sm space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-divider/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Clinical Schedule</h2>

            </div>
          </div>
          {!isEditingSchedule && (
            <button 
              onClick={() => setIsEditingSchedule(true)}
              className="text-primary font-bold text-sm px-5 py-2.5 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Edit Schedule
            </button>
          )}
        </div>

        {!isEditingSchedule ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {days.map((day) => {
                const config = profile.weeklySchedule?.[day.id];
                return (
                  <div key={day.id} className="flex items-center justify-between py-2 border-b border-divider/40">
                    <span className="font-bold text-text-main/80">{day.label}</span>
                    <span className={`text-sm font-bold ${config ? 'text-primary' : 'text-text-main/30 italic uppercase text-[10px]'}`}>
                      {config ? `${formatTime12h(config.startTime)} — ${formatTime12h(config.endTime)}` : 'Closed'}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {(profile.breakTimes && profile.breakTimes.length > 0) && (
              <div className="mt-8 pt-6 border-t border-divider/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main/30 mb-4 ml-1">Scheduled Breaks</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.breakTimes.map((br, i) => (
                    <div key={i} className="px-4 py-2 bg-hospital-bg border border-divider rounded-xl text-xs font-bold text-text-main/60 flex items-center gap-2">
                       <Coffee className="w-3.5 h-3.5" />
                       {formatTime12h(br.start)} - {formatTime12h(br.end)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            

          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Detailed Day Picker */}
            <div className="space-y-4">
              {days.map((day) => {
                const config = profile.weeklySchedule?.[day.id];
                const isEnabled = !!config;

                return (
                  <div key={day.id} className={`p-3 md:p-6 rounded-3xl border-2 transition-all bg-white border-primary/20 shadow-xl shadow-primary/5`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="w-44 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => toggleDay(day.id)}
                          className={`w-12 h-7 rounded-full relative transition-colors ${isEnabled ? 'bg-primary' : 'bg-divider'}`}
                        >
                          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${isEnabled ? 'translate-x-5' : ''}`} />
                        </button>
                        <span className="font-bold text-lg">{day.label}</span>
                      </div>

                      {isEnabled && (
                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-text-main/30 ml-2">Open</label>
                            <input type="time" value={config.startTime} onChange={(e) => updateSchedule(day.id, 'startTime', e.target.value)} className="w-full bg-hospital-bg border border-divider rounded-xl px-2 py-2 text-sm font-bold outline-none focus:border-primary" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-text-main/30 ml-2">Close</label>
                            <input type="time" value={config.endTime} onChange={(e) => updateSchedule(day.id, 'endTime', e.target.value)} className="w-full bg-hospital-bg border border-divider rounded-xl px-2 py-2 text-sm font-bold outline-none focus:border-primary" />
                          </div>
                          <div className="space-y-1 col-span-2 lg:col-span-1">
                            <label className="text-[10px] font-black uppercase text-text-main/30 ml-2">Duration per Slot</label>
                            <div className="flex items-center gap-3">
                              <input type="number" value={config.slotDuration} onChange={(e) => updateSchedule(day.id, 'slotDuration', parseInt(e.target.value))} className="w-full bg-hospital-bg border border-divider rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary" />
                              <span className="text-[10px] font-black uppercase text-text-main/20">Min</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Break Times Config */}
            <div className="pt-8 border-t border-divider/50 space-y-6">
               <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-primary" />
                  Universal Breaks
                </h3>
                <button 
                  type="button" 
                  onClick={addBreak}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Break
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.breakTimes?.map((br, i) => (
                  <div key={i} className="flex items-center gap-4 bg-hospital-bg border border-divider p-4 rounded-2xl group relative">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-text-main/30 ml-1">Start</label>
                        <input type="time" value={br.start} onChange={(e) => updateBreak(i, 'start', e.target.value)} className="w-full bg-white border border-divider rounded-xl px-2 py-2 text-xs font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-text-main/30 ml-1">End</label>
                        <input type="time" value={br.end} onChange={(e) => updateBreak(i, 'end', e.target.value)} className="w-full bg-white border border-divider rounded-xl px-2 py-2 text-xs font-bold" />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeBreak(i)} 
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsEditingSchedule(false)}
              className="w-full py-4 text-primary font-bold bg-primary/5 rounded-2xl border-2 border-primary/10 hover:bg-primary/10 transition-all"
            >
              Finish Editing Schedule
            </button>
          </div>
        )}
      </section>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-8 left-1/2 lg:left-3/5 -translate-x-1/2 z-50 w-full max-w-5xl px-4 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-2xl border border-divider p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-between gap-6 pointer-events-auto ring-1 ring-black/5">
          <div className="hidden sm:block pl-6">
            {message ? (
              <div className={`flex items-center gap-2 text-sm font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'} animate-in fade-in slide-in-from-left-4 duration-500`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-text-main/40">
                <Loader2 className={`w-4 h-4 ${saving ? 'animate-spin' : 'opacity-0'}`} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {saving ? 'Saving changes...' : 'Ready to save'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
             {isEditingSchedule && (
                <button 
                  onClick={() => setIsEditingSchedule(false)}
                  className="flex-1 sm:flex-none py-3.5 px-6 rounded-2xl text-sm font-bold text-text-main/60 hover:bg-hospital-bg transition-all"
                >
                  Discard Changes
                </button>
             )}
             <button
              onClick={handleUpdate}
              disabled={saving}
              className="flex-1 sm:flex-none bg-primary text-white py-3.5 px-6 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> <span>Save Changes</span></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

