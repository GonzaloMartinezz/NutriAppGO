import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SARA2_FOODS } from '../data/foods';

export function FoodSearchBar({ onSelect, placeholder = 'Buscar alimento SARA 2...' }) {
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
      setHi((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHi((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && results[hi]) {
      pick(results[hi]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="food-search-wrap" ref={ref}>
      <div className="input-icon">
        <span className="icon">🔍</span>
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
        />
      </div>
      {open && results.length > 0 && (
        <div className="food-dropdown">
          {results.map((f, i) => (
            <div
              key={f.id}
              className={`food-option${i === hi ? ' highlighted' : ''}`}
              onMouseDown={() => pick(f)}
              onMouseEnter={() => setHi(i)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div className="food-option-name">{f.nombre}</div>
                  <div className="food-option-meta">{f.grupo}</div>
                </div>
                <div className="food-option-kcal">{f.energia_kcal} kcal/100g</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
