import React, { useState } from 'react';
import { sumItems, calcItem, calcDist } from '../utils/math';
import { FoodSearchBar } from './FoodSearchBar';
import { Toast } from './Toast';

export function Plans({ patients }) {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const MEALS = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
  
  const [activeDay, setActiveDay] = useState('Monday');
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
    initialPlan['Monday']['Breakfast'] = [
      { foodId: '1', foodName: 'Oatmeal with Berries', grams: 150, kcal: 185, proteinas_g: 5, lipidos_g: 3, hidratos_g: 32 },
      { foodId: '2', foodName: 'Greek Yogurt', grams: 200, kcal: 120, proteinas_g: 10, lipidos_g: 4, hidratos_g: 8 }
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

  return (
    <div className="plan-builder">
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      
      <div className="section-header" style={{ alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <h1 className="topbar-title" style={{ fontSize: 36, marginBottom: 8 }}>Nutritional Plan Builder</h1>
          <p className="text-muted" style={{ fontSize: 16 }}>Design personalized meal plans and monitor patient caloric targets.</p>
        </div>
        
        <div className="day-tabs-container" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {DAYS.map(day => (
            <button 
              key={day}
              className={`btn ${activeDay === day ? 'btn-day-active' : 'btn-day'}`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="plan-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        <div className="meal-cards-column">
          {MEALS.map(mealName => (
            <div key={mealName} className="card meal-card" style={{ marginBottom: 24, padding: 32 }}>
              <div className="meal-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 className="card-title" style={{ fontSize: 20, color: '#064e3b', marginBottom: 0, textTransform: 'none', letterSpacing: 'normal' }}>
                  <span className="icon">{mealName === 'Breakfast' ? '☀️' : mealName === 'Lunch' ? '🍴' : mealName === 'Snack' ? '☕' : '🌙'}</span> {mealName}
                </h3>
                <span className="text-muted" style={{ fontSize: 13 }}>Total: {getMealTotals(mealName).kcal.toFixed(0)} kcal</span>
              </div>
              
              {activeDayPlan[mealName].length > 0 ? (
                <div className="meal-table">
                  <div className="meal-table-header" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 40px', paddingBottom: 12, borderBottom: '1px solid var(--border-color)', marginBottom: 16, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                    <div>Food Item</div>
                    <div style={{ textAlign: 'center' }}>Grams</div>
                    <div style={{ textAlign: 'center' }}>Kcal</div>
                    <div></div>
                  </div>
                  
                  {activeDayPlan[mealName].map(item => (
                    <div key={item.foodId} className="meal-item-row" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 40px', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{item.foodName}</div>
                      <div style={{ textAlign: 'center' }}>
                        <input 
                          type="number" 
                          className="input" 
                          value={item.grams} 
                          onChange={(e) => updateGrams(mealName, item.foodId, e.target.value)}
                          style={{ width: '80%', textAlign: 'center', padding: '4px', height: 'auto' }}
                        />
                      </div>
                      <div style={{ textAlign: 'center', fontWeight: 600 }}>{item.kcal.toFixed(0)}</div>
                      <button onClick={() => removeFood(mealName, item.foodId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                  
                  <button className="btn-add-food" onClick={() => setAddingTo({ day: activeDay, meal: mealName })} style={{ background: 'none', border: 'none', color: '#064e3b', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                    <span>+</span> Add Food
                  </button>
                </div>
              ) : (
                <div className="empty-meal-box" style={{ border: '2px dashed var(--border-color)', borderRadius: 16, padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <span style={{ fontSize: 24 }}>📋</span>
                  <p className="text-muted" style={{ fontSize: 14 }}>No food added yet</p>
                  <button className="btn" onClick={() => setAddingTo({ day: activeDay, meal: mealName })} style={{ background: '#064e3b', color: '#fff', padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Add First Item</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="summary-column">
          <div className="card summary-card" style={{ padding: 32, borderRadius: 24, border: '1px solid var(--border-color)', position: 'sticky', top: 80 }}>
            <h2 className="topbar-title" style={{ fontSize: 28, lineHeight: 1.1, marginBottom: 24 }}>Patient Target (VCT)</h2>

            <div className="vct-display" style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Total Calories</span>
                <div style={{ flex: 1 }}></div>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#064e3b' }}>{dayTotals.kcal.toFixed(0)}</span>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/ {targetKcal} kcal</span>
              </div>
              <div className="progress-bar-wrap" style={{ height: 12, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((dayTotals.kcal / targetKcal) * 100, 100)}%`, height: '100%', background: '#064e3b', borderRadius: 99 }}></div>
              </div>
              <p style={{ fontSize: 13, color: remainingKcal < 0 ? '#ef4444' : 'var(--text-muted)', fontStyle: 'italic', marginTop: 12 }}>
                {remainingKcal < 0 ? `Over target by ${Math.abs(remainingKcal).toFixed(0)} kcal` : `Remaining: ${remainingKcal.toFixed(0)} kcal`}
              </p>
            </div>

            <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 40 }}></div>

            <div className="macro-circles" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
              {[
                { label: 'protein', pct: dist.pctP, grams: dayTotals.proteinas_g, color: '#064e3b' },
                { label: 'carbs', pct: dist.pctH, grams: dayTotals.hidratos_g, color: '#7c3aed' },
                { label: 'fats', pct: dist.pctL, grams: dayTotals.lipidos_g, color: '#10b981' }
              ].map((m) => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div className="circle-progress" style={{ width: 60, height: 60, margin: '0 auto 12px', position: 'relative' }}>
                    <svg width="60" height="60" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="26" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                      <circle cx="30" cy="30" r="26" fill="none" stroke={m.color} strokeWidth="6" 
                        strokeDasharray={`${(m.pct / 100) * 163} 163`} strokeLinecap="round" transform="rotate(-90 30 30)" />
                    </svg>
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 10, fontWeight: 700 }}>{m.pct}%</span>
                  </div>
                  <div style={{ fontSize: 11, textTransform: 'capitalize', color: 'var(--text-muted)', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{m.grams.toFixed(0)}g</div>
                </div>
              ))}
            </div>

            <button className="btn btn-outline" onClick={() => window.print()} style={{ width: '100%', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, border: '1px solid #064e3b', color: '#064e3b' }}>
              Save Plan as PDF
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
