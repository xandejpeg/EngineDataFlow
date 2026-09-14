import { Casting, Ring, Turned } from './GolfPrimitives';

export type DeviceShape = 'injector' | 'coil' | 'probe' | 'hall' | 'inductive' | 'ntc' | 'knock' | 'solenoid' | 'cartridge' | 'pressure';

const PLASTIC = '#2b3338';
const DARK = '#1c2225';
const STEEL = '#98a1a6';
const BRASS = '#a8894e';
const RUBBER = '#191d1f';

function Nut({ at, radius = 12, height = 14, color = STEEL }: { at: number; radius?: number; height?: number; color?: string }) {
  return <mesh position={[0, at, 0]}>
    <cylinderGeometry args={[radius, radius, height, 6]} />
    <meshStandardMaterial color={color} metalness={0.72} roughness={0.38} />
  </mesh>;
}

/**
 * Silhueta de cada familia de componente, com o eixo +Y entrando na peca a partir da face do
 * conector. Quem chama gira o grupo para que esse eixo aponte para tras dos terminais.
 */
export function DeviceBody({ shape, tint }: { shape: DeviceShape; tint: string }) {
  const band = <Ring radius={13} tube={2.2} color={tint} position={[0, 5, 0]} />;
  switch (shape) {
    case 'injector':
      return <group>
        <Turned profile={[[0, 0], [13, 0], [13, 28], [10, 32], [10, 58], [0, 58]]} color={PLASTIC} />
        {band}
        <Turned profile={[[0, 56], [10, 56], [12, 60], [12, 74], [5, 80], [4, 112], [2.4, 118], [0, 118]]} color={STEEL} />
        <Ring radius={5.4} tube={1.6} color={BRASS} position={[0, 84, 0]} />
      </group>;
    case 'coil':
      return <group>
        <Turned profile={[[0, 0], [16, 0], [16, 22], [13, 27], [13, 32], [0, 32]]} color={DARK} />
        {band}
        <Turned profile={[[0, 30], [11, 30], [11, 118], [9, 124], [0, 124]]} color={PLASTIC} />
        <Turned profile={[[0, 120], [9, 120], [13, 132], [13, 166], [10, 174], [0, 174]]} color={RUBBER} />
      </group>;
    case 'probe':
      return <group>
        <Turned profile={[[0, 0], [12, 0], [12, 20], [0, 20]]} color={PLASTIC} />
        {band}
        <Turned profile={[[0, 18], [6, 18], [6, 44], [0, 44]]} color="#767f84" />
        <Nut at={52} />
        <Turned profile={[[0, 60], [5.5, 60], [5.5, 84], [3, 90], [0, 90]]} color={STEEL} />
      </group>;
    case 'hall':
      return <group>
        <Casting position={[0, 13, 0]} size={[28, 26, 18]} radius={3} color={PLASTIC} />
        {band}
        <Casting position={[0, 28, 0]} size={[42, 8, 14]} radius={2} color={PLASTIC} />
        <Turned profile={[[0, 30], [7, 30], [7, 52], [0, 52]]} color={DARK} />
      </group>;
    case 'inductive':
      return <group>
        <Turned profile={[[0, 0], [12, 0], [12, 26], [0, 26]]} color={PLASTIC} />
        {band}
        <Casting position={[16, 28, 0]} size={[26, 7, 14]} radius={2} color={PLASTIC} />
        <Turned profile={[[0, 24], [7, 24], [7, 56], [6, 62], [0, 62]]} color={DARK} />
      </group>;
    case 'ntc':
      return <group>
        <Turned profile={[[0, 0], [11, 0], [11, 18], [0, 18]]} color={PLASTIC} />
        {band}
        <Nut at={26} radius={12} height={12} color={BRASS} />
        <Turned profile={[[0, 32], [5, 32], [5, 50], [3, 54], [0, 54]]} color={BRASS} />
      </group>;
    case 'knock':
      return <group>
        <Turned profile={[[0, 0], [12, 0], [12, 14], [0, 14]]} color={PLASTIC} />
        {band}
        <Turned profile={[[8, 14], [26, 14], [26, 30], [8, 30], [8, 14]]} color={DARK} />
        <Turned profile={[[0, 12], [7, 12], [7, 46], [0, 46]]} color={STEEL} />
      </group>;
    case 'solenoid':
      return <group>
        <Turned profile={[[0, 0], [16, 0], [16, 38], [0, 38]]} color={PLASTIC} />
        {band}
        <Casting position={[0, 40, 0]} size={[46, 8, 18]} radius={2} color={PLASTIC} />
        <Turned profile={[[0, 42], [9, 42], [9, 66], [0, 66]]} color={STEEL} />
      </group>;
    case 'cartridge':
      return <group>
        <Turned profile={[[0, 0], [15, 0], [15, 22], [0, 22]]} color={PLASTIC} />
        {band}
        <Casting position={[0, 26, 0]} size={[44, 9, 38]} radius={2} color={PLASTIC} />
        <Casting position={[0, 54, 0]} size={[14, 48, 22]} radius={2} color={DARK} />
      </group>;
    case 'pressure':
      return <group>
        <Casting position={[0, 11, 0]} size={[28, 22, 22]} radius={3} color={PLASTIC} />
        {band}
        <Casting position={[9, 25, 0]} size={[44, 7, 15]} radius={2} color={PLASTIC} />
        <Turned profile={[[0, 26], [7, 26], [7, 44], [6, 48], [0, 48]]} color={STEEL} />
      </group>;
  }
}
