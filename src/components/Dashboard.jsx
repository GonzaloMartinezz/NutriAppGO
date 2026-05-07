import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ACTIVITY_LABELS } from '../utils/math';
import { 
  Users, 
  ClipboardList, 
  ChefHat, 
  GraduationCap, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react';

export function Dashboard({ patients, userProfile }) {
  const navigate = useNavigate();
  const active = patients.filter((p) => p.status === 'ACTIVE').length;
  
  const recentPlan = [
    { name: 'Plan Julio — María G.', date: '01/05', kcal: 1820 },
    { name: 'Plan Junio — Carlos P.', date: '28/04', kcal: 2850 },
    { name: 'Plan Mayo — Roberto S.', date: '15/04', kcal: 1650 },
  ];

  return (
    <div>
      <div className="section-header mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="section-title" style={{ color: 'var(--text-main)', fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>¡Hola, {userProfile.name.split(' ')[0]}! 👋</div>
          <div className="text-muted text-sm" style={{ marginTop: 3 }}>
            {userProfile.role} {userProfile.name} · MN {userProfile.mn} ·{' '}
            {new Date().toLocaleDateString('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/calculator')} style={{ height: 'fit-content' }}>
          <Zap size={18} fill="currentColor" />
          <span>Calculadora SARA 2</span>
        </button>
      </div>

      <div className="hero-card mb-6">
        <img src="/hero-bg.png" className="hero-img" alt="Nutrition" />
        <div className="hero-content">
          <div className="hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            Impulsando la Salud con Datos
          </div>
          <div className="hero-text">
            Gestioná tus pacientes, calculá valores exactos con SARA 2 y diseñá planes personalizados de alto impacto nutricional.
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', borderLeft: '4px solid var(--green-600)' }}>
          <div className="stat-icon" style={{ fontSize: '32px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>🏥</div>
          <div className="stat-label">Pacientes activos</div>
          <div className="stat-value">{active}</div>
          <div className="stat-sub" style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
            <TrendingUp size={12} color="var(--green-600)" />
            <span>+1 este mes</span>
          </div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)', borderLeft: '4px solid var(--blue-600)' }}>
          <div className="stat-icon" style={{ fontSize: '32px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>📋</div>
          <div className="stat-label">Planes activos</div>
          <div className="stat-value">6</div>
          <div className="stat-sub" style={{ textAlign: 'center' }}>2 por vencer</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)', borderLeft: '4px solid var(--amber-600)' }}>
          <div className="stat-icon" style={{ fontSize: '32px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>🍳</div>
          <div className="stat-label">Recetas guardadas</div>
          <div className="stat-value">4</div>
          <div className="stat-sub" style={{ textAlign: 'center' }}>todas activas</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(205, 220, 57, 0.1) 0%, rgba(205, 220, 57, 0.05) 100%)', borderLeft: '4px solid #cddc39' }}>
          <div className="stat-icon" style={{ fontSize: '32px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>🎓</div>
          <div className="stat-label">Certificaciones</div>
          <div className="stat-value">8</div>
          <div className="stat-sub" style={{ textAlign: 'center' }}>1 por vencer</div>
        </div>
      </div>

      <div className="grid-2 gap-4">
        <div className="card">
          <div className="card-title">
            <Users size={16} />
            <span>Pacientes recientes</span>
          </div>
          {patients.slice(0, 4).map((p) => {
            const last = p.anthropometry[p.anthropometry.length - 1];
            return (
              <div key={p.id} className="patient-row" onClick={() => navigate('/patients')}>
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
          <Link
            to="/patients"
            className="btn btn-outline"
            style={{ width: '100%', marginTop: 16, textDecoration: 'none' }}
          >
            <span>Ver todos los pacientes</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="card">
          <div className="card-title">
            <ClipboardList size={16} />
            <span>Planes recientes</span>
          </div>
          {recentPlan.map((pl, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom:
                  (i < recentPlan.length - 1) ? '1px solid var(--border-light)' : 'none',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-main)' }}>{pl.name}</div>
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
              background: 'var(--slate-50)',
              borderRadius: 12,
              padding: 16,
              marginTop: 4,
              border: '1px solid var(--border)',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)'
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: 'var(--accent)',
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Zap size={14} fill="currentColor" />
              <span>Acceso rápido</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              Analizar alimentos con la tabla SARA 2
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/calculator')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Abrir calculadora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
