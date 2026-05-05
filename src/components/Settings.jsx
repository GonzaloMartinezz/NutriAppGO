import React, { useState } from 'react';
import { Toast } from './Toast';

export function Settings({ userProfile, setUserProfile }) {
  const [formData, setFormData] = useState({ ...userProfile });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would save this to a backend/localStorage
    setUserProfile({ 
      ...formData, 
      avatar: formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??' 
    });
    setToast('Configuración guardada correctamente');
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Configuración del Perfil</div>
          <div className="text-muted text-sm" style={{ marginTop: 3 }}>
            Personalizá tu información profesional y ajustes de la plataforma
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span className="icon">👤</span>Información Profesional
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid-2 gap-4">
            <div className="form-group">
              <label className="label">Nombre y Apellido</label>
              <input 
                className="input" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                placeholder="Ej: Valeria Rodríguez"
              />
            </div>
            <div className="form-group">
              <label className="label">Matrícula Nacional (MN)</label>
              <input 
                className="input" 
                name="mn"
                value={formData.mn} 
                onChange={handleChange}
                placeholder="Ej: 12345"
              />
            </div>
            <div className="form-group">
              <label className="label">Especialidad / Título</label>
              <input 
                className="input" 
                name="role"
                value={formData.role} 
                onChange={handleChange}
                placeholder="Ej: Nutricionista"
              />
            </div>
            <div className="form-group">
              <label className="label">Email de Contacto</label>
              <input 
                className="input" 
                name="email"
                type="email"
                value={formData.email || ''} 
                onChange={handleChange}
                placeholder="Ej: valeria@nutriapp.com"
              />
            </div>
          </div>

          <div className="divider" />

          <div className="card-title">
            <span className="icon">🎨</span>Preferencias de Interfaz
          </div>
          
          <div className="form-group">
            <label className="label">Tema de la plataforma</label>
            <select className="select" defaultValue="light">
              <option value="light">Claro (Predeterminado)</option>
              <option value="dark">Oscuro (Próximamente)</option>
              <option value="system">Sincronizar con sistema</option>
            </select>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              💾 Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <div className="card mt-2" style={{ marginTop: '16px', background: 'var(--slate-50)', borderStyle: 'dashed' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="user-avatar" style={{ width: 48, height: 48, fontSize: 18 }}>
            {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Vista previa del perfil</div>
            <div className="text-sm text-muted">Así se verá tu nombre en la plataforma y reportes.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
