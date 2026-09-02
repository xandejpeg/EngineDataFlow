import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { useSimulationLoop } from './useSimulationLoop';
import { useLearningStore } from '@/state/learningStore';
import './AppLayout.css';

const NAV = [
  { to: '/', label: 'Laboratorio', end: true },
  { to: '/learn', label: 'Aprender' },
  { to: '/components', label: 'Componentes' },
  { to: '/cases', label: 'Estudos de caso' },
  { to: '/courses', label: 'Cursos' },
  { to: '/parts', label: 'Pecas 3D' },
  { to: '/inventory', label: 'Progresso 3D' },
  { to: '/compare', label: 'Comparar' },
  { to: '/data-flow', label: 'Data Flow' },
  { to: '/variants', label: 'Variantes' },
  { to: '/about-model', label: 'Sobre o modelo' },
];

export function AppLayout() {
  useSimulationLoop();
  const hydrate = useLearningStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <div className="layout">
      <header className="topbar">
        <NavLink to="/" aria-label="Pagina inicial do EngineDataFlow">
          <Logo />
        </NavLink>
        <nav aria-label="Navegacao principal">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
