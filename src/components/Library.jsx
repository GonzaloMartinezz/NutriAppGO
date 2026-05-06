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
      <div className="library-header section-header">
        <div className="header-text">
          <h1 className="hero-title-clinical">Biblioteca de Activos</h1>
          <p className="text-muted">Tu repositorio central de conocimiento clínico y certificaciones.</p>
        </div>
        <div className="input-icon search-wrapper-library">
          <span className="icon">🔍</span>
          <input 
            type="text" 
            className="input" 
            placeholder="Buscar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="library-tabs-container">
        <div className="library-tabs">
          {['all', 'certs', 'resources', 'favorites'].map(tab => (
            <button 
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'Todo' : tab === 'certs' ? 'Certs' : tab === 'resources' ? 'Recursos' : 'Favs'}
            </button>
          ))}
        </div>
      </div>

      <div className="library-sections">
        {/* Certifications Section */}
        {(activeTab === 'all' || activeTab === 'certs') && (
          <section className="library-section">
            <div className="section-header">
              <h3 className="section-subtitle">Carrera & Títulos</h3>
              <button className="btn btn-ghost btn-sm hide-mobile">Ver Historial →</button>
            </div>
            <div className="cert-grid">
              {filteredCerts.map(cert => (
                <div key={cert.id} className="card cert-card-modern">
                  <div className="cert-accent" style={{ background: cert.color }}></div>
                  <div className="cert-content">
                    <div className="cert-icon-wrapper" style={{ background: `${cert.color}15` }}>
                      {cert.icon}
                    </div>
                    <div className="cert-info">
                      <div className="cert-type" style={{ color: cert.color }}>{cert.type}</div>
                      <h4 className="cert-title">{cert.title}</h4>
                      <p className="cert-meta">{cert.institution} · {cert.year}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="card add-cert-card">
                <div className="add-cert-content">
                  <div className="add-icon">⊕</div>
                  <div className="add-text">Añadir</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Resources Section */}
        {(activeTab === 'all' || activeTab === 'resources') && (
          <section className="library-section">
            <div className="section-header">
              <h3 className="section-subtitle">Recursos & Herramientas</h3>
              <div className="section-actions">
                 <button className="btn btn-outline btn-sm">⊕ Subir</button>
              </div>
            </div>
            
            {/* Desktop Table View */}
            <div className="card library-table-wrapper hide-mobile">
              <table className="clinical-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Formato</th>
                    <th>Tamaño</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map(res => (
                    <tr key={res.id} className="table-row-hover">
                      <td>
                        <div className="resource-name">
                          <span className="resource-icon">{res.icon}</span>
                          <span className="resource-title">{res.title}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-gray">{res.category}</span></td>
                      <td><span className="format-tag">{res.format}</span></td>
                      <td>{res.size}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm">📥</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="resource-grid-mobile show-mobile">
              {filteredResources.map(res => (
                <div key={res.id} className="card resource-mobile-card">
                  <div className="resource-mobile-header">
                    <span className="resource-icon">{res.icon}</span>
                    <div className="resource-mobile-info">
                      <div className="resource-title">{res.title}</div>
                      <div className="resource-meta">{res.category} · {res.size}</div>
                    </div>
                    <button className="btn btn-ghost btn-icon">📥</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
