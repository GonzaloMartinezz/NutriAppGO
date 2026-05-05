import React, { useState } from 'react';

export function Library() {
  const [tab, setTab] = useState('certs');
  const certs = [
    {
      id: 1,
      title: 'Licenciatura en Nutrición',
      institution: 'Universidad de Buenos Aires',
      date: '2020-12',
      type: 'TITULO',
      category: 'Nutrición Clínica',
      icon: '🎓',
      bg: '#d1fae5',
    },
    {
      id: 2,
      title: 'Posgrado en Nutrición Deportiva',
      institution: 'IUPFA',
      date: '2022-06',
      type: 'POSGRADO',
      category: 'Deportiva',
      icon: '🏅',
      bg: '#dbeafe',
    },
    {
      id: 3,
      title: 'Curso SARA 2 — Composición de Alimentos',
      institution: 'ANMAT / INTA',
      date: '2023-03',
      type: 'CURSO',
      category: 'Nutrición Clínica',
      icon: '📊',
      bg: '#fce7f3',
    },
    {
      id: 4,
      title: 'Congreso Argentino de Nutrición',
      institution: 'AADYND',
      date: '2024-09',
      type: 'CONGRESO',
      category: 'Actualización',
      icon: '🏛️',
      bg: '#fef3c7',
    },
    {
      id: 5,
      title: 'Diplomatura en Nutrición Pediátrica',
      institution: 'SLAN',
      date: '2023-11',
      type: 'POSGRADO',
      category: 'Pediátrica',
      icon: '👶',
      bg: '#f3e8ff',
    },
  ];
  const materials = [
    {
      id: 1,
      title: 'Tabla SARA 2 — PDF oficial',
      type: 'TABLA',
      subject: 'SARA 2',
      tags: ['referencia', 'alimentos', 'oficial'],
      isFavorite: true,
      icon: '📄',
    },
    {
      id: 2,
      title: 'Guía de Alimentación Saludable — MS',
      type: 'GUIA',
      subject: 'Nutrición General',
      tags: ['salud', 'ministerio'],
      isFavorite: false,
      icon: '📋',
    },
    {
      id: 3,
      title: 'Protocolos para Diabetes T2',
      type: 'PROTOCOLO',
      subject: 'Nutrición Clínica',
      tags: ['diabetes', 'glicemia', 'protocolos'],
      isFavorite: true,
      icon: '🏥',
    },
    {
      id: 4,
      title: 'Artículo: Resistencia Insulínica y dieta',
      type: 'ARTICULO',
      subject: 'Nutrición Clínica',
      tags: ['insulina', 'evidencia'],
      isFavorite: false,
      icon: '📰',
    },
  ];
  return (
    <div>
      <div className="section-header mb-4">
        <div>
          <div className="section-title">Biblioteca Personal</div>
          <div className="text-muted text-sm" style={{ marginTop: 3 }}>
            Certificaciones, materiales de estudio y apuntes
          </div>
        </div>
        <button className="btn btn-primary">+ Agregar</button>
      </div>
      <div className="tabs">
        <div
          className={`tab${tab === 'certs' ? ' active' : ''}`}
          onClick={() => setTab('certs')}
        >
          🎓 Certificaciones ({certs.length})
        </div>
        <div
          className={`tab${tab === 'materials' ? ' active' : ''}`}
          onClick={() => setTab('materials')}
        >
          📚 Materiales ({materials.length})
        </div>
      </div>
      {tab === 'certs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {certs.map((c) => (
            <div key={c.id} className="cert-card">
              <div className="cert-icon" style={{ background: c.bg }}>
                {c.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--slate-800)',
                    marginBottom: 2,
                  }}
                >
                  {c.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                  {c.institution}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <span className="badge badge-gray">{c.type}</span>
                  <span className="chip">{c.category}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--slate-400)',
                      alignSelf: 'center',
                    }}
                  >
                    📅{' '}
                    {new Date(c.date).toLocaleDateString('es-AR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-icon btn-sm">📎 Ver</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'materials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {materials.map((m) => (
            <div key={m.id} className="cert-card">
              <div
                className="cert-icon"
                style={{ background: 'var(--slate-100)', fontSize: 22 }}
              >
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--slate-800)',
                    marginBottom: 2,
                  }}
                >
                  {m.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                  {m.subject}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className="badge badge-blue">{m.type}</span>
                  {m.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="btn btn-ghost btn-icon btn-sm"
                title={m.isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
              >
                {m.isFavorite ? '⭐' : '☆'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
