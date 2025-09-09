## Breakfast Builder — Mobile-first food ordering mini-app (React + Supabase)

A production-ready, mobile-first “constructor” for breakfasts. Users pick a category → choose available add-ons → submit. Admins manage inventory and category ↔ add-on rules, and receive instant Telegram notifications for each order. Built with a secure, scalable Supabase backend and a fast React + Vite + TypeScript frontend.

Designed to showcase clean architecture, strict security (RLS), and pragmatic DX: transactional RPC, Edge Functions, CI/CD to GitHub Pages, and optional OCR for receipt imports (WIP).

***Highlights***
- Zero-trust data access: Postgres Row Level Security strictly separates public (anon) reads from admin writes.  
- Atomic writes: a single RPC create_order(category_id, addons[]) inserts an order + its add-ons in one transaction, validating availability and category linkage server-side.
- Server notifications: Edge Function (order-notify) composes a readable summary and sends it to Telegram with proper CORS handling.
- Lean, fast UI: React + Vite + TS, mobile-first layout, SPA routing, and GitHub Pages deploy (with 404 fallback).

Extendable: optional OCR (Tesseract.js) to parse grocery receipts and auto-mark items “in stock,” with fuzzy matching & synonym learning.

***Features***
- User  
Choose category (e.g., Eggs, Porridge, Cereal, Toast).  
See only available add-ons (filtered by inventory).  
Multi-select add-ons, confirm order → success screen.  
Fast, responsive UI (mobile-first; 1-column → 2-column on larger screens).  

- Admin  
Magic-link auth (email OTP) — secure access to /admin.  
Manage ingredients: quick In stock toggle (writes to DB).  
Manage category ↔ add-on mapping (pivot table): allow/deny add-ons per category.  
Order log (via SQL view or direct query) — category + selected add-ons.  

- Telegram alert on each order:  
📅 15.08.2025  
🍳 Eggs  
➕ Cheese, Ham  

***Tech stack***
- Frontend: React 18, Vite, TypeScript, CSS (mobile-first).
- Backend: Supabase (Postgres + RLS, Edge Functions, Auth, Realtime).
- Integration: Telegram Bot API (via Edge Function fetch).
- CI/CD: GitHub Actions → GitHub Pages.
