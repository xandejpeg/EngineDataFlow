import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { COMPONENTS } from '@/data/components.pt-BR';
import '../pages.css';

export function ComponentsPage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMPONENTS;
    return COMPONENTS.filter(
      (c) =>
        c.namePt.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.functionPt.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <h1>Componentes</h1>
        </div>
        <p className="page-subtitle">
          Enciclopedia tecnica conectada ao 3D. Para cada familia: funcao, materiais tipicos,
          relacoes e falhas.
        </p>
        <input
          className="search-input"
          placeholder="Buscar componente..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar componente"
        />
        <div className="card-grid">
          {filtered.map((c) => (
            <Link className="card" to={`/components/${c.id}`} key={c.id}>
              <h3>{c.namePt}</h3>
              <p>{c.shortDescriptionPt}</p>
              <div className="meta">
                <span className="tag">{c.category}</span>
                <span className="tag info">{c.assetMode}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
