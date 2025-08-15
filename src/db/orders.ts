import { supabase } from '../supabaseClient';

async function invokeOrderNotify(orderId: string) {
  const localBase = import.meta.env.VITE_FUNCTIONS_URL;
  if (localBase) {
    const res = await fetch(`${localBase}/order-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return;
  }
  const { error } = await supabase.functions.invoke('order-notify', {
    body: { order_id: orderId },
  });
  if (error) throw error;
}

export async function createOrder(categoryId: string, addonIds: string[]) {
  const { data, error } = await supabase.rpc('create_order', {
    p_category_id: categoryId,
    p_addons: addonIds,
  });
  if (error) throw error;
  const orderId = data as string;
  
  await invokeOrderNotify(orderId);

  return orderId;
}
