import React, { useState } from 'react';

export function Library() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const certs = [
    { id: 1, title: 'Licenciatura en Nutrición', institution: 'UBA', year: '2020', type: 'Título', icon: '🎓', color: '#10b981' },
    { id: 2, title: 'Posgrado Nutrición Deportiva', institution: 'IUPFA', year: '2022', type: 'Posgrado', icon: '🏃‍♂️', color: '#3b82f6' },
    { id: 3, title: 'Antropometría ISAK II', institution: 'ISAK', year: '2023', type: 'Certificación', icon: '📏', color: '#f59e0b' },
    { id: 4, title: 'Nutrición en Diabetes T2', institution: 'SAD', year: '2024', type: 'Especialidad', icon: '🩸', color: '#ef4444' },
  ];

  const resources = [
    { id: 101, title: 'Tabla SARA 2 Oficial', category: 'Tablas', format: 'PDF', size: '2.4 MB', icon: '📊' },
    { id: 102, title: 'Guía GAPA Argentina', category: 'Guías', format: 'PDF', size: '5.1 MB', icon: '🇦🇷' },
    { id: 103, title: 'Protocolo Ayuno Intermitente', category: 'Protocolos', format: 'DOCX', size: '1.2 MB', icon: '⏳' },
    { id: 104, title: 'Vademécum Nutricional', category: 'Referencia', format: 'PDF', size: '12.8 MB', icon: '💊' },
    { id: 105, title: 'Cuestionario Frecuencia', category: 'Herramientas', format: 'XLSX', size: '0.5 MB', icon: '📝' },
  ];

  const filteredCerts = certs.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredResources = resources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="library-container">
      {/* Header & Local Search */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: '#064e3b', marginBottom: '8px' }}>Biblioteca de Activos</h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>Tu repositorio central de conocimiento clínico y certificaciones profesionales.</p>
        </div>
        <div className="input-icon" style={{ width: '300px' }}>
          <span className="icon">🔍</span>
          <input 
            type="text" 
            className="input" 
            placeholder="Buscar en biblioteca..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff' }}
          />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        {['all', 'certs', 'resources', 'favorites'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '12px 4px', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === tab ? '2px solid #064e3b' : '2px solid transparent',
              color: activeTab === tab ? '#064e3b' : '#94a3b8',
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'all' ? 'Todo' : tab === 'certs' ? 'Certificaciones' : tab === 'resources' ? 'Recursos' : 'Favoritos'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '48px' }}>
        {/* Certifications Section */}
        {(activeTab === 'all' || activeTab === 'certs') && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Carrera & Certificaciones</h3>
              <button className="btn btn-ghost btn-sm" style={{ fontWeight: 700, color: '#064e3b' }}>Ver Historial →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredCerts.map(cert => (
                <div key={cert.id} className="card cert-card-modern" style={{ position: 'relative', overflow: 'hidden', transition: 'transform 0.2s' }}>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: cert.color 
                  }}></div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '12px', background: `${cert.color}15`, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' 
                    }}>
                      {cert.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: cert.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{cert.type}</div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', lineHeight: 1.3, marginBottom: '4px' }}>{cert.title}</h4>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>{cert.institution} · {cert.year}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="card" style={{ border: '2px dashed #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⊕</div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Añadir Certificado</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Resources Section */}
        {(activeTab === 'all' || activeTab === 'resources') && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Recursos & Herramientas</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <button className="btn btn-outline btn-sm">📁 Carpetas</button>
                 <button className="btn btn-primary btn-sm">⊕ Subir</button>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Nombre del Recurso</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Categoría</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Formato</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Tamaño</th>
                    <th style={{ padding: '16px 24px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map(res => (
                    <tr key={res.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} className="table-row-hover">
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '20px' }}>{res.icon}</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{res.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}><span className="badge badge-gray">{res.category}</span></td>
                      <td style={{ padding: '16px 24px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{res.format}</span></td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: '#94a3b8' }}>{res.size}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: '18px' }}>📥</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cert-card-modern:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
        .table-row-hover:hover { background: #f8fafc; }
      `}} />
    </div>
  );
}
