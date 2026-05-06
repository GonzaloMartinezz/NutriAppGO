import React from 'react';
import { User, Briefcase, X } from 'lucide-react';

export function RoleSelector({ isOpen, selectedRole, onSelect, onClose }) {
  if (!isOpen) return null;

  const roles = [
    {
      value: 'Estudiante',
      title: 'Estudiante',
      description: 'Acceso a herramientas educativas y calculadora',
      icon: User
    },
    {
      value: 'Nutricionista',
      title: 'Nutricionista Profesional',
      description: 'Gestión completa de pacientes y reportes',
      icon: Briefcase
    }
  ];

  return (
    <div className="role-selector active">
      <div className="role-selector-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="role-selector-title">Selecciona tu tipo de cuenta</div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="role-options">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.value}
                className={`role-option ${selectedRole === role.value ? 'selected' : ''}`}
                onClick={() => onSelect(role.value)}
                style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}
              >
                <div style={{ marginTop: '2px' }}>
                  <Icon size={20} color={selectedRole === role.value ? 'var(--green-600)' : 'var(--text-muted)'} />
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div className="role-option-title">{role.title}</div>
                  <div className="role-option-desc">{role.description}</div>
                </div>
                {selectedRole === role.value && (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--green-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginTop: '2px'
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="role-selector-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirm" onClick={onClose}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
