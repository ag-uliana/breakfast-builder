import { supabase } from '../supabaseClient';

export type Addon = { id: string; name: string };

export async function getAddonsForCategory(categoryId: string): Promise<Addon[]> {
  const { data: links, error: e1 } = await supabase
    .from('category_addons')
    .select('ingredient_id')
    .eq('category_id', categoryId);
  if (e1) throw e1;

  const ids = (links ?? []).map(l => l.ingredient_id);
  if (ids.length === 0) return [];

  const { data, error: e2 } = await supabase
    .from('ingredients')
    .select('id, name')
    .in('id', ids)
    .eq('is_addon', true)
    .eq('in_stock', true);

  if (e2) throw e2;
  return (data ?? []) as Addon[];
}
