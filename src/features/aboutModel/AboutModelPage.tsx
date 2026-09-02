import { REFERENCE_VALUES } from '@/simulation/constants';
import '../pages.css';

export function AboutModelPage() {
  return (
    <div className="page">
      <div className="page-narrow">
        <div className="page-title">
          <h1>Sobre o modelo</h1>
        </div>
        <p className="page-subtitle">
          O EngineDataFlow e um simulador educacional interativo, nao um software de calibracao, CFD,
          FEA, dinamometro certificado ou ferramenta de reparo. O modelo fisico e simplificado,
          deterministico e dimensionalmente coerente. Estimativas nunca sao medicoes reais.
        </p>

        <section className="section">
          <h2>O que e calculado, aproximado ou heuristico</h2>
          <dl className="kv">
            <dt>Cinematica biela-manivela</dt><dd>Calculada geometricamente.</dd>
            <dt>Volume instantaneo</dt><dd>Calculado pela geometria do cilindro.</dd>
            <dt>Ciclo termodinamico</dt><dd>Idealizado / aproximado (modelo de zona unica).</dd>
            <dt>Combustao</dt><dd>Liberacao de calor simplificada (funcao de Wiebe).</dd>
            <dt>Pressao, temperatura, torque, potencia</dt><dd>Estimativas educacionais.</dd>
            <dt>Detonacao, pre-ignicao, desgaste, emissao</dt><dd>Indices heuristicos, nao previsoes de engenharia.</dd>
            <dt>Cores, particulas e deformacoes</dt><dd>Visualizacoes explicativas, muitas vezes ampliadas.</dd>
            <dt>Tolerancias e limites de servico reais</dt><dd>Sempre dependem do manual da montadora/fabricante.</dd>
          </dl>
        </section>

        <section className="section">
          <h2>Formulas principais</h2>
          <div className="formula">x(θ) = r·(1 − cos θ) + l − √(l² − (r·sin θ)²)</div>
          <div className="formula">Ap = π·bore²/4 &nbsp;·&nbsp; Vd = Ap·stroke &nbsp;·&nbsp; Vc = Vd/(CR − 1)</div>
          <div className="formula">V(θ) = Vc + Ap·x(θ)</div>
          <div className="formula">Compressao/expansao: p·V^γ = constante</div>
          <div className="formula">Combustao (Wiebe): xb = 1 − exp(−a·τ^(m+1))</div>
          <div className="formula">η_ideal = 1 − 1/CR^(γ−1)</div>
          <div className="formula">τ = (p − p_ref)·dV/dθ &nbsp;·&nbsp; P = τ·ω &nbsp;·&nbsp; ω = 2π·rpm/60</div>
          <div className="formula">λ = AFR_real / AFR_estequiometrico</div>
        </section>

        <section className="section">
          <h2>Valores de referencia do material didatico</h2>
          <p style={{ color: 'var(--text-2)', fontSize: 12 }}>
            <span className="badge-ref">valor de referencia do material didatico</span> — pode variar
            fortemente conforme projeto, carga, combustivel e medicao.
          </p>
          <ul className="list-clean">
            <li>Combustao normal do Ciclo Otto: aproximadamente {REFERENCE_VALUES.normalCombustionDurationMs[0]} a {REFERENCE_VALUES.normalCombustionDurationMs[1]} ms.</li>
            <li>Propagacao de chama normal: ate cerca de {REFERENCE_VALUES.normalFlameSpeedKmh} km/h.</li>
            <li>Temperatura dos gases (normal): faixa aproximada de {REFERENCE_VALUES.normalGasTempC[0]} a {REFERENCE_VALUES.normalGasTempC[1]} °C.</li>
            <li>Pre-ignicao severa: pode superar cerca de {REFERENCE_VALUES.preIgnitionPeakGasTempC} °C (exemplo).</li>
            <li>Pico de pressao: exemplo de pre-ignicao ~{REFERENCE_VALUES.preIgnitionPeakPressureKpa} kPa contra ~{REFERENCE_VALUES.normalPeakPressureKpa} kPa normal.</li>
            <li>Eficiencia convertida em trabalho (aplicacao Otto antiga): ordem de ~{Math.round(REFERENCE_VALUES.historicalOttoUsefulWorkFraction * 100)}% (exemplo historico, nao desempenho de todo motor moderno).</li>
            <li>Temperatura da saia do pistao: faixa de referencia ~{REFERENCE_VALUES.pistonSkirtTempC[0]} a {REFERENCE_VALUES.pistonSkirtTempC[1]} °C.</li>
          </ul>
        </section>

        <section className="section">
          <h2>Escopo e fontes</h2>
          <p style={{ color: 'var(--text-1)', lineHeight: 1.7 }}>
            Conteudo original, baseado em conceitos gerais de motores de combustao interna e no estudo
            de um manual tecnico de referencia, sem redistribuir material protegido. O escopo e
            exclusivo do Ciclo Otto quatro tempos; conteudo exclusivo de Ciclo Diesel foi
            deliberadamente excluido do modelo, das explicacoes e das falhas.
          </p>
        </section>
      </div>
    </div>
  );
}
