import { Link } from 'react-router-dom';
import { GraduationCap, Clock, MapPin } from 'lucide-react';
import { COURSES } from '@/data/courses.pt-BR';
import '../pages.css';
import './courses.css';

export function CoursesPage() {
  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <GraduationCap size={26} color="var(--accent-cyan)" />
          <h1>Cursos</h1>
        </div>
        <p className="page-subtitle">
          Cursos tecnicos conectados ao laboratorio 3D. O conteudo e explicado bloco a bloco, com
          dados tecnicos, sintomas de falha e como testar cada componente.
        </p>

        <div className="card-grid">
          {COURSES.map((c) => {
            const topics = c.blocks.reduce((n, b) => n + b.topics.length, 0);
            return (
              <Link className="card course-card" to={`/courses/${c.id}`} key={c.id}>
                {c.institution && <div className="course-badge">{c.institution}</div>}
                <h3>{c.titlePt}</h3>
                <p>{c.objectivePt}</p>
                <div className="meta">
                  <span className="chip">
                    <Clock size={13} /> {c.hours}h
                  </span>
                  <span className="chip">
                    <MapPin size={13} /> {c.unitPt}
                  </span>
                  <span className="tag info">{c.blocks.length} blocos · {topics} topicos</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
