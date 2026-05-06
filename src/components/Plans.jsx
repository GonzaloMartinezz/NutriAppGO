import React, { useState } from 'react';
import { 
  Sun, 
  Utensils, 
  Coffee, 
  Moon, 
  Plus, 
  X, 
  Download, 
  Calendar,
  ChevronRight,
  ClipboardList,
  Target,
  Zap,
  TrendingUp,
  Search,
  ArrowLeft
} from 'lucide-react';
import { sumItems, calcItem, calcDist } from '../utils/math';
import { FoodSearchBar } from './FoodSearchBar';
import { Toast } from './Toast';

export function Plans({ patients }) {
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const MEALS = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
  
  const [activeDay, setActiveDay] = useState('Lunes');
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [targetKcal, setTargetKcal] = useState(2100);
  const [toast, setToast] = useState(null);
  const [addingTo, setAddingTo] = useState(null); // { day, meal }

  // Initial plan state: Day -> Meal -> Items
  const [plan, setPlan] = useState(() => {
    const initialPlan = {};
    DAYS.forEach(day => {
      initialPlan[day] = {};
      MEALS.forEach(meal => {
        initialPlan[day][meal] = [];
      });
    });
    // Add sample items to Monday Breakfast
    initialPlan['Lunes']['Desayuno'] = [
      { foodId: '1', foodName: 'Avena con Frutos Rojos', grams: 150, kcal: 185, proteinas_g: 5, lipidos_g: 3, hidratos_g: 32 },
      { foodId: '2', foodName: 'Yogur Griego', grams: 200, kcal: 120, proteinas_g: 10, lipidos_g: 4, hidratos_g: 8 }
    ];
    return initialPlan;
  });

  const activeDayPlan = plan[activeDay];

  const getMealTotals = (mealName) => {
    return sumItems(activeDayPlan[mealName]);
  };

  const getDayTotals = () => {
    const allDayItems = Object.values(activeDayPlan).flat();
    return sumItems(allDayItems);
  };

  const dayTotals = getDayTotals();
  const remainingKcal = targetKcal - dayTotals.kcal;
  const dist = calcDist(dayTotals.proteinas_g, dayTotals.lipidos_g, dayTotals.hidratos_g);

  const onAddFood = (food) => {
    if (!addingTo) return;
    const { day, meal } = addingTo;
    const newItem = calcItem(food, 100); // Default 100g
    
    setPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: [...prev[day][meal], newItem]
      }
    }));
    
    setAddingTo(null);
    setToast(`${food.nombre} added to ${meal}`);
  };

  const updateGrams = (meal, foodId, grams) => {
    const g = parseInt(grams) || 0;
    setPlan(prev => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        [meal]: prev[activeDay][meal].map(item => 
          item.foodId === foodId ? { ...item, grams: g, kcal: (item.kcal / item.grams) * g } : item
        )
      }
    }));
  };

  const removeFood = (meal, foodId) => {
    setPlan(prev => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        [meal]: prev[activeDay][meal].filter(item => item.foodId !== foodId)
      }
    }));
  };

  const getMealIcon = (mealName) => {
    switch(mealName) {
      case 'Desayuno': return <Sun size={20} />;
      case 'Almuerzo': return <Utensils size={20} />;
      case 'Merienda': return <Coffee size={20} />;
      case 'Cena': return <Moon size={20} />;
      default: return <Utensils size={20} />;
    }
  };

  return (
    <div className="plan-builder">
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      
      <div className="section-header" style={{ alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <h1 className="topbar-title" style={{ fontSize: 36, marginBottom: 8, color: 'var(--green-900)', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Constructor de Planes</h1>
          <p className="text-muted" style={{ fontSize: 16 }}>Diseña planes de alimentación personalizados y monitorea objetivos calóricos.</p>
          <h1 className="topbar-title" style={{ fontSize: '32px', marginBottom: '8px' }}>Planes Nutricionales</h1>
          <p className="text-muted">Diseño de pautas y distribución de macronutrientes semanal.</p>
        </div>
        <div className="grid-2 plans-targets" style={{ width: '400px' }}>
          <div className="card" style={{ padding: '12px 20px', background: 'var(--slate-50)', border: 'none' }}>
            <div className="stat-label" style={{ marginBottom: '4px' }}>Objetivo</div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>{targetKcal} <span style={{ fontSize: '12px' }}>kcal</span></div>
          </div>
          <div className="card" style={{ padding: '12px 20px', background: remainingKcal < 0 ? 'var(--red-50)' : 'var(--green-50)', border: 'none' }}>
            <div className="stat-label" style={{ marginBottom: '4px', color: remainingKcal < 0 ? 'var(--red-500)' : 'var(--green-600)' }}>{remainingKcal < 0 ? 'Exceso' : 'Restante'}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: remainingKcal < 0 ? 'var(--red-600)' : 'var(--green-700)' }}>{Math.abs(remainingKcal).toFixed(0)} <span style={{ fontSize: '12px' }}>kcal</span></div>
          </div>
        </div>
      </div>

      <div className="day-selector" style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {DAYS.map(day => (
            <button 
              key={day}
              className={`btn day-btn ${activeDay === day ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveDay(day)}
              style={{ 
                padding: '10px 18px', 
                borderRadius: '10px', 
                fontSize: '13px', 
                fontWeight: activeDay === day ? 700 : 600,
                background: activeDay === day ? 'var(--green-600)' : 'transparent',
                color: activeDay === day ? '#fff' : 'var(--text-muted)',
                border: 'none',
                transition: 'all 0.2s'
              }}
            >
              {day}
            </button>
          ))}
        </div>

      <div className="plan-grid-2col">
        <div className="meal-cards-column">
          {MEALS.map(mealName => (
            <div key={mealName} className="card meal-card" style={{ marginBottom: 24, padding: 32 }}>
              <div className="meal-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 className="card-title" style={{ fontSize: 20, color: 'var(--green-900)', marginBottom: 0, textTransform: 'none', letterSpacing: 'normal', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--accent)' }}>{getMealIcon(mealName)}</span> 
                  <span>{mealName}</span>
                </h3>
                <div style={{ background: 'var(--slate-100)', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--slate-700)' }}>
                  {getMealTotals(mealName).kcal.toFixed(0)} kcal
                </div>
              </div>
              
              {activeDayPlan[mealName].length > 0 ? (
                <div className="meal-table">
                  <div className="table-overflow">
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                    <tbody>
                      {activeDayPlan[mealName].map(item => (
                        <tr key={item.foodId} className="meal-item-row" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 40px', alignItems: 'center', marginBottom: 16 }}>
                          <td style={{ fontWeight: 500, fontSize: 14 }}>{item.foodName}</td>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="number" 
                              className="input" 
                              value={item.grams} 
                              onChange={(e) => updateGrams(mealName, item.foodId, e.target.value)}
                              style={{ width: '80%', textAlign: 'center', padding: '4px', height: 'auto' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.kcal.toFixed(0)}</td>
                          <td style={{ textAlign: 'center' }}><button onClick={() => removeFood(mealName, item.foodId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                  
                  <button className="btn-add-food" onClick={() => setAddingTo({ day: activeDay, meal: mealName })} style={{ background: 'none', border: 'none', color: '#064e3b', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                    <span>+</span> Add Food
                  </button>
                </div>
              ) : (
                <div className="empty-meal-box" style={{ border: '2px dashed var(--border)', borderRadius: '20px', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--slate-50)' }}>
                  <ClipboardList size={32} style={{ opacity: 0.2 }} />
                  <p className="text-muted" style={{ fontSize: 14, fontWeight: 500 }}>No hay alimentos añadidos</p>
                  <button className="btn btn-sm" onClick={() => setAddingTo({ day: activeDay, meal: mealName })} style={{ background: 'var(--green-600)', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Añadir Primero</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="summary-column">
          <div className="card summary-card" style={{ padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', position: 'sticky', top: '100px' }}>
            <h2 className="topbar-title" style={{ fontSize: 24, lineHeight: 1.1, marginBottom: 24, color: 'var(--green-900)', fontWeight: 800 }}>Objetivo Diario (VCT)</h2>

            <div className="vct-display" style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Calorías Totales</span>
                <div style={{ flex: 1 }}></div>
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--green-900)', fontFamily: 'var(--font-display)' }}>{dayTotals.kcal.toFixed(0)}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>/ {targetKcal}</span>
              </div>
              <div className="progress-bar-wrap" style={{ height: 12, background: 'var(--slate-100)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((dayTotals.kcal / targetKcal) * 100, 100)}%`, height: '100%', background: 'var(--green-600)', borderRadius: 99, transition: 'width 0.3s ease' }}></div>
              </div>
              <p style={{ fontSize: 13, color: remainingKcal < 0 ? 'var(--red-500)' : 'var(--text-muted)', fontWeight: 600, marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                {remainingKcal < 0 ? (
                  <>
                    <Zap size={14} />
                    <span>Exceso de {Math.abs(remainingKcal).toFixed(0)} kcal</span>
                  </>
                ) : (
                  <>
                    <Target size={14} />
                    <span>Faltan {remainingKcal.toFixed(0)} kcal</span>
                  </>
                )}
              </p>
            </div>

            <div style={{ height: 1, background: 'var(--border-light)', marginBottom: 32 }}></div>

            <div className="macro-circles" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
              {[
                { label: 'Prot.', pct: dist.pctP, grams: dayTotals.proteinas_g, color: 'var(--red-500)' },
                { label: 'Cho.', pct: dist.pctH, grams: dayTotals.hidratos_g, color: 'var(--green-600)' },
                { label: 'Lip.', pct: dist.pctL, grams: dayTotals.lipidos_g, color: 'var(--accent)' }
              ].map((m) => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div className="circle-progress" style={{ width: 64, height: 64, margin: '0 auto 12px', position: 'relative' }}>
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="var(--slate-100)" strokeWidth="6" />
                      <circle cx="32" cy="32" r="28" fill="none" stroke={m.color} strokeWidth="6" 
                        strokeDasharray={`${(m.pct / 100) * 176} 176`} strokeLinecap="round" transform="rotate(-90 32 32)" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
                    </svg>
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '11px', fontWeight: 800 }}>{m.pct.toFixed(0)}%</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>{m.grams.toFixed(0)}g</div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" onClick={() => window.print()} style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Download size={18} />
              <span>Guardar Plan como PDF</span>
            </button>
          </div>
        </div>
      </div>

      <button className="main-fab" onClick={() => setAddingTo({ day: activeDay, meal: 'Breakfast' })} style={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: 64, height: 64, background: '#064e3b', color: '#fff', borderRadius: 20, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px -6px rgba(6, 78, 59, 0.4)', border: 'none', cursor: 'pointer', zIndex: 1000 }}>
        +
      </button>

      {addingTo && (
        <div className="modal-overlay" onClick={() => setAddingTo(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 24, maxWidth: 500 }}>
            <h2 className="topbar-title" style={{ fontSize: 24, marginBottom: 16 }}>Add food to {addingTo.meal}</h2>
            <FoodSearchBar onSelect={onAddFood} placeholder="Search food items..." />
            <button className="btn btn-ghost" onClick={() => setAddingTo(null)} style={{ marginTop: 16, width: '100%' }}>Cancel</button>
          </div>
        </div>
      )}

      <style>{`
        .btn-day { background: #fff; border: 1px solid var(--border-color); padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px; color: var(--text-main); transition: all 0.2s; }
        .btn-day:hover { background: #f8fafc; border-color: var(--primary); }
        .btn-day-active { background: #f7fee7; border: 1.5px solid #064e3b; color: #064e3b; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; }
        .meal-card { border-radius: 24px; box-shadow: var(--shadow); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal { background: #fff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
}
