import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nutri_users');
    if (saved) return JSON.parse(saved);

    // Precargar admin user
    const adminUser = {
      id: 'admin-001',
      email: 'admin@nutriapp.com',
      password: 'adminmartinez',
      fullName: 'Administrador NutriApp',
      role: 'Nutricionista',
      matricula: 'NUT-ADMIN',
      especializacion: 'Administración',
      isAdmin: true,
      avatar: 'AN',
      createdAt: new Date().toISOString()
    };
    return [adminUser];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('nutri_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('nutri_users', JSON.stringify(users));
  }, [users]);

  const register = (email, password, fullName, role, matricula = '', especializacion = '') => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'El email ya está registrado' };
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      fullName,
      role,
      matricula: matricula || '',
      especializacion: especializacion || '',
      isAdmin: role === 'Nutricionista' && matricula.startsWith('NUT'),
      avatar: fullName.split(' ').map(n => n[0]).join(''),
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    setUser(newUser);
    localStorage.setItem('nutri_current_user', JSON.stringify(newUser));

    return { success: true };
  };

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }

    setUser(foundUser);
    localStorage.setItem('nutri_current_user', JSON.stringify(foundUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nutri_current_user');
  };

  const updateUserProfile = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('nutri_current_user', JSON.stringify(updatedUser));

    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
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
