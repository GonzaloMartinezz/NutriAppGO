import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Download, 
  Info, 
  Plus, 
  X, 
  PieChart, 
  FileText,
  Calculator as CalcIcon,
  Zap,
  Dna,
  Droplets,
  Wheat,
  User,
  Trash2,
  Clock,
  Search
} from 'lucide-react';
import { FoodSearchBar } from './FoodSearchBar';
import { Toast } from './Toast';
import { SARA2_FOODS } from '../data/foods';
import { calcItem, sumItems, calcDist } from '../utils/math';

const MEAL_TYPES = ['Desayuno', 'Colación', 'Almuerzo', 'Snack', 'Cena'];

export function Calculator({ onSave, triggerConfirm }) {
  const [items, setItems] = useState([
    { foodId: '1', foodName: 'Pollo, pechuga', grams: 100, proteinas_g: 34.5, lipidos_g: 1.8, hidratos_g: 0, fibra_g: 0, colest_mg: 87, ag_sat: 0.5, ag_mono: 0.6, ag_poli: 0.4, ag_trans: 0 },
    { foodId: '2', foodName: 'Arroz, blanco', grams: 80, proteinas_g: 5.6, lipidos_g: 0.4, hidratos_g: 63.2, fibra_g: 1.0, colest_mg: 0, ag_sat: 0.1, ag_mono: 0.1, ag_poli: 0.1, ag_trans: 0 }
  ]);
  const [patientName, setPatientName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [mealType, setMealType] = useState('Almuerzo');
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
    const g = parseFloat(grams) || 0;
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
    grams: items.reduce((a, b) => a + (parseFloat(b.grams) || 0), 0),
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

  const handleSave = () => {
    if (!patientName || !patientLastName) {
      setToast('Por favor, ingresa nombre y apellido');
      return;
    }
    const calculation = {
      id: `CALC-${Date.now()}`,
      mealType,
      date: new Date().toISOString(),
      items: [...items],
      totals: { ...totals },
      vct,
      macros: { pctP, pctC, pctL, kcalProt, kcalCho, kcalLip }
    };

    const development = {
      patientName,
      patientLastName,
      calculation
    };

    onSave(development);
    triggerConfirm('Cálculo Guardado', `Se ha añadido "${mealType}" al desarrollo de ${patientName} ${patientLastName}.`);
    
    // Clear current items but keep patient name for further calculations if needed
    setItems([]);
  };

  return (
    <div className="calculator-clinical page">
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      
      <div className="clinical-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--green-700)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Software Clínico NutriApp</span>
          <h1 className="topbar-title" style={{ color: 'var(--green-900)', marginTop: '4px', fontWeight: 800 }}>Cálculo de Fórmula Desarrollada</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ gap: '8px', padding: '10px 20px' }}>
            <Save size={18} />
            <span>Guardar en Mis Desarrollos</span>
          </button>
        </div>
      </div>

      {/* Patient & Meal Context */}
      <div className="card" style={{ marginBottom: '32px', padding: '24px' }}>
        <div className="grid-3 gap-6">
          <div className="form-group">
            <label className="label">Nombre del Paciente</label>
            <div className="input-icon">
              <span className="icon"><User size={16} /></span>
              <input 
                type="text" 
                className="input" 
                placeholder="Nombre" 
                value={patientName} 
                onChange={(e) => setPatientName(e.target.value)} 
              />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Apellido</label>
            <div className="input-icon">
              <span className="icon"><User size={16} /></span>
              <input 
                type="text" 
                className="input" 
                placeholder="Apellido" 
                value={patientLastName} 
                onChange={(e) => setPatientLastName(e.target.value)} 
              />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Categoría de Comida</label>
            <div className="input-icon">
              <span className="icon"><Clock size={16} /></span>
              <select className="select input" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', borderRadius: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green-900)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Plus size={20} className="text-accent" />
            <span>Ingredientes - {mealType}</span>
          </h3>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label className="label" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <Search size={16} color="var(--green-600)" />
            <span>Buscador de Alimentos SARA 2</span>
          </label>
          <FoodSearchBar onSelect={addFood} placeholder="Escribe para buscar (ej: Pollo, Arroz, Manzana...)" />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Info size={14} />
            <span>Los valores se calculan automáticamente por cada 100g base.</span>
          </p>
        </div>

        <div className="table-overflow" style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table className="clinical-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--slate-50)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '12px', fontWeight: 700 }}>Alimento</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>Cant. (g)</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>Prot. (g)</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>Líp. (g)</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>Carb. (g)</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>Fibra</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>Colest.</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>Sat.</th>
                <th style={{ padding: '12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.foodId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-main)' }}>{it.foodName}</td>
                  <td style={{ padding: '12px' }}>
                    <input 
                      type="number" 
                      value={it.grams} 
                      onChange={(e) => updateGrams(it.foodId, e.target.value)} 
                      style={{ width: '70px', padding: '6px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg-input)', color: 'var(--text-main)' }} 
                    />
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.proteinas_g.toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.lipidos_g.toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.hidratos_g.toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.fibra_g.toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.colest_mg.toFixed(0)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{it.ag_sat.toFixed(1)}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => removeItem(it.foodId)} style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}>
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ borderTop: '2px solid var(--border)' }}>
              <tr style={{ background: 'var(--slate-50)', fontWeight: 800, color: 'var(--green-900)' }}>
                <td style={{ padding: '12px' }}>TOTALES {mealType.toUpperCase()}:</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{totals.grams.toFixed(0)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{totals.prot.toFixed(1)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{totals.lip.toFixed(1)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{totals.cho.toFixed(1)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{totals.fibra.toFixed(1)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{totals.colest.toFixed(0)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{totals.sat.toFixed(1)}</td>
                <td></td>
              </tr>
              <tr style={{ background: 'var(--green-50)', fontWeight: 800, color: 'var(--green-800)', borderTop: '1px solid var(--green-100)' }}>
                <td style={{ padding: '12px' }}>CALORÍAS {mealType.toUpperCase()} (kcal):</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>-</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{kcalProt.toFixed(0)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{kcalLip.toFixed(0)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{kcalCho.toFixed(0)}</td>
                <td colSpan="4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="card" style={{ padding: '32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-900)', marginBottom: '16px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PieChart size={24} className="text-accent" />
              <span>Fórmula Calórica de la Comida</span>
            </h2>
            <p className="text-muted" style={{ maxWidth: '600px' }}>Distribución porcentual de la energía aportada por {mealType}.</p>
          </div>
          
          <div className="vct-box" style={{ background: 'var(--green-600)', padding: '24px 40px', borderRadius: '20px', color: '#fff', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.9 }}>VCT {mealType}</span>
            <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: '4px' }}>{vct.toFixed(0)} <span style={{ fontSize: '16px' }}>kcal</span></div>
          </div>
        </div>

        <div className="macro-distribution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div className="macro-list-clinical" style={{ display: 'grid', gap: '16px' }}>
            {[
              { label: 'Proteínas', pct: pctP, kcal: kcalProt, grams: totals.prot, color: 'var(--amber-500)', icon: <Dna size={18} />, factor: 4 },
              { label: 'Hidratos de Carbono', pct: pctC, kcal: kcalCho, grams: totals.cho, color: 'var(--green-600)', icon: <Wheat size={18} />, factor: 4 },
              { label: 'Lípidos (Grasas)', pct: pctL, kcal: kcalLip, grams: totals.lip, color: 'var(--blue-500)', icon: <Droplets size={18} />, factor: 9 }
            ].map(m => (
              <div key={m.label} style={{ background: 'var(--slate-50)', padding: '16px 20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ color: m.color }}>{m.icon}</div>
                   <div>
                     <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>{m.label}</div>
                     <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.grams.toFixed(1)}g × {m.factor}</div>
                   </div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '18px', fontWeight: 800, color: m.color }}>{m.pct.toFixed(1)}%</div>
                   <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{m.kcal.toFixed(0)} kcal</div>
                 </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="macro-chart-container" style={{ position: 'relative', width: '240px', height: '240px' }}>
              <svg width="240" height="240" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="85" fill="none" stroke="var(--slate-100)" strokeWidth="25" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="var(--amber-500)" strokeWidth="25" 
                  strokeDasharray={`${(pctP / 100) * 534} 534`} transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="var(--green-600)" strokeWidth="25" 
                  strokeDasharray={`${(pctC / 100) * 534} 534`} transform={`rotate(${(pctP / 100) * 360 - 90} 100 100)`} />
                <circle cx="100" cy="100" r="85" fill="none" stroke="var(--blue-500)" strokeWidth="25" 
                  strokeDasharray={`${(pctL / 100) * 534} 534`} transform={`rotate(${((pctP + pctC) / 100) * 360 - 90} 100 100)`} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
