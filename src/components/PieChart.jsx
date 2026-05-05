import React from 'react';

export function PieChart({ pct_p, pct_l, pct_h, size = 100 }) {
  const data = [
    { v: pct_p, c: '#ef4444', n: 'Proteínas' },
    { v: pct_l, c: '#f59e0b', n: 'Lípidos' },
    { v: pct_h, c: '#3b82f6', n: 'H. de C.' },
  ];
  const total = data.reduce((a, d) => a + d.v, 0);
  if (total === 0)
    return (
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="#e2e8f0" />
      </svg>
    );
  let ang = -Math.PI / 2;
  const r = size / 2 - 2,
    cx = size / 2,
    cy = size / 2;
  const paths = data.map((d) => {
    const sweep = (d.v / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(ang),
      y1 = cy + r * Math.sin(ang);
    ang += sweep;
    const x2 = cx + r * Math.cos(ang),
      y2 = cy + r * Math.sin(ang);
    const laf = sweep > Math.PI ? 1 : 0;
    return {
      path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${laf},1 ${x2},${y2} Z`,
      color: d.color || d.c,
    };
  });
  return (
    <svg width={size} height={size}>
      {paths.map((p, i) => (
        <path key={i} d={p.path} fill={p.color} />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.5} fill="white" />
    </svg>
  );
}
