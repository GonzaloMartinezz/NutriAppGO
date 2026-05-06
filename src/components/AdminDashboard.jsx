import React, { useMemo } from 'react';
import { Users, Activity, TrendingUp, BarChart3, User, Calendar, FileText } from 'lucide-react';

export function AdminDashboard({ patients, recipes }) {
  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const activePatients = patients.filter(p => p.status === 'ACTIVE').length;
    const withMeasurements = patients.filter(p => p.anthropometry.length > 0).length;
    const totalRecipes = recipes.length;

    return {
      totalPatients,
      activePatients,
      withMeasurements,
      totalRecipes
    };
  }, [patients, recipes]);

  const recentPatients = patients.slice(0, 5);

  return (
    <div className="page">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="topbar-title" style={{ fontSize: '32px', marginBottom: '8px' }}>
          📊 Panel de Administración
        </h1>
        <p className="text-muted">Bienvenido, Administrador. Aquí puedes ver un resumen general de la plataforma.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4 gap-4" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Pacientes Totales
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                {stats.totalPatients}
              </div>
            </div>
            <Users size={32} opacity={0.3} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Pacientes Activos
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                {stats.activePatients}
              </div>
            </div>
            <Activity size={32} opacity={0.3} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Con Mediciones
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                {stats.withMeasurements}
              </div>
            </div>
            <TrendingUp size={32} opacity={0.3} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Recetas
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                {stats.totalRecipes}
              </div>
            </div>
            <BarChart3 size={32} opacity={0.3} />
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="grid-2 gap-4">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} />
            <span>Pacientes Recientes</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentPatients.length > 0 ? (
              recentPatients.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '12px',
                    background: 'var(--bg-app)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--green-500), var(--teal-500))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    {p.firstName[0]}{p.lastName[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.firstName} {p.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Registrado: {p.createdAt}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                No hay pacientes registrados
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} />
            <span>Acciones Rápidas</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '12px 16px'
              }}
            >
              👥 Ver todos los pacientes
            </button>
            <button
              className="btn btn-outline"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '12px 16px'
              }}
            >
              📊 Generar reportes
            </button>
            <button
              className="btn btn-outline"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '12px 16px'
              }}
            >
              📚 Gestionar recetas
            </button>
            <button
              className="btn btn-outline"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '12px 16px'
              }}
            >
              ⚙️ Configuración
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card" style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05))', border: '1px solid var(--green-200)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '24px' }}>📌</div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
              Bienvenido al Panel de Administración
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Como administrador, tienes acceso completo a todos los datos y funcionalidades de la plataforma NutriApp. Puedes gestionar pacientes, ver reportes, y administrar el sistema. Utiliza el menú lateral para navegar a las diferentes secciones.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
