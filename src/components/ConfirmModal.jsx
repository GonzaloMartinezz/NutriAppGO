import React from 'react';

export function ConfirmModal({ isOpen, title, message, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
      <div className="modal" style={{ 
        maxWidth: '400px', 
        textAlign: 'center', 
        padding: '40px', 
        borderRadius: '32px',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        animation: 'modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'var(--green-100)', 
          color: 'var(--green-600)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '40px', 
          margin: '0 auto 24px',
          boxShadow: '0 8px 16px rgba(34,197,94,0.2)'
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>{message}</p>
        
        <button 
          className="btn btn-primary" 
          onClick={onConfirm}
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: '16px', 
            fontSize: '16px', 
            fontWeight: 800,
            background: 'var(--green-600)',
            boxShadow: '0 4px 12px rgba(34,197,94,0.3)'
          }}
        >
          Aceptar Cambios
        </button>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes modalScaleUp {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `}} />
      </div>
    </div>
  );
}
