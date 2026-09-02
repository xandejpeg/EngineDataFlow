import { CheckCircle2, Circle, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INVENTORY, type InventoryItem } from '@/data/partsInventory.pt-BR';
import { PART_GLB, PART_MODELS } from '@/engine3d/parts/partModels';
import '../pages.css';
import './inventory.css';

type ItemStatus = 'glb' | 'procedural' | 'todo';

function statusOf(item: InventoryItem): ItemStatus {
  if (item.partId && PART_GLB[item.partId]) return 'glb';
  if (item.partId && PART_MODELS[item.partId]) return 'procedural';
  if (item.proceduralLab) return 'procedural';
  return 'todo';
}

export function InventoryPage() {
  const allItems = INVENTORY.flatMap((g) => g.items);
  const doneCount = allItems.filter((i) => statusOf(i) !== 'todo').length;
  const total = allItems.length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <Boxes size={26} color="var(--accent-cyan)" />
          <h1>Progresso 3D</h1>
        </div>
        <p className="page-subtitle">
          Inventario mestre de todas as pecas do motor Ciclo Otto e seus sistemas. O que ja existe em
          3D aparece como <strong>feito</strong>; o resto fica como <strong>a fazer</strong>. Conforme
          novas pecas sao geradas, os itens viram feito automaticamente.
        </p>

        <div className="inv-overall">
          <div className="inv-overall-head">
            <strong>Progresso geral</strong>
            <span className="mono">
              {doneCount} / {total} ({pct}%)
            </span>
          </div>
          <div className="inv-bar">
            <div className="inv-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="inv-legend">
            <span><span className="dot glb" /> Malha gerada (Meshy)</span>
            <span><span className="dot proc" /> Procedural</span>
            <span><span className="dot todo" /> A fazer</span>
          </div>
        </div>

        {INVENTORY.map((group) => {
          const gDone = group.items.filter((i) => statusOf(i) !== 'todo').length;
          const gPct = Math.round((gDone / group.items.length) * 100);
          return (
            <section className="section inv-group" key={group.id}>
              <div className="inv-group-head">
                <h2>{group.titlePt}</h2>
                <span className="mono inv-group-count">
                  {gDone}/{group.items.length}
                </span>
              </div>
              <p className="inv-group-desc">{group.descriptionPt}</p>
              <div className="inv-bar sm">
                <div className="inv-bar-fill" style={{ width: `${gPct}%` }} />
              </div>
              <ul className="inv-list">
                {group.items.map((item) => {
                  const st = statusOf(item);
                  const done = st !== 'todo';
                  return (
                    <li key={item.id} className={`inv-item ${done ? 'done' : 'todo'}`}>
                      {done ? (
                        <CheckCircle2 size={16} className="ic-done" />
                      ) : (
                        <Circle size={16} className="ic-todo" />
                      )}
                      <span className="inv-name">{item.namePt}</span>
                      {st === 'glb' && <span className="tag done">3D gerado</span>}
                      {st === 'procedural' && <span className="tag info">procedural</span>}
                      {st === 'todo' && <span className="tag">a fazer</span>}
                      {item.note && st === 'glb' && item.note === 'inclusa na bobina' && (
                        <span className="inv-note">({item.note})</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <p className="inv-footer">
          Ver as pecas prontas na aba <Link to="/parts">Pecas 3D</Link>. Total no carro real: ~30.000
          pecas — este inventario cobre o escopo do <strong>motor Ciclo Otto</strong> e seus sistemas.
        </p>
      </div>
    </div>
  );
}
