import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Search,
  Calendar,
  User,
  Zap,
  ChevronRight,
  Trash2,
  FileText,
  Download,
  ArrowLeft,
  Clock,
  PieChart,
  Dna,
  Wheat,
  Droplets
} from 'lucide-react';
import { Toast } from './Toast';

export function Desarrollos({ developments, setDevelopments, triggerConfirm }) {
  const [q, setQ] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null); // Format: "Name-LastName"
  const [selectedCalc, setSelectedCalc] = useState(null);
  const [toast, setToast] = useState(null);

  // Group developments by patient
  const groupedDevelopments = useMemo(() => {
    const groups = {};
    developments.forEach(dev => {
      const id = `${dev.patientName}-${dev.patientLastName}`.toLowerCase();
      if (!groups[id]) {
        groups[id] = {
          id,
          patientName: dev.patientName,
          patientLastName: dev.patientLastName,
          calculations: []
        };
      }
      groups[id].calculations.push(dev.calculation);
    });
    // Sort calculations by date descending
    Object.values(groups).forEach(g => {
      g.calculations.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    return Object.values(groups);
  }, [developments]);

  const filtered = groupedDevelopments.filter(p =>
    `${p.patientName} ${p.patientLastName}`.toLowerCase().includes(q.toLowerCase())
  );

  const handleDeleteCalculation = (patientId, calcId, e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar este cálculo específico?')) {
      setDevelopments(prev => prev.filter(d => d.calculation.id !== calcId));
      if (selectedCalc && selectedCalc.id === calcId) setSelectedCalc(null);
      setToast('Cálculo eliminado');
    }
  };

  const handleDeletePatient = (patientId, e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar TODOS los desarrollos de este paciente?')) {
      const [name, last] = patientId.split('-');
      setDevelopments(prev => prev.filter(d => 
        !(d.patientName.toLowerCase() === name && d.patientLastName.toLowerCase() === last)
      ));
      if (selectedPatientId === patientId) setSelectedPatientId(null);
      setToast('Desarrollo del paciente eliminado');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const patient = selectedPatientId ? groupedDevelopments.find(g => g.id === selectedPatientId) : null;

  if (selectedCalc) {
    const calc = selectedCalc;
    return (
      <div className="page animate-fade-in">
        <button className="btn btn-outline btn-sm mb-6" onClick={() => setSelectedCalc(null)}>
          <ArrowLeft size={16} />
          <span>Volver al perfil</span>
        </button>

        <div className="card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '8px' }}>Cálculo Detallado: {calc.mealType}</span>
              <h1 className="topbar-title" style={{ fontSize: '32px' }}>{patient.patientName} {patient.patientLastName}</h1>
              <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <Clock size={14} />
                <span>Registrado el {formatDate(calc.date)}</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Download size={18} />
              <span>Exportar PDF</span>
            </button>
          </div>

          <div className="grid-2 gap-8" style={{ marginBottom: '40px' }}>
            <div className="card" style={{ background: 'var(--green-600)', border: 'none', color: '#fff' }}>
              <div className="stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>VCT de esta Comida</div>
              <div style={{ fontSize: '42px', fontWeight: 800 }}>{calc.vct.toFixed(0)} <span style={{ fontSize: '18px' }}>kcal</span></div>
            </div>
            <div className="card" style={{ background: 'var(--slate-50)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[{l:'Prot', p:calc.macros.pctP, c:'var(--amber-500)'}, {l:'Carb', p:calc.macros.pctC, c:'var(--green-600)'}, {l:'Lip', p:calc.macros.pctL, c:'var(--blue-500)'}].map(m => (
                  <div key={m.l} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: m.c }} />
                    <div className="stat-label" style={{ color: m.c, marginBottom: 0 }}>{m.l}</div>
                    <div style={{ fontWeight: 800, fontSize: '16px' }}>{m.p.toFixed(0)}%</div>
                  </div>
                ))}
              </div>
              <div style={{ width: '120px', height: '120px' }}>
                <svg width="120" height="120" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="var(--slate-100)" strokeWidth="25" />
                  <circle cx="100" cy="100" r="85" fill="none" stroke="var(--amber-500)" strokeWidth="25" 
                    strokeDasharray={`${(calc.macros.pctP / 100) * 534} 534`} transform="rotate(-90 100 100)" />
                  <circle cx="100" cy="100" r="85" fill="none" stroke="var(--green-600)" strokeWidth="25" 
                    strokeDasharray={`${(calc.macros.pctC / 100) * 534} 534`} transform={`rotate(${(calc.macros.pctP / 100) * 360 - 90} 100 100)`} />
                  <circle cx="100" cy="100" r="85" fill="none" stroke="var(--blue-500)" strokeWidth="25" 
                    strokeDasharray={`${(calc.macros.pctL / 100) * 534} 534`} transform={`rotate(${((calc.macros.pctP + calc.macros.pctC) / 100) * 360 - 90} 100 100)`} />
                </svg>
              </div>
            </div>
          </div>

          <h3 className="card-title" style={{ marginBottom: '16px' }}>Alimentos de la Comida</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Alimento</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Gramos</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Prot</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Lip</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Carb</th>
              </tr>
            </thead>
            <tbody>
              {calc.items.map((it, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{it.foodName}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.grams}g</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.proteinas_g.toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.lipidos_g.toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.hidratos_g.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (patient) {
    return (
      <div className="page animate-fade-in">
        <button className="btn btn-outline btn-sm mb-6" onClick={() => setSelectedPatientId(null)}>
          <ArrowLeft size={16} />
          <span>Volver a pacientes</span>
        </button>

        <div className="section-header mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="topbar-title" style={{ fontSize: '32px' }}>{patient.patientName} {patient.patientLastName}</h1>
            <p className="text-muted">Historial completo de desarrollos SARA 2 para este paciente.</p>
          </div>
          <button className="btn btn-ghost" style={{ color: 'var(--red-500)' }} onClick={(e) => handleDeletePatient(patient.id, e)}>
            <Trash2 size={18} />
            <span>Eliminar Perfil</span>
          </button>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {patient.calculations.map(calc => (
            <div key={calc.id} className="card" style={{ cursor: 'pointer', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setSelectedCalc(calc)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'var(--green-50)', color: 'var(--green-600)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{calc.mealType}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{formatDate(calc.date)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Energía</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--green-700)' }}>{calc.vct.toFixed(0)} kcal</div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                   <button className="btn-icon" onClick={(e) => handleDeleteCalculation(patient.id, calc.id, e)} style={{ color: 'var(--slate-300)' }}><Trash2 size={16} /></button>
                   <ChevronRight size={20} color="var(--slate-300)" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in">
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      
      <div className="section-header mb-6">
        <div>
          <h1 className="topbar-title" style={{ fontSize: '32px' }}>Mis Desarrollos</h1>
          <p className="text-muted">Gestión de seguimientos calóricos agrupados por paciente.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '32px', padding: '12px 24px' }}>
        <div className="input-icon">
          <span className="icon"><Search size={18} /></span>
          <input
            type="text"
            className="input"
            placeholder="Buscar paciente por nombre..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ border: 'none', background: 'transparent' }}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map(p => (
            <div key={p.id} className="card recipe-card-premium" style={{ cursor: 'pointer', padding: '24px' }} onClick={() => setSelectedPatientId(p.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div className="user-avatar" style={{ width: '56px', height: '56px', borderRadius: '16px', fontSize: '20px' }}>
                  {p.patientName[0]}{p.patientLastName[0]}
                </div>
                <div style={{ background: 'var(--green-50)', color: 'var(--green-700)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
                  {p.calculations.length} CÁLCULOS
                </div>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{p.patientName} {p.patientLastName}</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} />
                <span>Último: {formatDate(p.calculations[0].date)}</span>
              </div>
              <div className="divider" style={{ margin: '16px 0', opacity: 0.5 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['Desayuno', 'Almuerzo', 'Cena'].map(m => {
                    const has = p.calculations.some(c => c.mealType === m);
                    return <span key={m} style={{ width: '8px', height: '8px', borderRadius: '50%', background: has ? 'var(--green-500)' : 'var(--slate-200)' }} title={m} />;
                  })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--green-700)', fontSize: '13px', fontWeight: 700 }}>
                  <span>Ver historial</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '80px 0', textAlign: 'center', borderRadius: '32px' }}>
          <div style={{ background: 'var(--slate-50)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <FolderOpen size={40} color="var(--slate-300)" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>No hay desarrollos</h3>
          <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto 24px' }}>Los cálculos guardados aparecerán agrupados por paciente aquí.</p>
        </div>
      )}
    </div>
  );
}
