import React from 'react';
import { fmtDate } from '../utils/math';

export function WeightChart({ data, target }) {
  if (!data || data.length < 1)
    return (
      <div className="empty-state">
        <div className="empty-icon">📈</div>
        <div className="empty-text">Sin datos</div>
      </div>
    );
  const W = 340,
    H = 90,
    pad = 20;
  const weights = data.map((d) => d.weight);
  const minW = Math.min(...weights) - 2,
    maxW = Math.max(...weights) + 2;
  const pts = data.map((d, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (W - 2 * pad);
    const y = H - pad - ((d.weight - minW) / (maxW - minW)) * (H - 2 * pad);
    return { x, y, w: d.weight, d: d.date };
  });
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD =
    pts.length > 0
      ? `${pathD} L${pts[pts.length - 1].x},${H - pad} L${pts[0].x},${H - pad} Z`
      : '';
  return (
    <svg width={W} height={H} style={{ overflow: 'visible', width: '100%' }}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {areaD && <path d={areaD} fill="url(#wg)" />}
      <path
        d={pathD}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#22c55e" stroke="white" strokeWidth="2" />
          <title>{`${p.w}kg — ${fmtDate(p.d)}`}</title>
        </g>
      ))}
    </svg>
  );
}
