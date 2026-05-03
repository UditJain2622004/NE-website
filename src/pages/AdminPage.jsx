// Main Admin Page container
// Redirects to login or dashboard based on auth status.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../hooks/useAdminAuth';
import AdminDashboard from '../components/admin/AdminDashboard';
import { Mail, Lock, Loader2, Hospital, ArrowLeft, Eye, EyeOff } from 'lucide-react';

function AdminContent() {
  const { user, loading, login, error } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSigningIn(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hospital-bg">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (user) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-4">
      <Link 
        to="/" 
        className="mb-6 flex items-center gap-2 text-text-main/60 hover:text-primary transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Website
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-divider overflow-hidden">
        <div className="bg-primary p-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Hospital className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Staff Access</h1>
          <p className="text-white/80 text-sm">Secure login for Nexus Enliven Medical Staff</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-main/30 group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-hospital-bg border border-divider rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-main/30"
                  placeholder="name@nexusenliven.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-main/60 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-main/30 group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 bg-hospital-bg border border-divider rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-main/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-main/30 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={signingIn}
            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            {signingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue to Dashboard
              </>
            )}
          </button>

          <p className="text-center text-xs text-text-main/40 px-4">
            Authorized personnel only. All access attempts are logged and monitored.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthProvider>
      <AdminContent />
    </AdminAuthProvider>
  );
}
