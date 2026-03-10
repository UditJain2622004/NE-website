import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import BookingsList from './BookingsList';
import CreateBookingModal from './CreateBookingModal';
import ManageSlots from './ManageSlots';
import PendingApprovals from './PendingApprovals';
import DoctorProfile from './DoctorProfile';
import { 
  LogOut, Plus, 
  User, Users, Activity,
  ClipboardList,
  Menu, X, Globe, Clock,
  LayoutDashboard, Bell,
  UserCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, apiCall } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, approvals, slots, doctors, profile
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(user?.doctorId || '');
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    try {
      const targetId = user?.role === 'admin' ? selectedDoctorId : user?.doctorId;
      const res = await apiCall(`/api/admin/bookings?status=pending${targetId ? `&doctorId=${targetId}` : ''}`);
      if (res.success) {
        setPendingCount(res.bookings?.length || 0);
      }
    } catch (err) {
      console.error('Count fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchPendingCount();
    window.addEventListener('refreshBookings', fetchPendingCount);
    return () => window.removeEventListener('refreshBookings', fetchPendingCount);
  }, [user, selectedDoctorId]);

  useEffect(() => {
    if (user?.role === 'admin') {
      apiCall('/api/admin/doctors').then(res => {
        if (res.success) {
          setDoctors(res.doctors || []);
          if (res.doctors?.[0] && !selectedDoctorId) {
            setSelectedDoctorId(res.doctors[0].id);
          }
        }
      });
    }
  }, [user]);

  // Close sidebar on tab change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  const effectiveDoctorId = user?.role === 'doctor' ? user.doctorId : selectedDoctorId;

  const NavItem = ({ id, label, icon: Icon, adminOnly = false, badge = 0 }) => {
    if (adminOnly && user?.role !== 'admin') return null;
    
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          activeTab === id 
            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
            : 'text-text-main/60 hover:text-primary hover:bg-primary/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : 'text-current'}`} />
          <span>{label}</span>
        </div>
        {badge > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === id ? 'bg-white text-primary' : 'bg-primary text-white'
          }`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-hospital-bg lg:flex">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-divider sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-primary" />
          <span className="font-display font-bold text-lg">Staff Panel</span>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button 
              onClick={() => setActiveTab('approvals')}
              className="p-2 bg-primary/10 text-primary rounded-xl relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                {pendingCount}
              </span>
            </button>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-text-main/60 rounded-lg hover:bg-divider">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-0 z-40 lg:static transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out bg-white border-r border-divider w-72 h-full flex flex-col pt-20 lg:pt-0`}>
        <div className="hidden lg:flex items-center gap-3 p-8">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-primary tracking-tight leading-none">Nexus Enliven</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-main/40 mt-1">Medical Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="mb-4 px-4 py-3 bg-hospital-bg rounded-xl border border-divider/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm text-text-main truncate leading-tight capitalize">{user?.name}</span>
                <span className="text-[11px] text-text-main/50 font-medium px-2 py-0.5 bg-white/50 rounded-full w-fit mt-1 border border-divider/40">
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-text-main/30 mb-2 mt-8 ml-4">
            Navigation
          </div>
          
          <NavItem id="bookings" label="Appointments" icon={ClipboardList} />
          <NavItem id="approvals" label="Pending Approvals" icon={Bell} badge={pendingCount} />
          <NavItem id="slots" label="Manage Slots" icon={Clock} />
          <NavItem id="profile" label="Doctor Profile" icon={UserCircle} />
          <NavItem id="doctors" label="Doctors List" icon={Users} adminOnly />

          <div className="pt-4 mt-4 border-t border-divider/50">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-text-main/60 hover:text-primary hover:bg-primary/5 transition-all duration-200"
            >
              <Globe className="w-5 h-5 text-current" />
              <span>View Website</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-divider bg-hospital-bg/50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        {/* Top Floating Bar (Desktop only) */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 sticky top-0 z-10 bg-hospital-bg/80 backdrop-blur-md border-b border-divider/20">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-display font-bold capitalize">
              {activeTab.replace('_', ' ')}
            </h1>
            
            {user?.role === 'admin' && (
              <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-divider shadow-sm">
                <div className="pl-3 flex items-center gap-2 text-text-main/40">
                  <User className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Managing:</span>
                </div>
                <select 
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="bg-hospital-bg border-none outline-none text-sm font-bold pr-8 py-1.5 rounded-lg appearance-none cursor-pointer hover:bg-divider/30 transition-colors pl-2"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary py-2.5 rounded-xl text-sm px-6 bg-gradient-to-r from-primary to-primary/90 shadow-xl shadow-primary/10 border border-white/10"
              >
                <Plus className="w-5 h-5" />
                <span>New Booking</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8 pt-6">
          {activeTab === 'bookings' && <BookingsList doctorId={effectiveDoctorId} />}
          {activeTab === 'approvals' && <PendingApprovals doctorId={effectiveDoctorId} />}
          {activeTab === 'slots' && <ManageSlots doctorId={effectiveDoctorId} />}
          {activeTab === 'profile' && <DoctorProfile doctorId={effectiveDoctorId} />}
          {activeTab === 'doctors' && (
            <div className="bg-white rounded-2xl p-8 border border-divider text-center text-text-main/40">
              Doctors management coming soon.
            </div>
          )}
        </div>


        {/* Floating Create Button for Mobile */}
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 animate-bounce active:scale-90 transition-transform"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}
      </main>

      {/* Modal Overlay */}
      {showCreateModal && (
        <CreateBookingModal 
          onClose={() => setShowCreateModal(false)} 
          initialDoctorId={effectiveDoctorId}
          onSuccess={() => {
            setShowCreateModal(false);
            window.dispatchEvent(new Event('refreshBookings'));
          }} 
        />
      )}
    </div>
  );
}


