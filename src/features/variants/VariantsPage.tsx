import '../pages.css';

const VARIANTS = [
  {
    titlePt: 'Carburador de corpo simples',
    bodyPt:
      'Dosagem por depressao no venturi. Circuitos de partida a frio (afogador), marcha lenta, circuito principal e bomba de aceleracao. Sem controle eletronico de mistura.',
  },
  {
    titlePt: 'Injecao mecanica (historico)',
    bodyPt:
      'Dosagem por sistema mecanico/hidraulico continuo, anterior a eletronica. Apresentada apenas como visao historica simplificada.',
  },
  {
    titlePt: 'Injecao mono-point',
    bodyPt:
      'Um unico injetor no corpo de borboleta alimenta todos os cilindros. Mais simples e menos preciso que o multiponto.',
  },
  {
    titlePt: 'Injecao multi-point simultanea e sequencial',
    bodyPt:
      'Um injetor por cilindro no coletor. Simultanea pulsa todos juntos; sequencial sincroniza cada injetor ao seu tempo de admissao (configuracao principal do EngineDataFlow).',
  },
  {
    titlePt: 'Ignicao convencional com distribuidor',
    bodyPt:
      'Bateria, bobina unica, distribuidor, platinado, condensador, rotor e velas. O platinado interrompe a corrente primaria; o distribuidor direciona a alta tensao.',
  },
  {
    titlePt: 'Ignicao transistorizada',
    bodyPt:
      'Substitui ou auxilia o platinado por um transistor de potencia, reduzindo desgaste e melhorando a centelha.',
  },
  {
    titlePt: 'Ignicao moderna (coil-on-plug)',
    bodyPt:
      'Uma bobina por vela comandada pela ECU, com avanco mapeado e correcao por detonacao. Configuracao principal do modelo.',
  },
  {
    titlePt: 'Aspiracao natural',
    bodyPt: 'O enchimento depende da depressao criada pelo pistao. Configuracao inicial do motor principal.',
  },
  {
    titlePt: 'Compressor mecanico (conceito)',
    bodyPt: 'Compressor acionado pelo motor eleva a pressao de admissao sem depender dos gases de escape.',
  },
  {
    titlePt: 'Turboalimentacao e intercooler',
    bodyPt:
      'Turbina movida pelos gases de escape aciona o compressor; o intercooler reduz a temperatura do ar comprimido, aumentando a densidade. Modulo opcional ativavel.',
  },
];

export function VariantsPage() {
  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <h1>Laboratorio de Variantes</h1>
        </div>
        <p className="page-subtitle">
          Tecnologias alternativas do Ciclo Otto, como bancadas didaticas separadas. Elas nao
          substituem o sistema moderno principal do laboratorio.
        </p>
        <div className="card-grid">
          {VARIANTS.map((v) => (
            <div className="card" key={v.titlePt}>
              <h3>{v.titlePt}</h3>
              <p>{v.bodyPt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
