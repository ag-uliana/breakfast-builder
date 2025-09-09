import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const redirectTo =
      (import.meta.env.VITE_SITE_URL || window.location.origin) +
      import.meta.env.BASE_URL + 'admin'; 

  const sendMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({ 
      email, 
      options: { 
        emailRedirectTo: redirectTo
      }
    });

    if (!error) setSent(true);

    else alert(error.message);
  };

  if (sent) return <p>the login link has been sent to your email</p>;

  return (
    <section>
      <h1>login to admin panel</h1>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <button className="button" onClick={sendMagicLink} disabled={!email}>send a link</button>
    </section>
  );
}
