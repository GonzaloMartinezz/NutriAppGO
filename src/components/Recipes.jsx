import React, { useState } from 'react';

const CAT_COLORS = {
  Todos: '#f1f5f9',
  Desayuno: '#fef3c7',
  Almuerzo: '#d1fae5',
  Merienda: '#fce7f3',
  Cena: '#dbeafe',
  Snacks: '#f3e8ff'
};

export function Recipes({ recipes, setRecipes, triggerConfirm }) {
  const [view, setView] = useState('list'); // 'list' or 'add'
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const filtered = activeFilter === 'Todos' 
    ? recipes 
    : recipes.filter(r => r.category === activeFilter);

  if (view === 'add') {
    return <RecipeForm 
      onCancel={() => setView('list')} 
      onSave={(newRec) => {
        setRecipes([newRec, ...recipes]);
        setView('list');
        triggerConfirm('Receta Guardada', `La receta "${newRec.name}" ha sido añadida a tu catálogo personal.`);
      }} 
    />;
  }

  return (
    <div className="recipes-clinical">
      <div className="section-header" style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: '#064e3b', marginBottom: '8px' }}>Recetario Clínico</h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>Gestiona y descubre preparaciones de alto rendimiento nutricional.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setView('add')}
          style={{ padding: '14px 28px', borderRadius: '12px', fontWeight: 700 }}
        >
          <span>⊕</span> Subir Receta
        </button>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        {['Todos', 'Desayuno', 'Almuerzo', 'Cena', 'Snacks'].map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '99px', 
              border: activeFilter === f ? 'none' : '1px solid #e2e8f0',
              background: activeFilter === f ? '#065f46' : '#fff',
              color: activeFilter === f ? '#fff' : '#64748b',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="recipes-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        <div className="recipes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filtered.map(card => (
            <div key={card.id} className="card recipe-card-premium" onClick={() => setSelectedRecipe(card)} style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', cursor: 'pointer' }}>
              <div style={{ position: 'relative', height: '180px', background: CAT_COLORS[card.category] || '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                {card.emoji || '🥗'}
                <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>{card.category}</span>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#064e3b', marginBottom: '8px' }}>{card.name}</h3>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {card.tags?.slice(0, 2).map(t => <span key={t} className="chip" style={{ fontSize: '10px' }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', paddingTop: '16px', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase' }}>Kcal</div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{card.kcalPerServing || card.kcal}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase' }}>Prot</div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{card.proteinasPerServing || card.prot}g</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase' }}>CHO</div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{card.hidratosPerServing || '—'}g</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="recipes-sidebar">
          <div className="card" style={{ padding: '24px', borderRadius: '24px', position: 'sticky', top: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#064e3b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📊 Estadísticas
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Total Recetas</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#064e3b' }}>{recipes.length}</div>
              </div>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '16px' }}>
                <div style={{ fontSize: '12px', color: '#15803d', marginBottom: '4px' }}>Más utilizadas</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>Bowl Andino</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{selectedRecipe.name}</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedRecipe(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid-2 gap-6">
                <div>
                  <div style={{ height: '240px', background: CAT_COLORS[selectedRecipe.category] || '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px', marginBottom: '20px' }}>
                    {selectedRecipe.emoji || '🥗'}
                  </div>
                  <div className="card-title">Análisis Nutricional</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="stat-card" style={{ padding: '12px' }}>
                      <div className="stat-label">Calorías</div>
                      <div className="stat-value" style={{ fontSize: '24px' }}>{selectedRecipe.kcalPerServing || selectedRecipe.kcal}</div>
                    </div>
                    <div className="stat-card" style={{ padding: '12px' }}>
                      <div className="stat-label">Proteínas</div>
                      <div className="stat-value" style={{ fontSize: '24px', color: 'var(--red-500)' }}>{selectedRecipe.proteinasPerServing || selectedRecipe.prot}g</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="card-title">Preparación</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedRecipe.preparation?.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--green-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>{step}</div>
                      </div>
                    )) || <div className="text-muted">No hay instrucciones registradas.</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeForm({ onCancel, onSave }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Almuerzo',
    kcal: '',
    prot: '',
    hidratos: '',
    grasas: '',
    instructions: '',
    emoji: '🥗'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      ...form,
      kcalPerServing: form.kcal,
      proteinasPerServing: form.prot,
      hidratosPerServing: form.hidratos,
      lipidosPerServing: form.grasas,
      preparation: form.instructions.split('\n').filter(s => s.trim()),
      tags: ['Manual'],
    });
  };

  return (
    <div className="recipe-form-view">
      <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer', marginBottom: '12px' }}>← Volver a Recetario</button>
          <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: '#064e3b' }}>Subir Receta</h1>
          <p className="text-muted">Añade una nueva preparación al catálogo clínico.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-outline" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Guardar Receta</button>
        </div>
      </div>

      <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="form-left-col">
          <div className="card" style={{ padding: '32px', borderRadius: '24px', marginBottom: '32px' }}>
             <div style={{ marginBottom: '24px' }}>
               <label className="label">Título de la Receta</label>
               <input type="text" className="input" placeholder="Ej: Bowl Quinoa Primavera" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="label">Categoría</label>
                  <select className="select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option>Desayuno</option>
                    <option>Almuerzo</option>
                    <option>Cena</option>
                    <option>Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="label">Emoji Representativo</label>
                  <input type="text" className="input" placeholder="🥗" value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} />
                </div>
             </div>
          </div>

          <div className="card" style={{ padding: '32px', borderRadius: '24px' }}>
            <h3 className="card-title">Información Nutricional</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="label">Calorías (kcal)</label>
                <input type="number" className="input" value={form.kcal} onChange={e => setForm({...form, kcal: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">Proteínas (g)</label>
                <input type="number" className="input" value={form.prot} onChange={e => setForm({...form, prot: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">Carbos (g)</label>
                <input type="number" className="input" value={form.hidratos} onChange={e => setForm({...form, hidratos: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">Grasas (g)</label>
                <input type="number" className="input" value={form.grasas} onChange={e => setForm({...form, grasas: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <div className="form-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ flex: 1, padding: '32px', borderRadius: '24px' }}>
            <h3 className="card-title">Instrucciones (una por línea)</h3>
            <textarea 
              className="input" 
              rows="12" 
              placeholder="1. Lava los vegetales...&#10;2. Corta en julianas...&#10;3. Saltea a fuego medio..." 
              style={{ padding: '20px', resize: 'none' }}
              value={form.instructions}
              onChange={e => setForm({...form, instructions: e.target.value})}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
