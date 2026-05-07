import React, { useState, useEffect } from 'react';
import { Users, UserCheck, BookOpen, BarChart3, User, Settings, Loader, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('inicio');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('nutriapp_token');
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      } else {
        setError('No se pudieron cargar las estadísticas');
      }
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size={40} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-muted)' }}>Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
          ❌ {error}
        </div>
      </div>
    );
  }

  const { summary, patientsByUser } = stats || {};

  return (
    <div className="page" style={{ paddingBottom: '120px' }}>
      {/* Header con Tabs */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="topbar-title" style={{ fontSize: '32px', marginBottom: '8px' }}>
            📊 Panel de Administración
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setView('inicio')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: view === 'inicio' ? '#cddc39' : 'rgba(205, 220, 57, 0.2)',
              color: view === 'inicio' ? '#000' : '#cddc39',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            <Home size={18} />
            Inicio
          </button>
          <button
            onClick={() => setView('config')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: view === 'config' ? '#cddc39' : 'rgba(205, 220, 57, 0.2)',
              color: view === 'config' ? '#000' : '#cddc39',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            <Settings size={18} />
            Configuración
          </button>
        </div>
      </div>

      {/* VISTA INICIO */}
      {view === 'inicio' && (
        <>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
              <div style={{ textAlign: 'center' }}>
                <Loader size={40} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                <div style={{ color: 'var(--text-muted)' }}>Cargando estadísticas...</div>
              </div>
            </div>
          ) : error ? (
            <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
              ❌ {error}
            </div>
          ) : (
            <>
              {/* Stats Grid - 4 Columnas */}
              <div className="grid-4 gap-4" style={{ marginBottom: '32px' }}>
                {/* Total Usuarios */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Total Usuarios
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                        {summary?.totalUsers || 0}
                      </div>
                    </div>
                    <Users size={32} opacity={0.3} />
                  </div>
                </div>

                {/* Estudiantes */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Estudiantes
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                        {summary?.totalEstudiantes || 0}
                      </div>
                    </div>
                    <UserCheck size={32} opacity={0.3} />
                  </div>
                </div>

                {/* Nutricionistas */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Nutricionistas
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                        {summary?.totalNutricionistas || 0}
                      </div>
                    </div>
                    <BarChart3 size={32} opacity={0.3} />
                  </div>
                </div>

                {/* Total Pacientes */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Pacientes
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                        {summary?.totalPatients || 0}
                      </div>
                    </div>
                    <User size={32} opacity={0.3} />
                  </div>
                </div>

                {/* Total Recetas */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Recetas Creadas
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                        {summary?.totalRecetas || 0}
                      </div>
                    </div>
                    <BookOpen size={32} opacity={0.3} />
                  </div>
                </div>
              </div>

              {/* Pacientes por Usuario */}
              <div className="card">
                <div className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} />
                  <span>Pacientes por Profesional</span>
                </div>

                {patientsByUser && patientsByUser.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {patientsByUser.map((userStat) => (
                      <div
                        key={userStat.userId}
                        style={{
                          padding: '16px',
                          background: 'var(--bg-app)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderLeft: `4px solid ${userStat.isAdmin ? '#cddc39' : '#4ade80'}`
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {userStat.userName}
                            {userStat.isAdmin && <span style={{ marginLeft: '8px', fontSize: '12px', background: '#cddc39', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>ADMIN</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {userStat.userRole === 'Nutricionista' ? '👨‍⚕️' : '👨‍🎓'} {userStat.userRole} • {userStat.email}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#cddc39' }}>
                            {userStat.patientsCount}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>pacientes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No hay usuarios con pacientes asignados
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* VISTA CONFIGURACIÓN */}
      {view === 'config' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} />
            <span>Configuración del Sistema</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              ⚙️ Configuración General
            </button>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              📄 Generar Reportes
            </button>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              🔄 Respaldar Datos
            </button>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              👥 Gestionar Usuarios
            </button>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              🔐 Seguridad
            </button>
          </div>
        </div>
      )}

      {/* Admin Info - Fixed en esquina inferior izquierda */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: 'rgba(15, 23, 42, 0.95)',
        borderRadius: '8px',
        borderLeft: '4px solid #cddc39',
        zIndex: 100,
        maxWidth: '300px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(205, 220, 57, 0.2)'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #cddc39 0%, #b3d90b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          fontWeight: 700,
          flexShrink: 0,
          fontSize: '18px'
        }}>
          {user?.fullName?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#cddc39', fontSize: '14px' }}>
            Administrador
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {user?.fullName}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {user?.email}
          </div>
        </div>
      </div>
    </div>
  );
}
