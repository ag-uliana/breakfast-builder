import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

export function Admin() {
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? '');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setEmail(sess?.user?.email ?? '');
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); };

  if (!email) return (
    <section>
      <p>not authorized <Link to="/admin/login">Enter</Link></p>
    </section>
  );

  return (
    <section>
      <h1>admin</h1>
      <p>you are logged in as<b>{email}</b></p>
      <div className="list">
        <Link className="row" to="#">list of items</Link>
        <Link className="row" to="#">categories and options</Link>
        <Link className="row" to="#">order history</Link>
      </div>
      <br/>
      <button className="button secondary" onClick={signOut}>exit</button>
    </section>
  );
}
