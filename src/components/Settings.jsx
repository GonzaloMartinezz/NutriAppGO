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
    setUserProfile({ 
      ...formData, 
      avatar: formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??' 
    });
    triggerConfirm('Configuración Actualizada', 'Los cambios en tu perfil profesional se han guardado correctamente.');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: '#064e3b', marginBottom: '8px' }}>Configuración</h1>
        <p className="text-muted">Gestiona tu identidad profesional y las preferencias de tu espacio de trabajo.</p>
      </div>

      <div className="grid-2 gap-8" style={{ gridTemplateColumns: '300px 1fr' }}>
        {/* Sidebar Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Perfil', 'Notificaciones', 'Seguridad', 'Suscripción'].map((item, i) => (
            <div key={item} style={{ 
              padding: '12px 16px', borderRadius: '12px', fontWeight: 600, fontSize: '14px',
              background: i === 0 ? 'var(--green-50)' : 'transparent',
              color: i === 0 ? 'var(--green-700)' : 'var(--slate-500)',
              cursor: 'pointer'
            }}>
              {item}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: '40px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #f1f5f9' }}>
            <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px', borderRadius: '24px' }}>
              {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'}
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Foto de Perfil</h3>
              <p className="text-muted" style={{ fontSize: '13px', marginBottom: '12px' }}>Actualiza tu foto para que tus pacientes te reconozcan.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary btn-sm">Subir Nueva</button>
                <button className="btn btn-ghost btn-sm">Eliminar</button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2 gap-6" style={{ marginBottom: '32px' }}>
              <div className="form-group">
                <label className="label">Nombre Profesional</label>
                <input className="input" name="name" value={formData.name} onChange={handleChange} style={{ borderRadius: '12px' }} />
              </div>
              <div className="form-group">
                <label className="label">Matrícula (MN/MP)</label>
                <input className="input" name="mn" value={formData.mn} onChange={handleChange} style={{ borderRadius: '12px' }} />
              </div>
              <div className="form-group">
                <label className="label">Especialidad</label>
                <input className="input" name="role" value={formData.role} onChange={handleChange} style={{ borderRadius: '12px' }} />
              </div>
              <div className="form-group">
                <label className="label">Email de Trabajo</label>
                <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} style={{ borderRadius: '12px' }} />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Preferencias de Idioma</h4>
              <select className="select" style={{ background: '#fff', borderRadius: '12px' }}>
                <option>Español (Latinoamérica)</option>
                <option>English</option>
                <option>Português</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn btn-outline">Descartar</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px' }}>Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
