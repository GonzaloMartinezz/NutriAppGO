import React, { useState } from 'react';
import { FoodSearchBar } from './FoodSearchBar';
import { Toast } from './Toast';
import { calcItem, sumItems, calcDist } from '../utils/math';

export function Plans({ patients }) {
  const DAYS = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  const MEALS = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
  const emptyPlan = () =>
    DAYS.map((d) => ({ day: d, meals: MEALS.map((m) => ({ name: m, items: [] })) }));

  const [plan, setPlan] = useState(emptyPlan());
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [targetKcal, setTargetKcal] = useState(1800);
  const [adding, setAdding] = useState(null); // {dayIdx,mealIdx}
  const [toast, setToast] = useState(null);

  const pat = patients.find((p) => p.id === patientId);

  const addToPlan = (food) => {
    if (!adding) return;
    const { dayIdx, mealIdx } = adding;
    const item = calcItem(food, 100);
    setPlan((prev) =>
      prev.map((d, di) =>
        di !== dayIdx
          ? d
          : {
              ...d,
              meals: d.meals.map((m, mi) =>
                mi !== mealIdx ? m : { ...m, items: [...m.items, item] }
              ),
            }
      )
    );
    setAdding(null);
    setToast(
      `${food.nombre} agregado al ${MEALS[mealIdx]} del ${DAYS[dayIdx]}`
    );
  };

  const removeFromPlan = (dayIdx, mealIdx, foodId) => {
    setPlan((prev) =>
      prev.map((d, di) =>
        di !== dayIdx
          ? d
          : {
              ...d,
              meals: d.meals.map((m, mi) =>
                mi !== mealIdx
                  ? m
                  : { ...m, items: m.items.filter((i) => i.foodId !== foodId) }
              ),
            }
      )
    );
  };

  const getMealTotals = (items) => sumItems(items);
  const getDayTotals = (day) => {
    const allItems = day.meals.flatMap((m) => m.items);
    return sumItems(allItems);
  };

  const weekAvg = () => {
    const totals = plan.map(getDayTotals);
    const sum = sumItems(totals);
    return {
      kcal: +(sum.kcal / 7).toFixed(0),
      prot: +(sum.proteinas_g / 7).toFixed(1),
      lip: +(sum.lipidos_g / 7).toFixed(1),
      cho: +(sum.hidratos_g / 7).toFixed(1),
    };
  };

  const avg = weekAvg();
  const dist = calcDist(avg.prot, avg.lip, avg.cho);

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <div className="section-header mb-4">
        <div>
          <div className="section-title">Constructor de Planes</div>
          <div className="text-muted text-sm" style={{ marginTop: 3 }}>
            Armá planes nutricionales semanales personalizados
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            className="select"
            style={{ width: 'auto' }}
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={() => setToast('Plan guardado exitosamente')}
          >
            💾 Guardar plan
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div
        style={{
          background: 'var(--slate-800)',
          borderRadius: 'var(--radius)',
          padding: '14px 20px',
          marginBottom: 16,
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--slate-500)',
              textTransform: 'uppercase',
              letterSpacing: '.08em',
            }}
          >
            Paciente
          </div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
            {pat?.firstName} {pat?.lastName}
          </div>
        </div>
        <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,.1)' }} />
        <div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--slate-500)',
              textTransform: 'uppercase',
              letterSpacing: '.08em',
            }}
          >
            Target
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number"
              value={targetKcal}
              onChange={(e) => setTargetKcal(+e.target.value)}
              style={{
                width: 70,
                background: 'rgba(255,255,255,.1)',
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: 6,
                padding: '3px 6px',
                color: '#fff',
                fontSize: 13,
                textAlign: 'center',
              }}
            />
            <span style={{ color: 'var(--slate-400)', fontSize: 12 }}>kcal/día</span>
          </div>
        </div>
        <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,.1)' }} />
        <div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--slate-500)',
              textTransform: 'uppercase',
              letterSpacing: '.08em',
            }}
          >
            Promedio semana
          </div>
          <div
            style={{
              color: Math.abs(avg.kcal - targetKcal) < 100 ? '#4ade80' : '#fbbf24',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {avg.kcal} kcal
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', gap: 12, color: 'var(--slate-400)', fontSize: 12 }}>
            <span>
              <span style={{ color: '#f87171', fontWeight: 600 }}>
                P: {avg.prot}g ({dist.pctP}%)
              </span>
            </span>
            <span>
              <span style={{ color: '#60a5fa', fontWeight: 600 }}>
                CHO: {avg.cho}g ({dist.pctH}%)
              </span>
            </span>
            <span>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                L: {avg.lip}g ({dist.pctL}%)
              </span>
            </span>
          </div>
          <div className="macro-bar macro-bar-lg" style={{ marginTop: 5 }}>
            <div
              className="macro-bar-seg"
              style={{ width: `${dist.pctP}%`, background: '#ef4444' }}
            />
            <div
              className="macro-bar-seg"
              style={{ width: `${dist.pctH}%`, background: '#3b82f6' }}
            />
            <div
              className="macro-bar-seg"
              style={{ width: `${dist.pctL}%`, background: '#f59e0b' }}
            />
          </div>
        </div>
      </div>

      {/* Plan Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div className="plan-grid">
          {plan.map((day, di) => {
            const dayTot = getDayTotals(day);
            const pct = targetKcal > 0 ? Math.min((dayTot.kcal / targetKcal) * 100, 120) : 0;
            return (
              <div key={di} className="plan-day">
                <div className={`plan-day-header${di === 0 ? ' today' : ''}`}>
                  {day.day}
                </div>
                {day.meals.map((meal, mi) => {
                  const mt = getMealTotals(meal.items);
                  return (
                    <div key={mi} className="meal-block">
                      <div className="meal-name">{meal.name}</div>
                      {meal.items.map((it) => (
                        <div key={it.foodId} className="meal-food-row">
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                              marginRight: 4,
                              fontSize: 11,
                            }}
                          >
                            {it.foodName.split(',')[0]}
                          </span>
                          <span
                            style={{
                              color: 'var(--slate-400)',
                              fontSize: 11,
                              flexShrink: 0,
                            }}
                          >
                            {it.grams}g
                          </span>
                          <button
                            onClick={() => removeFromPlan(di, mi, it.foodId)}
                            style={{
                              marginLeft: 4,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--slate-400)',
                              fontSize: 10,
                              padding: '0 2px',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {meal.items.length > 0 && (
                        <div className="meal-total">{mt.kcal.toFixed(0)} kcal</div>
                      )}
                      <button
                        className="add-food-btn"
                        onClick={() => setAdding({ dayIdx: di, mealIdx: mi })}
                      >
                        + agregar
                      </button>
                    </div>
                  );
                })}
                <div className="plan-day-total">
                  <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                    <span>{dayTot.kcal.toFixed(0)} kcal</span>
                    <span
                      style={{
                        color: pct > 100 ? 'var(--red-500)' : 'var(--slate-500)',
                      }}
                    >
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="kcal-bar">
                    <div
                      className={`kcal-bar-fill${pct > 100 ? ' over' : ''}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal */}
      {adding !== null && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setAdding(null)}
        >
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">
                Agregar al {MEALS[adding.mealIdx]} — {DAYS[adding.dayIdx]}
              </div>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setAdding(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <FoodSearchBar
                onSelect={addToPlan}
                placeholder="Buscar alimento SARA 2..."
              />
              <div className="text-sm text-muted mt-2">
                Se agrega por defecto 100g · podés editar el gramaje después
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
