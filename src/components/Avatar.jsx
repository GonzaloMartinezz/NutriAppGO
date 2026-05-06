import React from 'react';

const gradients = [
  'linear-gradient(135deg, #22c55e 0%, #10b981 100%)', // Verde
  'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Azul
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Ámbar
  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Rojo
  'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // Púrpura
  'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', // Cyan
  'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', // Rosa
  'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', // Teal
];

export function Avatar({ name, size = 40, style = {} }) {
  // Generar gradiente consistente basado en el nombre
  const hash = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradientIndex = hash % gradients.length;
  const gradient = gradients[gradientIndex];

  // Obtener iniciales
  const initials = (name || '')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: size > 50 ? '16px' : '50%',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        flexShrink: 0,
        ...style
      }}
    >
      {initials}
    </div>
  );
}
