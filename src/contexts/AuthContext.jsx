import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nutriapp_token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const { user: userData } = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('nutriapp_token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('nutriapp_token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName, role, matricula = '', especializacion = '') => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          role,
          matricula: role === 'Nutricionista' ? matricula : undefined,
          especializacion: role === 'Nutricionista' ? especializacion : undefined,
          avatar: fullName.split(' ').map(n => n[0]).join('')
        })
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Error en registro' };
      }

      const { user: userData, token } = await response.json();
      setUser(userData);
      localStorage.setItem('nutriapp_token', token);

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Error en la conexión' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'Error en login' };
      }

      const { user: userData, token } = await response.json();
      setUser(userData);
      localStorage.setItem('nutriapp_token', token);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error en la conexión' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nutriapp_token');
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('nutriapp_token');
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const { user: userData } = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
