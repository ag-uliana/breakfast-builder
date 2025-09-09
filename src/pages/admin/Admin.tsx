import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { CategoryAddonsManager } from './CategoryAddonManager';

type Session = import('@supabase/supabase-js').Session | null;

export function Admin() {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!session) return <EmailLogin />;

  return (
    <section>
      <h1>admin</h1>
      <CategoryAddonsManager />
    </section>
  );
}

function EmailLogin() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const redirectTo =
    (import.meta.env.VITE_SITE_URL || window.location.origin) +
    import.meta.env.BASE_URL + 'admin';

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      alert(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="list">
      <h2>log in</h2>
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

