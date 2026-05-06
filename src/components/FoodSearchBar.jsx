import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ChevronRight, Info } from 'lucide-react';
import { SARA2_FOODS } from '../data/foods';

export function FoodSearchBar({ onSelect, placeholder = 'Buscar alimento en la tabla SARA 2...' }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const ref = useRef();

  const results = useMemo(() => {
    if (q.length < 2) return [];
    const lq = q.toLowerCase();
    return SARA2_FOODS.filter(
      (f) =>
        f.nombre.toLowerCase().includes(lq) ||
        f.grupo.toLowerCase().includes(lq)
    ).slice(0, 10);
  }, [q]);

  useEffect(() => {
    if (results.length > 0) setOpen(true);
    else setOpen(false);
  }, [results]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pick = (food) => {
    onSelect(food);
    setQ('');
    setOpen(false);
  };

  const keydown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHi((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && results[hi]) {
      pick(results[hi]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="food-search-wrap" ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div className="input-icon" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <span className="icon" style={{ color: 'var(--green-600)' }}><Search size={20} /></span>
        <input
          className="input"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setHi(0);
          }}
          onKeyDown={keydown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          style={{ 
            height: '48px', 
            fontSize: '15px', 
            borderRadius: '14px', 
            paddingLeft: '48px',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-input)'
          }}
        />
      </div>

      {open && results.length > 0 && (
        <div className="food-dropdown" style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          background: 'var(--bg-card)', 
          borderRadius: '16px', 
          marginTop: '8px', 
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', 
          zIndex: 100,
          border: '1px solid var(--border-light)',
          overflow: 'hidden',
          padding: '8px'
        }}>
          {results.map((f, i) => (
            <div
              key={f.id}
              onMouseDown={() => pick(f)}
              onMouseEnter={() => setHi(i)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                background: i === hi ? 'var(--green-50)' : 'transparent',
                transition: 'all 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  color: i === hi ? 'var(--green-900)' : 'var(--text-main)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {f.nombre}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{f.grupo}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 800, 
                  color: 'var(--green-700)', 
                  background: 'var(--green-100)', 
                  padding: '4px 10px', 
                  borderRadius: '6px' 
                }}>
                  {f.energia_kcal} kcal
                </div>
                <ChevronRight size={16} color={i === hi ? 'var(--green-600)' : 'var(--slate-300)'} />
              </div>
            </div>
          ))}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-light)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={14} color="var(--slate-400)" />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Selecciona con Enter o haciendo click</span>
          </div>
        </div>
      )}
    </div>
  );
}
