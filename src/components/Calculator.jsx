import React, { useState } from 'react';
import { FoodSearchBar } from './FoodSearchBar';
import { Toast } from './Toast';
import { SARA2_FOODS } from '../data/foods';
import { calcItem, sumItems, calcDist } from '../utils/math';

export function Calculator() {
  const [items, setItems] = useState([
    { foodId: '1', foodName: 'Pollo, pechuga', grams: 100, proteinas_g: 34.5, lipidos_g: 1.8, hidratos_g: 0, fibra_g: 0, colest_mg: 87, ag_sat: 0.5, ag_mono: 0.6, ag_poli: 0.4, ag_trans: 0 },
    { foodId: '2', foodName: 'Arroz, blanco', grams: 80, proteinas_g: 5.6, lipidos_g: 0.4, hidratos_g: 63.2, fibra_g: 1.0, colest_mg: 0, ag_sat: 0.1, ag_mono: 0.1, ag_poli: 0.1, ag_trans: 0 }
  ]);
  const [toast, setToast] = useState(null);

  const addFood = (food) => {
    if (items.find((i) => i.foodId === food.id)) {
      setToast('Ya está en la lista');
      return;
    }
    const newItem = {
      foodId: food.id,
      foodName: food.nombre,
      grams: 100,
      proteinas_g: food.proteinas_g,
      lipidos_g: food.lipidos_g,
      hidratos_g: food.hidratos_g,
      fibra_g: food.fibra_g,
      colest_mg: food.colesterol_mg || 0,
      ag_sat: food.ag_sat || 0,
      ag_mono: food.ag_mono || 0,
      ag_poli: food.ag_poli || 0,
      ag_trans: food.ag_trans || 0
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateGrams = (foodId, grams) => {
    const g = parseInt(grams) || 0;
    setItems((prev) =>
      prev.map((i) => {
        if (i.foodId === foodId) {
          const ratio = g / 100;
          const original = SARA2_FOODS.find(f => f.id === foodId) || i;
          return {
            ...i,
            grams: g,
            proteinas_g: original.proteinas_g * ratio,
            lipidos_g: original.lipidos_g * ratio,
            hidratos_g: original.hidratos_g * ratio,
            fibra_g: original.fibra_g * ratio,
            colest_mg: (original.colesterol_mg || 0) * ratio,
            ag_sat: (original.ag_sat || 0) * ratio,
            ag_mono: (original.ag_mono || 0) * ratio,
            ag_poli: (original.ag_poli || 0) * ratio,
            ag_trans: (original.ag_trans || 0) * ratio
          };
        }
        return i;
      })
    );
  };

  const removeItem = (foodId) => setItems((prev) => prev.filter((i) => i.foodId !== foodId));

  const totals = {
    grams: items.reduce((a, b) => a + b.grams, 0),
    prot: items.reduce((a, b) => a + b.proteinas_g, 0),
    lip: items.reduce((a, b) => a + b.lipidos_g, 0),
    cho: items.reduce((a, b) => a + b.hidratos_g, 0),
    fibra: items.reduce((a, b) => a + b.fibra_g, 0),
    colest: items.reduce((a, b) => a + b.colest_mg, 0),
    sat: items.reduce((a, b) => a + b.ag_sat, 0),
    mono: items.reduce((a, b) => a + b.ag_mono, 0),
    poli: items.reduce((a, b) => a + b.ag_poli, 0),
    trans: items.reduce((a, b) => a + b.ag_trans, 0)
  };

  const kcalProt = totals.prot * 4;
  const kcalCho = totals.cho * 4;
  const kcalLip = totals.lip * 9;
  const vct = kcalProt + kcalCho + kcalLip;

  const pctP = vct > 0 ? (kcalProt / vct) * 100 : 0;
  const pctC = vct > 0 ? (kcalCho / vct) * 100 : 0;
  const pctL = vct > 0 ? (kcalLip / vct) * 100 : 0;

  return (
    <div className="calculator-clinical">
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      
      <div className="clinical-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Herramienta Clínica</span>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#064e3b', marginTop: '8px' }}>Software de Fórmula Desarrollada - Tabla SARA 2</h1>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>💾</span> Guardar Fórmula
          </button>
          <button className="btn" style={{ background: '#064e3b', color: '#fff', padding: '14px 28px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
            <span>📥</span> Exportar PDF
          </button>
        </div>
      </div>

      <div className="info-box" style={{ background: '#f0fdf4', borderLeft: '4px solid #064e3b', padding: '24px', borderRadius: '16px', marginBottom: '40px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '24px', background: '#fff', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>ℹ️</span>
        <div>
          <h4 style={{ fontWeight: 700, color: '#064e3b', marginBottom: '8px' }}>Cálculo Basado en Tabla SARA 2</h4>
          <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6 }}>Los valores nutricionales se calculan automáticamente utilizando una regla de tres simple, basándose en la composición estándar por 100g de alimento según la base de datos SARA.</p>
        </div>
      </div>

      <div className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
        <div className="calc-table-card">
          <div className="card" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#064e3b' }}>Ingredientes de la Fórmula</h3>
              <button className="btn-add-food" onClick={() => {}} style={{ background: 'none', border: 'none', color: '#064e3b', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textTransform: 'uppercase' }}>
                <span>⊕</span> Añadir Alimento
              </button>
            </div>

            <FoodSearchBar onSelect={addFood} placeholder="Buscar y agregar..." />

            <div className="table-overflow" style={{ overflowX: 'auto', marginTop: '24px' }}>
              <table className="clinical-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Alimento</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Cant. (g)</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Prot. (g)</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Líp. (g)</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Colest.</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Sat.</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Mono.</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Poli.</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Carb.</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Fibra</th>
                    <th style={{ padding: '12px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.foodId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 600 }}>{it.foodName}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <input type="number" value={it.grams} onChange={(e) => updateGrams(it.foodId, e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }} />
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>{it.proteinas_g.toFixed(1)}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>{it.lipidos_g.toFixed(1)}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>{it.colest_mg.toFixed(0)}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>{it.ag_sat.toFixed(1)}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>{it.ag_mono.toFixed(1)}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>{it.ag_poli.toFixed(1)}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>{it.hidratos_g.toFixed(1)}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>{it.fibra_g.toFixed(1)}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                        <button onClick={() => removeItem(it.foodId)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#f8fafc', fontWeight: 800, color: '#064e3b' }}>
                    <td style={{ padding: '16px 12px' }}>Totales:</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>{totals.grams}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>{totals.prot.toFixed(1)}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>{totals.lip.toFixed(1)}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>{totals.colest.toFixed(0)}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>{totals.sat.toFixed(1)}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>{totals.mono.toFixed(1)}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>{totals.poli.toFixed(1)}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>{totals.cho.toFixed(1)}</td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>{totals.fibra.toFixed(1)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="formula-sidebar">
          <div className="card" style={{ padding: '40px', borderRadius: '32px', textAlign: 'center', height: '100%' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#064e3b', marginBottom: '40px', textAlign: 'left' }}>Fórmula Calórica</h2>
            
            <div className="vct-box" style={{ background: '#f7fee7', padding: '32px', borderRadius: '24px', marginBottom: '48px', border: '1px solid #bef264' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#3f6212', letterSpacing: '0.1em' }}>Kcal Totales</span>
              <div style={{ fontSize: '64px', fontWeight: 800, color: '#4d1d95', marginTop: '8px' }}>{vct.toFixed(1)}</div>
            </div>

            <div className="macro-donut-wrap" style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 40px' }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                {/* Simplified Donut logic for demo */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#064e3b" strokeWidth="20" strokeDasharray={`${(pctP / 100) * 502} 502`} strokeLinecap="round" transform="rotate(-90 100 100)" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Macros</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#064e3b' }}>Atwater</span>
              </div>
            </div>

            <div className="macro-list-clinical" style={{ textAlign: 'left', display: 'grid', gap: '24px' }}>
              {[
                { label: 'Proteínas', pct: pctP, kcal: kcalProt, grams: totals.prot, color: '#064e3b', factor: 4 },
                { label: 'Carbohidratos', pct: pctC, kcal: kcalCho, grams: totals.cho, color: '#0891b2', factor: 4 },
                { label: 'Lípidos', pct: pctL, kcal: kcalLip, grams: totals.lip, color: '#4d1d95', factor: 9 }
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: m.color }}></div>
                     <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{m.label} ({m.pct.toFixed(1)}%)</span>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>{m.kcal.toFixed(1)} kcal</div>
                     <div style={{ fontSize: '11px', color: '#64748b' }}>{m.grams.toFixed(1)}g × {m.factor}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
