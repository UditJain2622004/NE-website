// Admin Auth Hook — handles session via Firebase and /api/admin/me
// Stores state in local storage/context to persistent logins.

import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken(true);
          const res = await fetch('/api/admin/me', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) {
            console.error('API Error:', res.status, res.statusText);
            setUser(null);
          } else {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const data = await res.json();
              if (data.success) {
                setUser({ ...fbUser, ...data.user, token });
              } else {
                console.error('Failed to get /me:', data.error);
                setUser(null);
              }
            } else {
              const text = await res.text();
              console.error('Expected JSON, got:', text.substring(0, 50));
              setUser(null);
            }
          }
        } catch (err) {
          console.error('Auth error:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message.includes('auth/invalid-credential') ? 'Invalid email or password' : err.message);
      throw err;
    }
  };

  const logout = () => signOut(auth);

  const apiCall = async (url, options = {}) => {
    if (!user?.token) throw new Error('Not authenticated');
    
    // Ensure token is fresh
    const freshToken = await auth.currentUser.getIdToken();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${freshToken}`,
      ...(options.headers || {})
    };

    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!data.success && res.status === 401) {
      logout(); // Token expired or invalid
    }
    return data;
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, error, login, logout, apiCall }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
