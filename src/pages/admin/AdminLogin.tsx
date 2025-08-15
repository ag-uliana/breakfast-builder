import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const sendMagicLink = async () => {
    // Простой способ: magic link. Позже ограничим домен/список email
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/admin' }});
    if (!error) setSent(true);
    else alert(error.message);
  };

  if (sent) return <p>the login link has been sent to your email</p>;

  return (
    <section>
      <h1>login to admin panel</h1>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:12, width:'100%', margin:'8px 0'}}/>
      <button className="button" onClick={sendMagicLink} disabled={!email}>send a link</button>
    </section>
  );
}
