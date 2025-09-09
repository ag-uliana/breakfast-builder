import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useOrder } from '../state/order';
import { supabase } from '../supabaseClient';

type Category = { 
  id: string; 
  name: string 
};
export default function Home() {
  const { setCategory } = useOrder();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    let alive = true; 
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id,name');
        if (error) throw error;
        if (alive) setCategories((data ?? []) as Category[]);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? 'failed to load categories');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  if (loading) return <p>loading</p>;
  if (err) return <p>{err}</p>;
  if (!categories.length) return <p>no categories available</p>;

  return (
    <section>
      <h1>select category</h1>
      <div className="flex-list">
        {categories.map(c => (
          <Link
            key={c.id}
            className="card"
            to={`/c/${c.id}`} 
            onClick={() => setCategory(String(c.id))}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
