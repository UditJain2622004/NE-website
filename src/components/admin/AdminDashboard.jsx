// Admin and Doctor Dashboard Container
// Main layout for staff-only areas.

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import BookingsList from './BookingsList';
import ManageLeaves from './ManageLeaves';
import CreateBookingModal from './CreateBookingModal';
import { 
  LogOut, Calendar, Plus, 
  LayoutDashboard, User, 
  Users, Activity,
  ClipboardList,
  Menu, X
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, leaves, doctors
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on tab change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  const stats = [
    { label: 'Active Role', value: user?.role?.toUpperCase(), icon: User, color: 'text-primary bg-primary/10' },
    { label: 'Total Appointments', value: '...', icon: ClipboardList, color: 'text-secondary bg-secondary/10' },
  ];

  const NavItem = ({ id, label, icon: Icon, adminOnly = false }) => {
    if (adminOnly && user?.role !== 'admin') return null;
    
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          activeTab === id 
            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
            : 'text-text-main/60 hover:text-primary hover:bg-primary/5'
        }`}
      >
        <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : 'text-current'}`} />
        <span>{label}</span>
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
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-text-main/60 rounded-lg hover:bg-divider">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-text-main/30 mb-2 mt-8 ml-4">
            Navigation
          </div>
          
          <NavItem id="bookings" label="Bookings Feed" icon={ClipboardList} />
          <NavItem id="leaves" label="Manage Blocks" icon={Calendar} adminOnly />
          <NavItem id="doctors" label="Doctors List" icon={Users} adminOnly />
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
        <div className="hidden lg:flex items-center justify-between px-8 py-6 sticky top-0 z-10 bg-hospital-bg/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-display font-bold capitalize">
              {activeTab.replace('_', ' ')}
            </h1>
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
          {activeTab === 'bookings' && <BookingsList />}
          {activeTab === 'leaves' && <ManageLeaves />}
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
          onSuccess={() => {
            setShowCreateModal(false);
            // We'll use a global event or refresh to update the list
            window.dispatchEvent(new Event('refreshBookings'));
          }} 
        />
      )}
    </div>
  );
}
