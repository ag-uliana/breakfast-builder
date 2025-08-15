import { createClient } from '@supabase/supabase-js';

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Set env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID');
  process.exit(1);
}

const orderId = process.argv[2];
if (!orderId) {
  console.error('Usage: node scripts/notify-order.mjs <order_id>');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const { data, error } = await admin
  .from('order_summary')
  .select('order_id, created_at, category, addons')
  .eq('order_id', orderId)
  .maybeSingle();

if (error || !data) {
  console.error('Order not found', error);
  process.exit(1);
}

const dt = new Date(data.created_at);
const dd = String(dt.getDate()).padStart(2, '0');
const mm = String(dt.getMonth() + 1).padStart(2, '0');
const yyyy = dt.getFullYear();
const text = `📅 ${dd}.${mm}.${yyyy}\n🍳 ${data.category}\n${data.addons ? '➕ ' + data.addons : ''}`;

const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
const resp = await fetch(tgUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
});
if (!resp.ok) {
  const t = await resp.text();
  console.error('Telegram error:', t);
  process.exit(1);
}
console.log('Sent to Telegram:', text);
