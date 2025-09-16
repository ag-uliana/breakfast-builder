import { Link } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/">🥣 breakfast builder</Link>
        <nav>
          <Link to="/admin">⚙ admin</Link>
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">© {new Date().getFullYear()} breakfast builder</footer>
    </div>
  );
}
