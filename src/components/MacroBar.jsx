import React from 'react';

export function MacroBar({ prot, lip, cho, large }) {
  const tot = prot + lip + cho;
  if (tot === 0) return null;
  return (
    <div>
      <div className={`macro-bar${large ? ' macro-bar-lg' : ''}`}>
        <div
          className="macro-bar-seg"
          style={{ width: `${(prot / tot) * 100}%`, background: '#ef4444' }}
        />
        <div
          className="macro-bar-seg"
          style={{ width: `${(cho / tot) * 100}%`, background: '#3b82f6' }}
        />
        <div
          className="macro-bar-seg"
          style={{ width: `${(lip / tot) * 100}%`, background: '#f59e0b' }}
        />
      </div>
      <div className="macro-legend">
        <span className="macro-legend-item">
          <span className="macro-dot" style={{ background: '#ef4444' }} /> Prot{' '}
          {prot.toFixed(1)}g
        </span>
        <span className="macro-legend-item">
          <span className="macro-dot" style={{ background: '#3b82f6' }} /> CHO{' '}
          {cho.toFixed(1)}g
        </span>
        <span className="macro-legend-item">
          <span className="macro-dot" style={{ background: '#f59e0b' }} /> Líp{' '}
          {lip.toFixed(1)}g
        </span>
      </div>
    </div>
  );
}
