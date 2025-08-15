// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();
    if (!order_id) {
      return new Response("order_id required", { status: 400, headers: corsHeaders });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const TG_TOKEN     = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
    const TG_CHAT      = Deno.env.get("TELEGRAM_CHAT_ID")!;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    const { data, error } = await admin
      .from("order_summary")
      .select("order_id, created_at, category, addons")
      .eq("order_id", order_id)
      .maybeSingle();

    if (error || !data) {
      return new Response("order not found", { status: 404, headers: corsHeaders });
    }

    const dt = new Date(data.created_at);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    const text =
      `📅 ${dd}.${mm}.${yyyy}\n` +
      `🍳 ${data.category}\n` +
      (data.addons ? `➕ ${data.addons}` : "");

    const tgRes = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text }),
    });
    if (!tgRes.ok) {
      const err = await tgRes.text();
      return new Response("telegram error: " + err, { status: 502, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (e) {
    return new Response("bad request: " + e, { status: 400, headers: corsHeaders });
  }
});
