import React, { useState, useEffect, useMemo } from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import {
  Home,
  Calculator as CalcIcon,
  Users,
  Utensils,
  BookOpen,
  Settings as SettingsIcon,
  Bell,
  Search,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  X,
  Library as LibraryIcon,
  ChefHat,
  FolderOpen,
  LogOut
} from 'lucide-react';

import { useAuth } from './contexts/AuthContext';
import { Auth } from './pages/Auth';
import { AdminDashboard } from './components/AdminDashboard';
import { Dashboard } from './components/Dashboard';
import { Calculator } from './components/Calculator';
import { Patients } from './components/Patients';
import { Plans } from './components/Plans';
import { Recipes } from './components/Recipes';
import { Library } from './components/Library';
import { Settings } from './components/Settings';
import { Desarrollos } from './components/Desarrollos';
import { ConfirmModal } from './components/ConfirmModal';
import './styles/patients-responsive.css';

// Initial Data Imports
import { SAMPLE_PATIENTS } from './data/patients';
import { SAMPLE_RECIPES } from './data/recipes';

const NavItem = ({ icon: Icon, label, path, active, onClick, collapsed }) => (
  <Link 
    to={path}
    className={`nav-item ${active ? 'active' : ''}`} 
    onClick={onClick} 
    title={collapsed ? label : ''}
  >
    <span className="nav-icon"><Icon size={20} strokeWidth={active ? 2.5 : 2} /></span>
    {!collapsed && <span>{label}</span>}
  </Link>
);

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('nutri_theme');
    return saved === 'dark';
  });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '' });

  // Data state
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('nutri_patients');
    return saved ? JSON.parse(saved) : SAMPLE_PATIENTS;
  });

  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('nutri_recipes');
    return saved ? JSON.parse(saved) : SAMPLE_RECIPES;
  });

  const [developments, setDevelopments] = useState(() => {
    const saved = localStorage.getItem('nutri_developments');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');

  // User profile from authenticated user
  const userProfile = {
    name: user.fullName,
    role: user.role,
    mn: user.matricula,
    avatar: user.avatar,
    email: user.email,
    isAdmin: user.isAdmin
  };

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('nutri_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('nutri_recipes', JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { localStorage.setItem('nutri_developments', JSON.stringify(developments)); }, [developments]);

  useEffect(() => {
    localStorage.setItem('nutri_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }, [isDarkMode]);

  // Global search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return {
      patients: patients.filter(p => p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q)),
      recipes: recipes.filter(r => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
    };
  }, [searchQuery, patients, recipes]);

  const triggerConfirm = (title, message) => {
    setConfirmModal({ isOpen: true, title, message });
  };

  const currentPath = location.pathname;

  const titles = {
    '/': 'Inicio',
    '/calculator': 'Calculadora SARA 2',
    '/patients': 'Gestión de Pacientes',
    '/plans': 'Planes Nutricionales',
    '/recipes': 'Recetario Profesional',
    '/library': 'Biblioteca Personal',
    '/settings': 'Configuración',
    '/developments': 'Mis Desarrollos'
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="app-layout">
      {/* GLOBAL SEARCH OVERLAY */}
      {searchQuery && (
        <div className="modal-overlay" style={{ zIndex: 2000, alignItems: 'flex-start', paddingTop: '80px' }} onClick={() => setSearchQuery('')}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Resultados de búsqueda: "{searchQuery}"</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSearchQuery('')}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <div className="grid-2 gap-4">
                <div>
                  <div className="card-title">Pacientes ({searchResults.patients.length})</div>
                  {searchResults.patients.map(p => (
                    <div key={p.id} className="patient-row" onClick={() => { navigate('/patients'); setSearchQuery(''); handleNavClick(); }}>
                      <div className="patient-avatar">{p.firstName[0]}{p.lastName[0]}</div>
                      <div>
                        <div className="patient-name">{p.firstName} {p.lastName}</div>
                        <div className="text-sm text-muted">{p.dni}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="card-title">Recetas ({searchResults.recipes.length})</div>
                  {searchResults.recipes.map(r => (
                    <div key={r.id} className="patient-row" onClick={() => { navigate('/recipes'); setSearchQuery(''); handleNavClick(); }}>
                      <div className="patient-avatar" style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}><ChefHat size={18} /></div>
                      <div>
                        <div className="patient-name">{r.name}</div>
                        <div className="text-sm text-muted">{r.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR OVERLAY FOR MOBILE */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)} />

      <nav className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''} ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon"><Utensils size={24} /></div>
            <div>
              <div className="logo-text">NutriApp</div>
              <div className="logo-sub">Plataforma Profesional</div>
            </div>
          </div>
          <button className="sidebar-toggle-btn hide-mobile" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">Principal</div>
            <NavItem icon={Home} label="Inicio" path="/" active={currentPath === '/'} onClick={handleNavClick} collapsed={!isSidebarOpen} />
            <NavItem icon={CalcIcon} label="Calculadora SARA" path="/calculator" active={currentPath === '/calculator'} onClick={handleNavClick} collapsed={!isSidebarOpen} />
            <NavItem icon={FolderOpen} label="Mis Desarrollos" path="/developments" active={currentPath === '/developments'} onClick={handleNavClick} collapsed={!isSidebarOpen} />
            <NavItem icon={Utensils} label="Planes Nutricionales" path="/plans" active={currentPath === '/plans'} onClick={handleNavClick} collapsed={!isSidebarOpen} />
            <NavItem icon={Users} label="Pacientes" path="/patients" active={currentPath === '/patients'} onClick={handleNavClick} collapsed={!isSidebarOpen} />
            <NavItem icon={BookOpen} label="Recetario" path="/recipes" active={currentPath === '/recipes'} onClick={handleNavClick} collapsed={!isSidebarOpen} />
          </div>

          <div className="nav-section">
            <div className="nav-label">Estudio & Carrera</div>
            <NavItem icon={LibraryIcon} label="Biblioteca" path="/library" active={currentPath === '/library'} onClick={handleNavClick} collapsed={!isSidebarOpen} />
            <NavItem icon={SettingsIcon} label="Configuración" path="/settings" active={currentPath === '/settings'} onClick={handleNavClick} collapsed={!isSidebarOpen} />
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-card" onClick={() => { navigate('/settings'); handleNavClick(); }} style={{ cursor: 'pointer' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <div className="hamburger-icon">
                <span /> <span /> <span />
              </div>
            </button>
            <div className="topbar-title">{titles[currentPath] || 'NutriApp'}</div>
          </div>
          <div className="topbar-actions">
            <div className="input-icon hide-mobile" style={{ width: '280px' }}>
              <span className="icon"><Search size={18} /></span>
              <input 
                type="text" 
                className="input" 
                placeholder="Buscar pacientes, recetas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="user-menu-container">
              <button 
                className="user-avatar-btn" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{ 
                  background: 'var(--green-600)', color: '#fff', width: '36px', height: '36px', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '13px', border: '2px solid var(--green-100)', cursor: 'pointer'
                }}
              >
                {userProfile.avatar}
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown-premium">
                  <button className="dropdown-item" onClick={() => { setIsDarkMode(!isDarkMode); setIsUserMenuOpen(false); }}>
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    <span>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
                  </button>
                  <button className="dropdown-item" onClick={() => { navigate('/settings'); setIsUserMenuOpen(false); handleNavClick(); }}>
                    <SettingsIcon size={18} />
                    <span>Configuración</span>
                  </button>
                  <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
                  <button className="dropdown-item" onClick={() => { logout(); setIsUserMenuOpen(false); }}>
                    <LogOut size={18} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page">
          <Routes>
            <Route path="/" element={user.isAdmin ? <AdminDashboard patients={patients} recipes={recipes} /> : <Dashboard patients={patients} userProfile={userProfile} />} />
            <Route path="/calculator" element={<Calculator onSave={(dev) => setDevelopments(prev => [dev, ...prev])} triggerConfirm={triggerConfirm} />} />
            <Route path="/patients" element={<Patients patients={patients} setPatients={setPatients} triggerConfirm={triggerConfirm} />} />
            <Route path="/plans" element={<Plans patients={patients} />} />
            <Route path="/recipes" element={<Recipes recipes={recipes} setRecipes={setRecipes} triggerConfirm={triggerConfirm} />} />
            <Route path="/library" element={<Library />} />
            <Route path="/developments" element={<Desarrollos developments={developments} setDevelopments={setDevelopments} triggerConfirm={triggerConfirm} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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

export default function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--green-600) 0%, var(--green-700) 100%)'
      }}>
        <div style={{ color: '#fff', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '16px' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <AppContent />;
}
