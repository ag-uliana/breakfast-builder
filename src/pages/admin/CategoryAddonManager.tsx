import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../supabaseClient';

type Category = { id: string; name: string };
type Ingredient = { id: string; name: string; in_stock: boolean };

export function CategoryAddonsManager() {
  const [cats, setCats] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [allowed, setAllowed] = useState<Set<string>>(new Set());
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: i }] = await Promise.all([
        supabase.from('categories').select('id,name').order('name'),
        supabase.from('ingredients').select('id,name,in_stock').order('name'),
      ]);
      setCats((c ?? []) as Category[]);
      setIngredients((i ?? []) as Ingredient[]);
      if (!selectedCat && (c ?? [])[0]) setSelectedCat((c as Category[])[0].id);
    })();
  }, []);

  useEffect(() => {
    if (!selectedCat) return;
    (async () => {
      const { data } = await supabase
        .from('category_addons')
        .select('ingredient_id')
        .eq('category_id', selectedCat);
      setAllowed(new Set((data ?? []).map((x: any) => x.ingredient_id)));
    })();
  }, [selectedCat]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? ingredients.filter(i => i.name.toLowerCase().includes(t)) : ingredients;
  }, [ingredients, q]);

  const toggleAllowed = async (ingredientId: string) => {
  const isAllowed = allowed.has(ingredientId);

  if (isAllowed) {
    const { error, status } = await supabase
      .from('category_addons')
      .delete()
      .eq('category_id', selectedCat)
      .eq('ingredient_id', ingredientId);

    if (error) { alert(`error while deleting (${status}): ${error.message}`); return; }
    const next = new Set(allowed); next.delete(ingredientId); setAllowed(next);
  } else {
    const { error, status } = await supabase
      .from('category_addons')
      .insert({ category_id: selectedCat, ingredient_id: ingredientId });

    if (error) { alert(`error while saving (${status}): ${error.message}`); return; }
    const next = new Set(allowed); next.add(ingredientId); setAllowed(next);
  }
};


  const toggleInStock = async (ingredientId: string, value: boolean) => {
  const { data, error, status } = await supabase
    .from('ingredients')
    .update({ in_stock: value })
    .eq('id', ingredientId)
    .select('id,in_stock') 
    .single();

  if (error) {
    alert(`error while saving (${status}): ${error.message}`);
    return;
  }
  setIngredients(prev =>
    prev.map(i => (i.id === ingredientId ? { ...i, in_stock: data!.in_stock } : i))
  );
};

  return (
    <div className="addons_container">
      <div className="addons_header">
        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="breakfastType_select"
        >
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          type="text"
          className="search_input"
          placeholder="searching for ingredient…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      <div className="addons_list">
        {filtered.map(i => {
          const isAllowed = allowed.has(i.id);
          return (
            <div key={i.id} className="row addon_row">
              <div>{i.name}</div>

              <div className="label_list">
                <label>
                  <input
                    type="checkbox"
                    checked={isAllowed}
                    onChange={() => toggleAllowed(i.id)}
                  />
                  <span>allowed</span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={i.in_stock}
                    onChange={e => toggleInStock(i.id, e.target.checked)}
                  />
                  <span>in stock</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
