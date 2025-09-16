import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabaseClient';
import { CategoryAddonsManager } from './CategoryAddonManager';

export function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setReady(true);
    });

    unsub = () => sub.subscription.unsubscribe();
    return () => { unsub && unsub(); };
  }, []);

  const allowedEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();
  const userEmail = (session?.user?.email || '').toLowerCase();
  const isAllowed = !!session && !!allowedEmail && userEmail === allowedEmail;

  const base = import.meta.env.DEV ? '/' : import.meta.env.BASE_URL;
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = base;
  };

  if (!ready) {
    return <p>Loading…</p>;
  }

  if (!session) return <EmailLogin />;

  if (!isAllowed) {
    return (
      <section>
        <header className="admin_header">
          <h1 className="admin_h1">admin</h1>
          <button className="button secondary" onClick={logout}>log out</button>
        </header>
        <p style={{ color:'crimson' }}>not authorized for this area</p>
      </section>
    );
  }

  return (
    <section>
      <header className="admin_header">
        <h1 className="admin_h1">admin</h1>
        <button className="button secondary" onClick={logout}>log out</button>
      </header>
      <CategoryAddonsManager />
    </section>
  );
}

function EmailLogin() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const allowedEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();

  const send = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim().toLowerCase() !== allowedEmail) {
      alert('this demo is read-only; admin access is restricted.');
      return;
    }

    const basename = import.meta.env.DEV ? '/' : import.meta.env.BASE_URL;
    const redirectTo = `${window.location.origin}${basename}admin`;
    console.log('redirectTo →', redirectTo);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) alert(error.message); else setSent(true);
  };

  return (
    <div className="list">
      <h2>login to admin panel</h2>
      <form onSubmit={send} className="list">
        <input
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button className="button" type="submit">send the link</button>
      </form>
      {sent && <p>check your email</p>}
    </div>
  );
}

