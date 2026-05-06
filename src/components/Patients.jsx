import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  ArrowLeft, 
  Ruler, 
  TrendingUp, 
  Zap, 
  Pill, 
  Phone, 
  Mail, 
  Plus, 
  X, 
  ChevronLeft,
  Calendar,
  Activity,
  HeartPulse,
  Target
} from 'lucide-react';
import { Toast } from './Toast';
import { WeightChart } from './WeightChart';
import { MacroBar } from './MacroBar';
import {
  getAge,
  fmtDate,
  calcIMC,
  ACTIVITY_LABELS,
} from '../utils/math';

export function Patients({ patients, setPatients, triggerConfirm }) {
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    birthDate: '',
    sex: 'F',
    occupation: '',
    email: '',
    phone: '',
    pathologies: '',
    objectives: '',
    activity: 'MODERADO'
  });
  const [showAnthro, setShowAnthro] = useState(false);
  const [anthroForm, setAnthroForm] = useState({
    weight: '',
    height: '',
    waistCirc: '',
    hipCirc: '',
  });
  const [toast, setToast] = useState(null);
  const API_BASE = 'http://localhost:5000/api';

  const getToken = () => localStorage.getItem('nutriapp_token');

  useEffect(() => {
    if (patients.length === 0) {
      loadPatients();
    }
  }, []);

  const loadPatients = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/patients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const { patients: data } = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(q.toLowerCase()) ||
      p.lastName.toLowerCase().includes(q.toLowerCase())
  );
  const pat = selected ? patients.find((p) => p.id === selected) : null;

  const addAnthro = async () => {
    if (!anthroForm.weight || !anthroForm.height) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/patients/${selected}/anthropometry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          weight: parseFloat(anthroForm.weight),
          height: parseFloat(anthroForm.height),
          chest: anthroForm.waistCirc ? parseFloat(anthroForm.waistCirc) : null,
          waist: anthroForm.waistCirc ? parseFloat(anthroForm.waistCirc) : null,
          hip: anthroForm.hipCirc ? parseFloat(anthroForm.hipCirc) : null
        })
      });

      if (response.ok) {
        const { patient } = await response.json();
        setPatients((prev) =>
          prev.map((p) => p.id === selected ? patient : p)
        );
        setAnthroForm({ weight: '', height: '', waistCirc: '', hipCirc: '' });
        setShowAnthro(false);
        triggerConfirm('Medición Guardada', 'Los nuevos datos antropométricos han sido registrados en la evolución del paciente.');
      } else {
        triggerConfirm('Error', 'No se pudo agregar la medición');
      }
    } catch (error) {
      console.error('Error adding anthropometry:', error);
      triggerConfirm('Error', 'Error en la conexión');
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.dni) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: newPatient.firstName,
          lastName: newPatient.lastName,
          dni: newPatient.dni,
          email: newPatient.email,
          phone: newPatient.phone,
          age: newPatient.birthDate ? new Date().getFullYear() - new Date(newPatient.birthDate).getFullYear() : null,
          gender: newPatient.sex,
          observations: newPatient.pathologies || ''
        })
      });

      if (response.ok) {
        const { patient } = await response.json();
        setPatients(prev => [patient, ...prev]);
        setShowForm(false);
        setNewPatient({ firstName: '', lastName: '', dni: '', birthDate: '', sex: 'F', occupation: '', email: '', phone: '', pathologies: '', objectives: '', activity: 'MODERADO' });
        triggerConfirm('Paciente Registrado', `Se ha creado la ficha de ${patient.firstName} ${patient.lastName} con éxito.`);
        setSelected(patient.id);
      } else {
        triggerConfirm('Error', 'No se pudo registrar el paciente');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      triggerConfirm('Error', 'Error en la conexión');
    }
  };

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    <div className="patients-layout">
        {/* Patient List - Hidden on mobile if a patient is selected */}
        <div
          className={`card ${selected ? 'hide-mobile' : ''}`}
          style={{
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overflow: 'hidden',
            height: 'fit-content'
          }}
        >
          <div
            className="section-header"
            style={{ padding: '0 4px', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-main)' }}>
              Pacientes ({filtered.length})
            </span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)} style={{ padding: '6px 12px' }}>
              <Plus size={16} />
              <span>Nuevo</span>
            </button>
          </div>
          <div className="input-icon" style={{ marginBottom: 4 }}>
            <span className="icon"><Search size={16} /></span>
            <input
              className="input"
              placeholder="Buscar por nombre..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`patient-row${selected === p.id ? ' selected' : ''}`}
                onClick={() => setSelected(p.id)}
              >
                <div className="patient-avatar">
                  {p.firstName[0]}
                  {p.lastName[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="patient-name"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="patient-meta">
                    {getAge(p.birthDate)} años · {p.sex === 'F' ? 'Femenino' : 'Masculino'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Detail - Header with Back Button for Mobile */}
        {pat ? (
          <div
            style={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <button 
              className="btn btn-outline btn-sm show-mobile" 
              style={{ marginBottom: 8, width: 'fit-content' }}
              onClick={() => setSelected(null)}
            >
              <ArrowLeft size={16} />
              <span>Volver a la lista</span>
            </button>
            {/* Header */}
            <div
              className="card"
              style={{
                background:
                  'linear-gradient(135deg,var(--slate-800) 0%,var(--slate-700) 100%)',
              }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg,var(--green-400),var(--teal-500))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    flexShrink: 0,
                  }}
                >
                  {pat.firstName[0]}
                  {pat.lastName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      color: '#fff',
                    }}
                  >
                    {pat.firstName} {pat.lastName}
                  </div>
                  <div
                    style={{ fontSize: 12, color: 'var(--slate-400)', marginTop: 3 }}
                  >
                    {pat.occupation} · {getAge(pat.birthDate)} años ·{' '}
                    {pat.sex === 'F' ? 'Femenino' : 'Masculino'} · DNI {pat.dni}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {pat.pathologies.map((p) => (
                      <span key={p} className="badge badge-red">
                        {p}
                      </span>
                    ))}
                    {pat.allergies.map((a) => (
                      <span key={a} className="badge badge-amber">
                        Alergia: {a}
                      </span>
                    ))}
                    {pat.objectives.map((o) => (
                      <span key={o} className="badge badge-blue">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--slate-500)',
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                    }}
                  >
                    Actividad
                  </div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>
                    {ACTIVITY_LABELS[pat.physicalActivity]}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--slate-500)', marginTop: 4 }}>
                    Desde {fmtDate(pat.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid-2 gap-4">
              {/* Anthropometry */}
              <div className="card">
                <div className="section-header" style={{ marginBottom: 12 }}>
                  <div className="card-title" style={{ marginBottom: 0 }}>
                    <Ruler size={16} />
                    <span>Antropometría</span>
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowAnthro(true)}
                  >
                    + Medición
                  </button>
                </div>
                {pat.anthropometry.length > 0 ? (
                  (() => {
                    const last = pat.anthropometry[pat.anthropometry.length - 1];
                    const {
                      imc: imcVal,
                      cat: imcCat,
                      col: imcCol,
                    } = calcIMC(last.weight, last.height);
                    return (
                      <>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: 10,
                            marginBottom: 14,
                          }}
                        >
                          <div
                            style={{
                              textAlign: 'center',
                              padding: '10px',
                              background: 'var(--slate-50)',
                              borderRadius: 8,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 10,
                                color: 'var(--slate-500)',
                                textTransform: 'uppercase',
                                letterSpacing: '.06em',
                              }}
                            >
                              Peso
                            </div>
                            <div
                              style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: 'var(--slate-800)',
                              }}
                            >
                              {last.weight}
                              <span style={{ fontSize: 12, fontWeight: 400 }}> kg</span>
                            </div>
                          </div>
                          <div
                            style={{
                              textAlign: 'center',
                              padding: '10px',
                              background: 'var(--slate-50)',
                              borderRadius: 8,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 10,
                                color: 'var(--slate-500)',
                                textTransform: 'uppercase',
                                letterSpacing: '.06em',
                              }}
                            >
                              Talla
                            </div>
                            <div
                              style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: 'var(--slate-800)',
                              }}
                            >
                              {last.height}
                              <span style={{ fontSize: 12, fontWeight: 400 }}> cm</span>
                            </div>
                          </div>
                          <div
                            style={{
                              textAlign: 'center',
                              padding: '10px',
                              background: 'var(--slate-50)',
                              borderRadius: 8,
                              borderBottom: `3px solid ${imcCol}`,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 10,
                                color: 'var(--slate-500)',
                                textTransform: 'uppercase',
                                letterSpacing: '.06em',
                              }}
                            >
                              IMC
                            </div>
                            <div
                              style={{ fontSize: 22, fontWeight: 700, color: imcCol }}
                            >
                              {imcVal}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: imcCol,
                                fontWeight: 600,
                              }}
                            >
                              {imcCat}
                            </div>
                          </div>
                        </div>
                        <div
                          className="card-title"
                          style={{ marginBottom: 12, marginTop: 4 }}
                        >
                          <TrendingUp size={16} />
                          <span>Evolución de peso</span>
                        </div>
                        <WeightChart data={pat.anthropometry} />
                        <div style={{ marginTop: 12 }}>
                          <table style={{ width: '100%', fontSize: 12 }}>
                            <thead>
                              <tr>
                                <th>Fecha</th>
                                <th style={{ textAlign: 'right' }}>Peso</th>
                                <th style={{ textAlign: 'right' }}>IMC</th>
                                <th style={{ textAlign: 'right' }}>CC</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...pat.anthropometry]
                                .reverse()
                                .slice(0, 5)
                                .map((a, i) => {
                                  const prev =
                                    pat.anthropometry[pat.anthropometry.length - 1 - i - 1];
                                  const trend = prev
                                    ? a.weight < prev.weight
                                      ? '↓'
                                      : '↑'
                                    : '–';
                                  const trendCol = prev
                                    ? a.weight < prev.weight
                                      ? 'var(--green-500)'
                                      : 'var(--red-500)'
                                    : 'var(--slate-400)';
                                  return (
                                    <tr key={i}>
                                      <td>{fmtDate(a.date)}</td>
                                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                        {a.weight} kg{' '}
                                        <span style={{ color: trendCol, fontSize: 11 }}>
                                          {trend}
                                        </span>
                                      </td>
                                      <td style={{ textAlign: 'right' }}>{a.imc}</td>
                                      <td style={{ textAlign: 'right' }}>
                                        {a.waistCirc ? `${a.waistCirc} cm` : '—'}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <div className="empty-state">
                    <Ruler size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                    <div className="empty-text">Sin mediciones</div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: 8 }}
                      onClick={() => setShowAnthro(true)}
                    >
                      + Agregar primera medición
                    </button>
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="card">
                  <div className="card-title">
                    <Zap size={16} />
                    <span>Requerimientos nutricionales</span>
                  </div>
                  {pat.requirements ? (
                    <>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '14px',
                          background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                          borderRadius: 10,
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--green-700)',
                            textTransform: 'uppercase',
                            letterSpacing: '.1em',
                            fontWeight: 600,
                          }}
                        >
                          EER estimado
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 36,
                            color: 'var(--green-800)',
                          }}
                        >
                          {pat.requirements.eer}{' '}
                          <span style={{ fontSize: 16, fontWeight: 300 }}>
                            kcal/día
                          </span>
                        </div>
                      </div>
                      <MacroBar
                        prot={pat.requirements.proteins_g}
                        lip={pat.requirements.fats_g}
                        cho={pat.requirements.carbs_g}
                        large
                      />
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: 8,
                          marginTop: 12,
                        }}
                      >
                        <div
                          style={{
                            textAlign: 'center',
                            padding: 8,
                            background: '#fee2e2',
                            borderRadius: 8,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color: '#991b1b',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}
                          >
                            Proteínas
                          </div>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: 'var(--red-600)',
                            }}
                          >
                            {pat.requirements.proteins_g}g
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--red-600)' }}>
                            {pat.requirements.proteins_pct}%
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: 'center',
                            padding: 8,
                            background: '#dbeafe',
                            borderRadius: 8,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color: '#1e3a8a',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}
                          >
                            Hidratos
                          </div>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: 'var(--blue-600)',
                            }}
                          >
                            {pat.requirements.carbs_g}g
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--blue-600)' }}>
                            {pat.requirements.carbs_pct}%
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: 'center',
                            padding: 8,
                            background: '#fef3c7',
                            borderRadius: 8,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color: '#78350f',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}
                          >
                            Lípidos
                          </div>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: 'var(--amber-600)',
                            }}
                          >
                            {pat.requirements.fats_g}g
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--amber-600)' }}>
                            {pat.requirements.fats_pct}%
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-text">Sin cálculo de requerimientos</div>
                    </div>
                  )}
                </div>
                <div className="card">
                  <div className="card-title">
                    <Pill size={16} />
                    <span>Medicación / Alergias</span>
                  </div>
                  {pat.medications.length > 0 ? (
                    <div style={{ marginBottom: 8 }}>
                      {pat.medications.map((m) => (
                        <span
                          key={m}
                          className="chip"
                          style={{ marginRight: 4, marginBottom: 4 }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted">Sin medicación registrada</div>
                  )}
                  {pat.allergies.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      {pat.allergies.map((a) => (
                        <span key={a} className="badge badge-amber" style={{ marginRight: 4 }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="divider" />
                  <div className="card-title" style={{ marginBottom: 12 }}>
                    <Phone size={16} />
                    <span>Contacto</span>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--slate-600)' }}>
                    {pat.contact.email}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--slate-600)' }}>
                    {pat.contact.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <div className="empty-state">
              <ChevronLeft size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
              <div className="empty-text">Seleccioná un paciente</div>
              <div className="empty-sub">
                Hacé clic en un paciente de la lista para ver su ficha completa
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Anthro Modal */}
      {showAnthro && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowAnthro(false)}
        >
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Nueva medición antropométrica</div>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setShowAnthro(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="grid-2 gap-4">
                <div className="form-group">
                  <label className="label">Peso (kg) *</label>
                  <input
                    className="input"
                    type="number"
                    step="0.1"
                    placeholder="Ej: 72.5"
                    value={anthroForm.weight}
                    onChange={(e) =>
                      setAnthroForm((f) => ({ ...f, weight: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="label">Talla (cm) *</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="Ej: 163"
                    value={anthroForm.height}
                    onChange={(e) =>
                      setAnthroForm((f) => ({ ...f, height: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="label">Circunferencia cintura (cm)</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="Ej: 85"
                    value={anthroForm.waistCirc}
                    onChange={(e) =>
                      setAnthroForm((f) => ({ ...f, waistCirc: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="label">Circunferencia cadera (cm)</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="Ej: 100"
                    value={anthroForm.hipCirc}
                    onChange={(e) =>
                      setAnthroForm((f) => ({ ...f, hipCirc: e.target.value }))
                    }
                  />
                </div>
              </div>
              {anthroForm.weight &&
                anthroForm.height &&
                (() => {
                  const { imc, cat, col } = calcIMC(
                    parseFloat(anthroForm.weight),
                    parseFloat(anthroForm.height)
                  );
                  return (
                    <div
                      style={{
                        background: 'var(--slate-50)',
                        borderRadius: 8,
                        padding: 12,
                        marginTop: 4,
                        display: 'flex',
                        gap: 16,
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: 10,
                            color: 'var(--slate-500)',
                            textTransform: 'uppercase',
                            letterSpacing: '.08em',
                          }}
                        >
                          IMC calculado
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: col }}>
                          {imc}
                        </div>
                        <div style={{ fontSize: 12, color: col, fontWeight: 600 }}>
                          {cat}
                        </div>
                      </div>
                      {anthroForm.waistCirc && anthroForm.hipCirc && (
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: 10,
                              color: 'var(--slate-500)',
                              textTransform: 'uppercase',
                              letterSpacing: '.08em',
                            }}
                          >
                            ICC
                          </div>
                          <div
                            style={{
                              fontSize: 28,
                              fontWeight: 700,
                              color: 'var(--slate-700)',
                            }}
                          >
                            {(
                              anthroForm.waistCirc / anthroForm.hipCirc
                            ).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAnthro(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={addAnthro}>
                Guardar medición
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Patient Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <div className="modal-title">Registrar Nuevo Paciente</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleAddPatient}>
              <div className="modal-body">
                <div className="grid-2 gap-4">
                  <div className="form-group">
                    <label className="label">Nombre *</label>
                    <input className="input" required value={newPatient.firstName} onChange={e => setNewPatient(p => ({...p, firstName: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="label">Apellido *</label>
                    <input className="input" required value={newPatient.lastName} onChange={e => setNewPatient(p => ({...p, lastName: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="label">DNI</label>
                    <input className="input" value={newPatient.dni} onChange={e => setNewPatient(p => ({...p, dni: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="label">Fecha de Nacimiento</label>
                    <input className="input" type="date" value={newPatient.birthDate} onChange={e => setNewPatient(p => ({...p, birthDate: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="label">Sexo</label>
                    <select className="select" value={newPatient.sex} onChange={e => setNewPatient(p => ({...p, sex: e.target.value}))}>
                      <option value="F">Femenino</option>
                      <option value="M">Masculino</option>
                      <option value="O">Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Actividad Física</label>
                    <select className="select" value={newPatient.activity} onChange={e => setNewPatient(p => ({...p, activity: e.target.value}))}>
                      {Object.entries(ACTIVITY_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Email</label>
                    <input className="input" type="email" value={newPatient.email} onChange={e => setNewPatient(p => ({...p, email: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="label">Teléfono</label>
                    <input className="input" value={newPatient.phone} onChange={e => setNewPatient(p => ({...p, phone: e.target.value}))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="label">Patologías (separadas por coma)</label>
                    <input className="input" placeholder="Ej: Diabetes T2, HTA" value={newPatient.pathologies} onChange={e => setNewPatient(p => ({...p, pathologies: e.target.value}))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="label">Objetivos (separados por coma)</label>
                    <input className="input" placeholder="Ej: Bajar 5kg, Mejorar rendimiento" value={newPatient.objectives} onChange={e => setNewPatient(p => ({...p, objectives: e.target.value}))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear Paciente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
