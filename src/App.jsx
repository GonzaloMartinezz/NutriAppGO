import React, { useState, useEffect, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { Calculator } from './components/Calculator';
import { Patients } from './components/Patients';
import { Plans } from './components/Plans';
import { Recipes } from './components/Recipes';
import { Library } from './components/Library';
import { Settings } from './components/Settings';
import { ConfirmModal } from './components/ConfirmModal';

// Initial Data Imports
import { SAMPLE_PATIENTS } from './data/patients';
import { SAMPLE_RECIPES } from './data/recipes';

const NavItem = ({ icon, label, active, onClick, collapsed }) => (
  <div 
    className={`nav-item ${active ? 'active' : ''}`} 
    onClick={onClick} 
    title={collapsed ? label : ''}
  >
    <span className="nav-icon">{icon}</span>
    {!collapsed && <span>{label}</span>}
  </div>
);

export default function App() {
  // --- PERSISTENT STATE ---
  const [page, setPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('nutri_theme');
    return saved === 'dark';
  });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '' });
  
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('nutri_patients');
    return saved ? JSON.parse(saved) : SAMPLE_PATIENTS;
  });

  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('nutri_recipes');
    return saved ? JSON.parse(saved) : SAMPLE_RECIPES;
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('nutri_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Valeria Rodríguez',
      role: 'Nutricionista',
      mn: '12345',
      avatar: 'VR',
      email: 'valeria@nutriapp.com'
    };
  });

  const [searchQuery, setSearchQuery] = useState('');

  // --- SYNC TO LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('nutri_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('nutri_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('nutri_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('nutri_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  // --- GLOBAL SEARCH LOGIC ---
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return {
      patients: patients.filter(p => p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q)),
      recipes: recipes.filter(r => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
    };
  }, [searchQuery, patients, recipes]);

  const titles = {
    dashboard: 'Inicio',
    calculator: 'Calculadora SARA 2',
    patients: 'Gestión de Pacientes',
    plans: 'Planes Nutricionales',
    recipes: 'Recetario Profesional',
    library: 'Biblioteca Personal',
    settings: 'Configuración'
  };

  const triggerConfirm = (title, message) => {
    setConfirmModal({ isOpen: true, title, message });
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': 
        return <Dashboard patients={patients} setPage={setPage} userProfile={userProfile} />;
      case 'calculator': 
        return <Calculator />;
      case 'patients': 
        return <Patients patients={patients} setPatients={setPatients} triggerConfirm={triggerConfirm} />;
      case 'plans': 
        return <Plans patients={patients} />;
      case 'recipes': 
        return <Recipes recipes={recipes} setRecipes={setRecipes} triggerConfirm={triggerConfirm} />;
      case 'library': 
        return <Library />;
      case 'settings': 
        return <Settings userProfile={userProfile} setUserProfile={setUserProfile} triggerConfirm={triggerConfirm} />;
      default: 
        return <Dashboard patients={patients} setPage={setPage} userProfile={userProfile} />;
    }
  };

  return (
    <div id="root">
      {/* GLOBAL SEARCH OVERLAY */}
      {searchQuery && (
        <div className="modal-overlay" style={{ zIndex: 2000, alignItems: 'flex-start', paddingTop: '80px' }} onClick={() => setSearchQuery('')}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Resultados de búsqueda: "{searchQuery}"</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSearchQuery('')}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <div className="grid-2 gap-4">
                <div>
                  <div className="card-title">Pacientes ({searchResults.patients.length})</div>
                  {searchResults.patients.map(p => (
                    <div key={p.id} className="patient-row" onClick={() => { setPage('patients'); setSearchQuery(''); }}>
                      <div className="patient-avatar">{p.firstName[0]}{p.lastName[0]}</div>
                      <div>
                        <div className="patient-name">{p.firstName} {p.lastName}</div>
                        <div className="text-sm text-muted">{p.dni}</div>
                      </div>
                    </div>
                  ))}
                  {searchResults.patients.length === 0 && <div className="empty-state">No se encontraron pacientes</div>}
                </div>
                <div>
                  <div className="card-title">Recetas ({searchResults.recipes.length})</div>
                  {searchResults.recipes.map(r => (
                    <div key={r.id} className="patient-row" onClick={() => { setPage('recipes'); setSearchQuery(''); }}>
                      <div className="patient-avatar" style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}>🍳</div>
                      <div>
                        <div className="patient-name">{r.name}</div>
                        <div className="text-sm text-muted">{r.category}</div>
                      </div>
                    </div>
                  ))}
                  {searchResults.recipes.length === 0 && <div className="empty-state">No se encontraron recetas</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <span style={{ transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'block' }}>➔</span>
        </button>

        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">🥗</div>
            <div>
              <div className="logo-text">NutriApp</div>
              <div className="logo-sub">Plataforma Profesional</div>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">Principal</div>
            <NavItem icon="🏠" label="Inicio" active={page === 'dashboard'} onClick={() => setPage('dashboard')} collapsed={!isSidebarOpen} />
            <NavItem icon="📊" label="Calculadora SARA" active={page === 'calculator'} onClick={() => setPage('calculator')} collapsed={!isSidebarOpen} />
            <NavItem icon="🍴" label="Planes Nutricionales" active={page === 'plans'} onClick={() => setPage('plans')} collapsed={!isSidebarOpen} />
            <NavItem icon="📖" label="Recetario" active={page === 'recipes'} onClick={() => setPage('recipes')} collapsed={!isSidebarOpen} />
          </div>

          <div className="nav-section">
            <div className="nav-label">Estudio & Carrera</div>
            <NavItem icon="📚" label="Biblioteca" active={page === 'library'} onClick={() => setPage('library')} collapsed={!isSidebarOpen} />
            <NavItem icon="⚙️" label="Configuración" active={page === 'settings'} onClick={() => setPage('settings')} collapsed={!isSidebarOpen} />
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-card">
            <div className="user-avatar">{userProfile.avatar}</div>
            <div>
              <div className="user-name">Lic. {userProfile.name}</div>
              <div className="user-role">Nutricionista · MN {userProfile.mn}</div>
            </div>
          </div>
        </div>
      </nav>

      <main className="main">
        <header className="topbar">
          <div className="topbar-title">{titles[page] || 'NutriApp'}</div>
          <div className="topbar-actions">
            <div className="input-icon" style={{ width: '280px' }}>
              <span className="icon">🔍</span>
              <input 
                type="text" 
                className="input" 
                placeholder="Buscar pacientes, recetas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              style={{ fontSize: '18px' }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => alert('Próximamente: Notificaciones')}>🔔</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage('settings')}>⚙️ Perfil</button>
          </div>
        </header>

        <div className="page">
          {renderPage()}
        </div>

        <ConfirmModal 
          isOpen={confirmModal.isOpen} 
          title={confirmModal.title} 
          message={confirmModal.message} 
          onConfirm={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
        />
      </main>
    </div>
  );
}
