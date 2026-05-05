import React, { useState } from 'react';
import { Toast } from './Toast';
import { WeightChart } from './WeightChart';
import { MacroBar } from './MacroBar';
import {
  getAge,
  fmtDate,
  calcIMC,
  ACTIVITY_LABELS,
} from '../utils/math';

export function Patients({ patients, setPatients }) {
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showAnthro, setShowAnthro] = useState(false);
  const [anthroForm, setAnthroForm] = useState({
    weight: '',
    height: '',
    waistCirc: '',
    hipCirc: '',
  });
  const [toast, setToast] = useState(null);

  const filtered = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(q.toLowerCase()) ||
      p.lastName.toLowerCase().includes(q.toLowerCase())
  );
  const pat = selected ? patients.find((p) => p.id === selected) : null;

  const addAnthro = () => {
    if (!anthroForm.weight || !anthroForm.height) return;
    const w = parseFloat(anthroForm.weight),
      h = parseFloat(anthroForm.height);
    const { imc, cat } = calcIMC(w, h);
    const icc =
      anthroForm.waistCirc && anthroForm.hipCirc
        ? +(anthroForm.waistCirc / anthroForm.hipCirc).toFixed(2)
        : null;
    const newRec = {
      date: new Date().toISOString().slice(0, 10),
      weight: w,
      height: h,
      imc,
      imcCategory: cat,
      waistCirc: parseFloat(anthroForm.waistCirc) || null,
      hipCirc: parseFloat(anthroForm.hipCirc) || null,
      icc,
    };
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selected ? { ...p, anthropometry: [...p.anthropometry, newRec] } : p
      )
    );
    setAnthroForm({ weight: '', height: '', waistCirc: '', hipCirc: '' });
    setShowAnthro(false);
    setToast('Medición registrada exitosamente');
  };

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 16,
          height: 'calc(100vh - 110px)',
        }}
      >
        {/* Patient List */}
        <div
          className="card"
          style={{
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overflow: 'hidden',
          }}
        >
          <div
            className="section-header"
            style={{ padding: '0 4px', marginBottom: 4 }}
          >
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              Pacientes ({filtered.length})
            </span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              + Nuevo
            </button>
          </div>
          <div className="input-icon" style={{ marginBottom: 4 }}>
            <span className="icon">🔍</span>
            <input
              className="input"
              placeholder="Buscar..."
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

        {/* Patient Detail */}
        {pat ? (
          <div
            style={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
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
                    <span className="icon">📏</span>Antropometría
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
                          style={{ marginBottom: 8, marginTop: 4 }}
                        >
                          <span className="icon">📈</span>Evolución de peso
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
                    <div className="empty-icon">📏</div>
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
                    <span className="icon">⚡</span>Requerimientos nutricionales
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
                    <span className="icon">💊</span>Medicación / Alergias
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
                  <div className="card-title" style={{ marginBottom: 4 }}>
                    <span className="icon">📞</span>Contacto
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
              <div className="empty-icon">👈</div>
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
                ✕
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
    </div>
  );
}
