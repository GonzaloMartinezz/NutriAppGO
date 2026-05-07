import React, { useState } from 'react';
import {
  User,
  Shield,
  CreditCard,
  Globe,
  Camera,
  Trash2,
  Save,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from './Toast';

export function Settings() {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    matricula: user?.matricula || '',
    especializacion: user?.especializacion || '',
    role: user?.role || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('Perfil');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      fullName: formData.fullName,
      matricula: formData.matricula,
      especializacion: formData.especializacion,
      role: formData.role,
      email: formData.email,
      avatar: formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'
    };
    updateUserProfile(updatedData);
    setToast('Configuración guardada correctamente');
  };

  const tabs = [
    { name: 'Perfil', icon: User },
    { name: 'Seguridad', icon: Shield },
    { name: 'Suscripción', icon: CreditCard }
  ];

  return (
    <div className="page" style={{ maxWidth: '1000px' }}>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      
      <div style={{ marginBottom: '32px' }}>
        <h1 className="topbar-title" style={{ fontSize: '32px', marginBottom: '4px' }}>Configuración</h1>
        <p className="text-muted">Gestiona tu identidad profesional y las preferencias de tu espacio de trabajo.</p>
      </div>

      <div className="grid-2 gap-8 settings-layout">
        {/* Sidebar Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <div 
                key={tab.name} 
                onClick={() => setActiveTab(tab.name)}
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '12px', 
                  fontWeight: 600, 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: activeTab === tab.name ? 'var(--green-50)' : 'transparent',
                  color: activeTab === tab.name ? 'var(--green-700)' : 'var(--slate-500)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                {tab.name}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: '32px', borderRadius: '20px' }}>
          {activeTab === 'Perfil' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
                <div className="user-avatar" style={{ width: '72px', height: '72px', fontSize: '28px', borderRadius: '20px' }}>
                  {formData.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>Foto de Perfil</h3>
                  <p className="text-muted" style={{ fontSize: '12px', marginBottom: '12px' }}>Actualiza tu foto para que tus pacientes te reconozcan.</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary btn-sm">
                      <Camera size={14} />
                      Subir Nueva
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid-2 gap-4" style={{ marginBottom: '24px' }}>
                  <div className="form-group">
                    <label className="label" style={{ fontSize: '12px' }}>Nombre Profesional</label>
                    <input className="input" name="fullName" value={formData.fullName} onChange={handleChange} style={{ borderRadius: '10px', height: '38px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(205, 220, 57, 0.3)', color: 'var(--text-main)' }} />
                  </div>
                  <div className="form-group">
                    <label className="label" style={{ fontSize: '12px' }}>Tipo de Cuenta</label>
                    <input className="input" name="role" value={formData.role} onChange={handleChange} style={{ borderRadius: '10px', height: '38px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(205, 220, 57, 0.3)', color: 'var(--text-main)' }} disabled />
                  </div>
                  {formData.role === 'Nutricionista' && (
                    <>
                      <div className="form-group">
                        <label className="label" style={{ fontSize: '12px' }}>Matrícula Profesional</label>
                        <input className="input" name="matricula" value={formData.matricula} onChange={handleChange} style={{ borderRadius: '10px', height: '38px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(205, 220, 57, 0.3)', color: 'var(--text-main)' }} placeholder="NUT-12345" />
                      </div>
                      <div className="form-group">
                        <label className="label" style={{ fontSize: '12px' }}>Especialización</label>
                        <input className="input" name="especializacion" value={formData.especializacion} onChange={handleChange} style={{ borderRadius: '10px', height: '38px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(205, 220, 57, 0.3)', color: 'var(--text-main)' }} placeholder="Nutrición Deportiva" />
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label className="label" style={{ fontSize: '12px' }}>Email de Trabajo</label>
                    <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} style={{ borderRadius: '10px', height: '38px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(205, 220, 57, 0.3)', color: 'var(--text-main)' }} disabled />
                  </div>
                </div>

                <div style={{ background: 'rgba(205, 220, 57, 0.08)', padding: '20px', borderRadius: '14px', marginBottom: '24px', border: '1px solid rgba(205, 220, 57, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Globe size={16} color="#cddc39" />
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Preferencias Regionales</h4>
                  </div>
                  <select className="input" style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '10px', height: '38px', border: '1px solid rgba(205, 220, 57, 0.3)', color: 'var(--text-main)' }}>
                    <option>Español (Latinoamérica)</option>
                    <option>English</option>
                    <option>Português</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setFormData({
                    fullName: user?.fullName || '',
                    matricula: user?.matricula || '',
                    especializacion: user?.especializacion || '',
                    role: user?.role || '',
                    email: user?.email || '',
                    avatar: user?.avatar || ''
                  })}>
                    <RotateCcw size={14} />
                    Descartar
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                    <Save size={14} />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ background: 'var(--slate-50)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Zap size={32} color="var(--slate-300)" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Sección en Desarrollo</h3>
              <p className="text-muted" style={{ fontSize: '13px' }}>Estamos trabajando para traerte más opciones de personalización pronto.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
