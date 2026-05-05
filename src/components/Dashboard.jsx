import React from 'react';
import { ACTIVITY_LABELS } from '../utils/math';

export function Dashboard({ patients, setPage, userProfile }) {
  const active = patients.filter((p) => p.status === 'ACTIVE').length;
  const recentPlan = [
    { name: 'Plan Julio — María G.', date: '01/05', kcal: 1820 },
    { name: 'Plan Junio — Carlos P.', date: '28/04', kcal: 2850 },
    { name: 'Plan Mayo — Roberto S.', date: '15/04', kcal: 1650 },
  ];
  return (
    <div>
      <div className="section-header mb-6">
        <div>
          <div className="section-title" style={{ color: 'var(--text-main)' }}>¡Hola, {userProfile.name.split(' ')[0]}! 👋</div>
          <div className="text-muted text-sm" style={{ marginTop: 3 }}>
            {userProfile.role} {userProfile.name} · MN {userProfile.mn} ·{' '}
            {new Date().toLocaleDateString('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setPage('calculator')}>
          ⚡ Calculadora SARA 2
        </button>
      </div>

      <div className="hero-card mb-6">
        <img src="/hero-bg.png" className="hero-img" alt="Nutrition" />
        <div className="hero-content">
          <div className="hero-title">
            Impulsando la Salud con Datos
          </div>
          <div className="hero-text">
            Gestioná tus pacientes, calculá valores exactos con SARA 2 y diseñá planes personalizados de alto impacto nutricional.
          </div>
        </div>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Pacientes activos</div>
          <div className="stat-value">{active}</div>
          <div className="stat-sub">+1 este mes</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-label">Planes activos</div>
          <div className="stat-value">6</div>
          <div className="stat-sub">2 por vencer</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-label">Recetas guardadas</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">todas activas</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-label">Certificaciones</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">1 por vencer</div>
        </div>
      </div>
      <div className="grid-2 gap-4">
        <div className="card">
          <div className="card-title">
            <span className="icon">👥</span>Pacientes recientes
          </div>
          {patients.slice(0, 4).map((p) => {
            const last = p.anthropometry[p.anthropometry.length - 1];
            return (
              <div key={p.id} className="patient-row" onClick={() => setPage('patients')}>
                <div className="patient-avatar">
                  {p.firstName[0]}
                  {p.lastName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="patient-name">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="patient-meta">
                    {last ? `${last.weight}kg · IMC ${last.imc}` : ''} ·{' '}
                    {ACTIVITY_LABELS[p.physicalActivity] || ''}
                  </div>
                </div>
                <span className="badge badge-green">
                  {p.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            );
          })}
          <button
            className="btn btn-outline"
            style={{ width: '100%', marginTop: 10 }}
            onClick={() => setPage('patients')}
          >
            Ver todos los pacientes →
          </button>
        </div>
        <div className="card">
          <div className="card-title">
            <span className="icon">📋</span>Planes recientes
          </div>
          {recentPlan.map((pl, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom:
                  (i < recentPlan.length - 1) ? '1px solid var(--border-light)' : 'none',
              }}
            >
              <div>
                <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-main)' }}>{pl.name}</div>
                <div className="text-sm text-muted">
                  {pl.date} · {pl.kcal} kcal objetivo
                </div>
              </div>
              <span className="badge badge-green">Activo</span>
            </div>
          ))}
          <div className="divider" />
          <div className="quick-access-card"
            style={{
              background: 'var(--border-light)',
              borderRadius: 10,
              padding: 16,
              marginTop: 4,
              border: '1px solid var(--border)'
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                color: 'var(--accent)',
                marginBottom: 4,
              }}
            >
              ⚡ Acceso rápido
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
              Analizar alimentos con la tabla SARA 2
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setPage('calculator')}
            >
              Abrir calculadora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
