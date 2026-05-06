import React, { useState } from 'react';
import { 
  PlusCircle, 
  ChefHat, 
  BarChart2, 
  ArrowLeft, 
  X, 
  Flame, 
  Dna, 
  Apple, 
  Droplet,
  UtensilsCrossed,
  Trash2
} from 'lucide-react';

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
          <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: 'var(--green-900)', marginBottom: '8px', fontWeight: 800 }}>Recetario Clínico</h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>Gestiona y descubre preparaciones de alto rendimiento nutricional.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setView('add')}
          style={{ padding: '14px 28px', borderRadius: '14px', fontWeight: 700, gap: '10px' }}
        >
          <PlusCircle size={20} />
          <span>Subir Receta</span>
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
              border: activeFilter === f ? 'none' : '1px solid var(--border)',
              background: activeFilter === f ? 'var(--green-600)' : 'var(--bg-card)',
              color: activeFilter === f ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="recipes-layout">
        <div className="recipes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filtered.map(card => (
            <div key={card.id} className="card recipe-card-premium" onClick={() => setSelectedRecipe(card)} style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', cursor: 'pointer', border: '1px solid var(--border)' }}>
              <div style={{ position: 'relative', height: '180px', background: CAT_COLORS[card.category] || '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                {card.emoji || '🥗'}
                <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>{card.category}</span>
                <button 
                  className="btn-delete-recipe" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`¿Estás seguro de que deseas eliminar la receta "${card.name}"?`)) {
                      setRecipes(prev => prev.filter(r => r.id !== card.id));
                      triggerConfirm('Receta Eliminada', `La receta "${card.name}" ha sido removida del catálogo.`);
                    }
                  }}
                  style={{ 
                    position: 'absolute', 
                    top: '16px', 
                    right: '16px', 
                    background: 'rgba(239, 68, 68, 0.2)', 
                    backdropFilter: 'blur(8px)', 
                    color: '#ef4444', 
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green-900)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>{card.name}</h3>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {card.tags?.slice(0, 2).map(t => <span key={t} className="chip" style={{ fontSize: '10px', borderRadius: '6px' }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', borderTop: '1px solid var(--border-light)', paddingWith: '16px', justifyContent: 'space-between', paddingTop: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Kcal</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>{card.kcalPerServing || card.kcal}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Prot</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>{card.proteinasPerServing || card.prot}g</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>CHO</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>{card.hidratosPerServing || '—'}g</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="recipes-sidebar">
          <div className="card" style={{ padding: '32px', borderRadius: '24px', position: 'sticky', top: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green-900)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-display)' }}>
              <BarChart2 size={22} className="text-accent" />
              <span>Estadísticas</span>
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ background: 'var(--slate-50)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Total Recetas</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--green-900)', fontFamily: 'var(--font-display)' }}>{recipes.length}</div>
              </div>
              <div style={{ background: 'var(--green-50)', padding: '20px', borderRadius: '20px', border: '1px solid var(--green-100)' }}>
                <div style={{ fontSize: '12px', color: 'var(--green-700)', marginBottom: '4px', fontWeight: 600 }}>Más utilizadas</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--green-800)' }}>Bowl Andino</div>
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
              <div className="modal-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{selectedRecipe.name}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ color: 'var(--red-500)' }}
                  onClick={() => {
                    if (window.confirm(`¿Estás seguro de que deseas eliminar la receta "${selectedRecipe.name}"?`)) {
                      setRecipes(prev => prev.filter(r => r.id !== selectedRecipe.id));
                      setSelectedRecipe(null);
                      triggerConfirm('Receta Eliminada', `La receta "${selectedRecipe.name}" ha sido removida del catálogo.`);
                    }
                  }}
                >
                  <Trash2 size={18} />
                </button>
                <button className="btn btn-ghost btn-icon" onClick={() => setSelectedRecipe(null)}><X size={20} /></button>
              </div>
            </div>
            <div className="modal-body">
              <div className="grid-2 gap-8">
                <div>
                  <div style={{ height: '240px', background: CAT_COLORS[selectedRecipe.category] || '#f8fafc', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px', marginBottom: '24px', border: '1px solid var(--border)' }}>
                    {selectedRecipe.emoji || '🥗'}
                  </div>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <BarChart2 size={16} />
                    <span>Análisis Nutricional</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="stat-card" style={{ padding: '16px', borderRadius: '16px' }}>
                      <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Flame size={12} /> Calorías</div>
                      <div className="stat-value" style={{ fontSize: '28px', fontWeight: 800 }}>{selectedRecipe.kcalPerServing || selectedRecipe.kcal}</div>
                    </div>
                    <div className="stat-card" style={{ padding: '16px', borderRadius: '16px' }}>
                      <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Dna size={12} /> Proteínas</div>
                      <div className="stat-value" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--red-500)' }}>{selectedRecipe.proteinasPerServing || selectedRecipe.prot}g</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <ChefHat size={16} />
                    <span>Preparación</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedRecipe.preparation?.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--green-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>{i+1}</div>
                        <div style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-main)' }}>{step}</div>
                      </div>
                    )) || <div className="empty-state" style={{ padding: '20px' }}>No hay instrucciones registradas.</div>}
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
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
            <ArrowLeft size={16} />
            <span>Volver a Recetario</span>
          </button>
          <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: 'var(--green-900)', fontWeight: 800 }}>Subir Receta</h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>Añade una nueva preparación al catálogo clínico.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-outline" style={{ padding: '12px 24px', borderRadius: '12px' }} onClick={onCancel}>Cancelar</button>
          <button className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }} onClick={handleSubmit}>Guardar Receta</button>
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
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={16} />
              <span>Información Nutricional</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
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
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UtensilsCrossed size={16} />
              <span>Instrucciones (una por línea)</span>
            </h3>
            <textarea 
              className="input" 
              rows="12" 
              placeholder="1. Lava los vegetales...&#10;2. Corta en julianas...&#10;3. Saltea a fuego medio..." 
              style={{ padding: '20px', resize: 'none', marginTop: '20px' }}
              value={form.instructions}
              onChange={e => setForm({...form, instructions: e.target.value})}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

