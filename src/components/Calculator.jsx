import React, { useState } from 'react';
import { FoodSearchBar } from './FoodSearchBar';
import { Toast } from './Toast';
import { PieChart } from './PieChart';
import { MacroBar } from './MacroBar';
import { SARA2_FOODS } from '../data/foods';
import { calcItem, sumItems, calcDist } from '../utils/math';

export function Calculator() {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [showMicro, setShowMicro] = useState(false);

  const addFood = (food) => {
    if (items.find((i) => i.foodId === food.id)) {
      setToast('Ya está en la lista');
      return;
    }
    setItems((prev) => [...prev, calcItem(food, 100)]);
  };

  const updateGrams = (foodId, grams) => {
    const g = parseInt(grams) || 0;
    const food = SARA2_FOODS.find((f) => f.id === foodId);
    if (!food) return;
    setItems((prev) =>
      prev.map((i) => (i.foodId === foodId ? calcItem(food, g) : i))
    );
  };

  const removeItem = (foodId) =>
    setItems((prev) => prev.filter((i) => i.foodId !== foodId));

  const totals = sumItems(items);
  const dist = calcDist(totals.proteinas_g, totals.lipidos_g, totals.hidratos_g);
  const clear = () => {
    setItems([]);
  };

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <div className="section-header mb-4">
        <div>
          <div className="section-title">Calculadora SARA 2</div>
          <div className="text-muted text-sm" style={{ marginTop: 3 }}>
            Análisis calórico y macronutricional · Tabla oficial argentina
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowMicro(!showMicro)}
          >
            🔬 {showMicro ? 'Ocultar' : 'Ver'} micronutrientes
          </button>
          <button className="btn btn-ghost btn-sm" onClick={clear}>
            🗑️ Limpiar
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-title">
          <span className="icon">🔍</span>Buscar y agregar alimento
        </div>
        <FoodSearchBar onSelect={addFood} placeholder="Ej: pollo, arroz, zanahoria..." />
        <div className="text-sm text-muted mt-2">
          Escribí al menos 2 letras · {SARA2_FOODS.length} alimentos disponibles
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid-2 gap-4">
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-title">
              <span className="icon">🍽️</span>Tabla de análisis
            </div>
            <div className="table-wrap">
              <table className="calc-table">
                <thead>
                  <tr>
                    <th>Alimento</th>
                    <th>Grupo</th>
                    <th style={{ textAlign: 'right' }}>Gramos</th>
                    <th style={{ textAlign: 'right' }}>Kcal</th>
                    <th style={{ textAlign: 'right' }}>Prot</th>
                    <th style={{ textAlign: 'right' }}>Líp</th>
                    <th style={{ textAlign: 'right' }}>CHO</th>
                    <th style={{ textAlign: 'right' }}>Fibra</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => {
                    const food = SARA2_FOODS.find((f) => f.id === it.foodId);
                    return (
                      <tr key={it.foodId}>
                        <td className="food-name">{it.foodName}</td>
                        <td>
                          <span className="text-sm text-muted">
                            {food?.grupo || ''}
                          </span>
                        </td>
                        <td className="num">
                          <input
                            className="grams-input"
                            type="number"
                            min="0"
                            max="2000"
                            value={it.grams}
                            onChange={(e) => updateGrams(it.foodId, e.target.value)}
                          />
                        </td>
                        <td className="num">
                          <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>
                            {it.kcal.toFixed(0)}
                          </span>
                        </td>
                        <td className="num">
                          <span style={{ color: '#ef4444', fontWeight: 500 }}>
                            {it.proteinas_g.toFixed(1)}g
                          </span>
                        </td>
                        <td className="num">
                          <span style={{ color: '#f59e0b', fontWeight: 500 }}>
                            {it.lipidos_g.toFixed(1)}g
                          </span>
                        </td>
                        <td className="num">
                          <span style={{ color: '#3b82f6', fontWeight: 500 }}>
                            {it.hidratos_g.toFixed(1)}g
                          </span>
                        </td>
                        <td className="num">
                          <span style={{ color: '#10b981', fontWeight: 500 }}>
                            {it.fibra_g.toFixed(1)}g
                          </span>
                        </td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={() => removeItem(it.foodId)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: 'var(--slate-50)' }}>
                    <td colSpan={2} style={{ fontWeight: 700, fontSize: 13 }}>
                      TOTAL ({items.length} alimentos)
                    </td>
                    <td className="num" style={{ fontWeight: 700 }}>
                      {items.reduce((a, i) => a + i.grams, 0)}g
                    </td>
                    <td className="num" style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                      {totals.kcal.toFixed(0)}
                    </td>
                    <td className="num" style={{ fontWeight: 700, color: '#ef4444' }}>
                      {totals.proteinas_g.toFixed(1)}g
                    </td>
                    <td className="num" style={{ fontWeight: 700, color: '#f59e0b' }}>
                      {totals.lipidos_g.toFixed(1)}g
                    </td>
                    <td className="num" style={{ fontWeight: 700, color: '#3b82f6' }}>
                      {totals.hidratos_g.toFixed(1)}g
                    </td>
                    <td className="num" style={{ fontWeight: 700, color: '#10b981' }}>
                      {totals.fibra_g.toFixed(1)}g
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="result-box">
            <div className="result-vct-label">Valor Calórico Total</div>
            <div className="result-vct">
              {dist.VCT.toFixed(0)}{' '}
              <span style={{ fontSize: 20, fontWeight: 300, opacity: 0.7 }}>
                kcal
              </span>
            </div>
            <div
              className="divider"
              style={{ borderColor: 'rgba(255,255,255,.1)', margin: '14px 0' }}
            />
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                  }}
                >
                  Proteínas
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f87171' }}>
                  {dist.pctP}%
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
                  {totals.proteinas_g.toFixed(1)}g
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                  }}
                >
                  Lípidos
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fbbf24' }}>
                  {dist.pctL}%
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
                  {totals.lipidos_g.toFixed(1)}g
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                  }}
                >
                  Hidratos
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#60a5fa' }}>
                  {dist.pctH}%
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
                  {totals.hidratos_g.toFixed(1)}g
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="icon">📊</span>Distribución calórica
            </div>
            <div className="pie-wrap">
              <PieChart
                pct_p={dist.pctP}
                pct_l={dist.pctL}
                pct_h={dist.pctH}
                size={110}
              />
              <div className="pie-legend">
                <div className="pie-legend-row">
                  <div className="pie-legend-dot" style={{ background: '#ef4444' }} />
                  <span className="pie-pct">{dist.pctP}%</span>
                  <span className="pie-name">Proteínas</span>
                </div>
                <div className="pie-legend-row">
                  <div className="pie-legend-dot" style={{ background: '#3b82f6' }} />
                  <span className="pie-pct">{dist.pctH}%</span>
                  <span className="pie-name">Hidratos</span>
                </div>
                <div className="pie-legend-row">
                  <div className="pie-legend-dot" style={{ background: '#f59e0b' }} />
                  <span className="pie-pct">{dist.pctL}%</span>
                  <span className="pie-name">Lípidos</span>
                </div>
                <div className="pie-legend-row">
                  <div className="pie-legend-dot" style={{ background: '#10b981' }} />
                  <span className="pie-pct">{totals.fibra_g.toFixed(1)}g</span>
                  <span className="pie-name">Fibra</span>
                </div>
              </div>
            </div>
            <div className="divider" />
            <MacroBar
              prot={totals.proteinas_g}
              lip={totals.lipidos_g}
              cho={totals.hidratos_g}
            />
          </div>

          {showMicro && (
            <div className="card">
              <div className="card-title">
                <span className="icon">🔬</span>Micronutrientes (total)
              </div>
              <table style={{ width: '100%' }}>
                <tbody>
                  {[
                    ['Calcio', totals.calcio_mg, 'mg', 1000],
                    ['Hierro', totals.hierro_mg, 'mg', 8],
                    ['Sodio', totals.sodio_mg, 'mg', 2300],
                  ].map(([n, v, u, ref]) => (
                    <tr key={n} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                      <td style={{ padding: '8px 4px', fontSize: 13 }}>{n}</td>
                      <td
                        style={{ textAlign: 'right', fontWeight: 600, fontSize: 13 }}
                      >
                        {v.toFixed(1)} {u}
                      </td>
                      <td style={{ width: 120, paddingLeft: 12 }}>
                        <div className="progress-wrap">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.min((v / ref) * 100, 100)}%`,
                              background:
                                v / ref > 1
                                  ? '#22c55e'
                                  : v / ref > 0.5
                                  ? '#f59e0b'
                                  : '#ef4444',
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: 'var(--slate-400)',
                            marginTop: 2,
                          }}
                        >
                          {((v / ref) * 100).toFixed(0)}% recomendado
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🥗</div>
            <div className="empty-text">Agregá alimentos para comenzar el análisis</div>
            <div className="empty-sub">Buscá por nombre, grupo o tipo de alimento</div>
          </div>
        </div>
      )}
    </div>
  );
}
