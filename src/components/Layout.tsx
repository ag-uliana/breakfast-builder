import { Link, useLocation } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const title = loc.pathname.startsWith('/admin') ? 'admin' : 'breakfast builder';
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/">🥣 {title}</Link>
        <nav>
          <Link to="/admin">admin</Link>
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">© {new Date().getFullYear()} breakfast builder</footer>
    </div>
  );
}
