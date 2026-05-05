import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Calculator } from './components/Calculator';
import { Patients } from './components/Patients';
import { Plans } from './components/Plans';
import { Recipes } from './components/Recipes';
import { Library } from './components/Library';
import { Settings } from './components/Settings';
import { SAMPLE_PATIENTS } from './data/patients';

const NAV = [
  { id: 'dashboard', icon: '🏠', label: 'Inicio', section: 'principal' },
  { id: 'calculator', icon: '⚡', label: 'Calculadora SARA 2', section: 'principal' },
  { id: 'patients', icon: '👥', label: 'Pacientes', section: 'principal' },
  { id: 'plans', icon: '📋', label: 'Planes nutricionales', section: 'principal' },
  { id: 'recipes', icon: '🍽️', label: 'Recetario', section: 'principal' },
  { id: 'library', icon: '📚', label: 'Biblioteca', section: 'estudio' },
  { id: 'settings', icon: '⚙️', label: 'Configuración', section: 'estudio' },
];

const SECTIONS = { principal: 'Principal', estudio: 'Estudio & Carrera' };

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [patients, setPatients] = useState(SAMPLE_PATIENTS);
  const [theme, setTheme] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: 'Valeria Rodríguez',
    role: 'Nutricionista',
    mn: '12345',
    avatar: 'VR',
    email: 'valeria@nutriapp.com'
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const titles = {
    dashboard: 'Inicio',
    calculator: 'Calculadora SARA 2',
    patients: 'Gestión de Pacientes',
    plans: 'Planes Nutricionales',
    recipes: 'Recetario Profesional',
    library: 'Biblioteca Personal',
    settings: 'Configuración de Perfil'
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard patients={patients} setPage={setPage} userProfile={userProfile} />;
      case 'calculator': return <Calculator />;
      case 'patients': return <Patients patients={patients} setPatients={setPatients} />;
      case 'plans': return <Plans patients={patients} />;
      case 'recipes': return <Recipes />;
      case 'library': return <Library />;
      case 'settings': return <Settings userProfile={userProfile} setUserProfile={setUserProfile} />;
      default: return <Dashboard patients={patients} setPage={setPage} userProfile={userProfile} />;
    }
  };

  const navBySec = {};
  NAV.forEach((n) => {
    if (!navBySec[n.section]) navBySec[n.section] = [];
    navBySec[n.section].push(n);
  });

  return (
    <div className="app-container" style={{ display: 'flex', width: '100%' }}>
      <main className="main" style={{ order: 1 }}>
        <header className="topbar">
          <div className="topbar-actions" style={{ gap: '16px' }}>
            <button className="btn-icon btn-ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? '→' : '☰'}
            </button>
            <div className="topbar-title">{titles[page] || 'NutriApp'}</div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-outline btn-sm" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
              <div className="user-avatar" style={{ width: '32px', height: '32px' }}>
                {userProfile.avatar}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{userProfile.name}</span>
            </div>
          </div>
        </header>
        <div className="page">{renderPage()}</div>
      </main>

      <nav className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`} style={{ order: 2 }}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">🥗</div>
            <div>
              <div className="logo-text">NutriApp</div>
              {!isSidebarOpen ? null : <div className="logo-sub" style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Plataforma profesional</div>}
            </div>
          </div>
        </div>
        <div className="sidebar-nav">
          {Object.entries(navBySec).map(([sec, items]) => (
            <div key={sec} className="nav-section">
              <div className="nav-label">{SECTIONS[sec] || sec}</div>
              {items.map((n) => (
                <div
                  key={n.id}
                  className={`nav-item${page === n.id ? ' active' : ''}`}
                  onClick={() => setPage(n.id)}
                  title={n.label}
                >
                  <span className="nav-icon">{n.icon}</span>
                  <span>{n.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="sidebar-user">
          <div className="user-card">
            <div className="user-avatar">{userProfile.avatar}</div>
            <div>
              <div className="user-name" style={{ color: 'var(--text-main)', fontSize: '13px', fontWeight: 600 }}>{userProfile.name}</div>
              <div className="user-role" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>MN {userProfile.mn}</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
