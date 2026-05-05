import React, { useState } from 'react';
import { SAMPLE_RECIPES, CAT_COLORS, CAT_LABELS } from '../data/recipes';
import { PieChart } from './PieChart';
import { calcDist } from '../utils/math';

export function Recipes() {
  const [recipes, setRecipes] = useState(SAMPLE_RECIPES);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('TODOS');

  const filtered =
    filter === 'TODOS' ? recipes : recipes.filter((r) => r.category === filter);
  const rec = selected ? recipes.find((r) => r.id === selected) : null;

  return (
    <div>
      <div className="section-header mb-4">
        <div>
          <div className="section-title">Recetario Profesional</div>
          <div className="text-muted text-sm" style={{ marginTop: 3 }}>
            Recetas con desglose nutricional completo · SARA 2
          </div>
        </div>
        <button className="btn btn-primary">+ Nueva receta</button>
      </div>
      <div className="tabs mb-4">
        {['TODOS', 'DESAYUNO', 'ALMUERZO', 'MERIENDA', 'CENA'].map((f) => (
          <div
            key={f}
            className={`tab${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'TODOS' ? 'Todas' : CAT_LABELS[f] || f}
          </div>
        ))}
      </div>
      <div className="recipe-grid">
        {filtered.map((r) => {
          return (
            <div key={r.id} className="recipe-card" onClick={() => setSelected(r.id)}>
              <div
                className="recipe-card-img"
                style={{ background: CAT_COLORS[r.category] || 'var(--slate-100)' }}
              >
                {r.emoji || '🍽️'}
              </div>
              <div className="recipe-card-body">
                <span className="badge badge-green" style={{ marginBottom: 6, fontSize: 10 }}>
                  {CAT_LABELS[r.category]}
                </span>
                <div className="recipe-card-name">{r.name}</div>
                <div className="recipe-card-meta">
                  {r.servings} porción{r.servings > 1 ? 'es' : ''} ·{' '}
                  {r.prepTime + r.cookTime} min · {r.difficulty}
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                  {r.tags.slice(0, 2).map((t) => (
                    <span key={t} className="chip" style={{ fontSize: 10, padding: '2px 6px' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="macro-pill kcal">{r.kcalPerServing} kcal</span>
                  <span className="macro-pill prot">P: {r.proteinasPerServing}g</span>
                  <span className="macro-pill cho">CHO: {r.hidratosPerServing}g</span>
                  <span className="macro-pill lip">L: {r.lipidosPerServing}g</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {rec && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="modal modal-lg">
            <div className="modal-header">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: CAT_COLORS[rec.category],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  {rec.emoji}
                </div>
                <div>
                  <div className="modal-title">{rec.name}</div>
                  <div className="text-sm text-muted">
                    {CAT_LABELS[rec.category]} · {rec.servings} porción
                    {rec.servings > 1 ? 'es' : ''} · {rec.prepTime + rec.cookTime} min
                  </div>
                </div>
              </div>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid-2 gap-4">
                <div>
                  <div className="card-title mb-2">
                    <span className="icon">📊</span>Valor nutricional por porción
                  </div>
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg,var(--slate-800),var(--slate-700))',
                      borderRadius: 10,
                      padding: 16,
                      color: '#fff',
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                      <div
                        style={{
                          fontSize: 10,
                          color: 'var(--slate-400)',
                          textTransform: 'uppercase',
                          letterSpacing: '.1em',
                        }}
                      >
                        Calorías por porción
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 40 }}>
                        {rec.kcalPerServing}{' '}
                        <span style={{ fontSize: 16, fontWeight: 300, opacity: 0.6 }}>
                          kcal
                        </span>
                      </div>
                    </div>
                    <div className="pie-wrap" style={{ justifyContent: 'center' }}>
                      <PieChart
                        pct_p={rec.pctProteinas}
                        pct_l={rec.pctLipidos}
                        pct_h={rec.pctHidratos}
                        size={80}
                      />
                      <div className="pie-legend">
                        <div className="pie-legend-row">
                          <div
                            className="pie-legend-dot"
                            style={{ background: '#ef4444' }}
                          />
                          <span className="pie-pct" style={{ color: '#f87171' }}>
                            {rec.pctProteinas}%
                          </span>
                          <span className="pie-name">
                            Proteínas ({rec.proteinasPerServing}g)
                          </span>
                        </div>
                        <div className="pie-legend-row">
                          <div
                            className="pie-legend-dot"
                            style={{ background: '#3b82f6' }}
                          />
                          <span className="pie-pct" style={{ color: '#60a5fa' }}>
                            {rec.pctHidratos}%
                          </span>
                          <span className="pie-name">
                            Hidratos ({rec.hidratosPerServing}g)
                          </span>
                        </div>
                        <div className="pie-legend-row">
                          <div
                            className="pie-legend-dot"
                            style={{ background: '#f59e0b' }}
                          />
                          <span className="pie-pct" style={{ color: '#fbbf24' }}>
                            {rec.pctLipidos}%
                          </span>
                          <span className="pie-name">
                            Lípidos ({rec.lipidosPerServing}g)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-title mb-2">
                    <span className="icon">🏷️</span>Etiquetas
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {rec.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  {rec.notes && (
                    <div
                      style={{
                        background: 'var(--green-50)',
                        borderRadius: 8,
                        padding: 12,
                        marginTop: 12,
                        fontSize: 13,
                        color: 'var(--green-800)',
                        borderLeft: '3px solid var(--green-400)',
                      }}
                    >
                      💡 {rec.notes}
                    </div>
                  )}
                </div>
                <div>
                  <div className="card-title mb-2">
                    <span className="icon">📝</span>Preparación
                  </div>
                  {rec.preparation.map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 10,
                        padding: '8px 0',
                        borderBottom:
                          i < rec.preparation.length - 1
                            ? '1px solid var(--slate-100)'
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: 'var(--green-500)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: 'var(--slate-700)',
                          lineHeight: 1.5,
                        }}
                      >
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
