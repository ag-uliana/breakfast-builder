import { Link } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Яйца' },
  { id: 2, name: 'Каши' },
  { id: 3, name: 'Хлопья с молоком' },
  { id: 4, name: 'Тосты' }
];

export function Home() {
  return (
    <section>
      <h1>select category</h1>
      <div className="flex-list">
        {categories.map(c => (
          <Link 
            key={c.id} 
            className="card flex-item" 
            to={`/c/${c.id}`}>{c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
