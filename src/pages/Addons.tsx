import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

type Addon = { 
  id: string; 
  name: string; 
  inStock: boolean 
};
export default function Addons() {
  const { categoryId = '' } = useParams();
  const nav = useNavigate();

  const [all, setAll] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);
        setSelected([]);

        const { data: links, error: e1 } = await supabase
          .from('category_addons')
          .select('ingredient_id')
          .eq('category_id', categoryId);
        if (e1) throw e1;

        const ids = (links ?? []).map((l: any) => l.ingredient_id);
        if (!ids.length) { setAll([]); return; }

        const { data, error: e2 } = await supabase
          .from('ingredients')
          .select('id,name')
          .in('id', ids)
          .eq('is_addon', true)
          .eq('in_stock', true);
        if (e2) throw e2;

        setAll((data ?? []) as Addon[]);
      } catch (e: any) {
        setError(e.message ?? 'Не удалось загрузить добавки');
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId]);

  const toggle = (id: string) =>
    setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  const submit = async () => {
    try {
      const { data: orderId, error } = await supabase.rpc('create_order', {
        p_category_id: categoryId,
        p_addons: selected,
      });
      if (error) throw error;

      const { error: fnErr } = await supabase.functions.invoke('order-notify', {
        body: { order_id: orderId as string },
      });
      if (fnErr) throw fnErr;

      nav(`/confirm/${orderId}`);
    } catch (e: any) {
      alert(e.message ?? 'Ошибка при отправке заказа');
    }
  };

  if (loading) return <p>Загрузка…</p>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (!all.length) return <p>Для этой категории нет доступных добавок.</p>;

  return (
    <section>
      <h1>additives</h1>

      <div className="flex-list">
        {all.map(a => {
          const isSelected = selected.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              className={`card${isSelected ? ' selected' : ''}`}
              onClick={() => toggle(a.id)}
            >
              {a.name}
            </button>
          );
        })}
      </div>

      <div className="sticky-bar">
        <button className="button sent__button" disabled={selected.length === 0} onClick={submit}>
          sent
        </button>
      </div>
    </section>
  );
}
