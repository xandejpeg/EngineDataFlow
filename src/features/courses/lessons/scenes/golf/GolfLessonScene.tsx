import { memo, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Crosshair, Maximize2, Minimize2, Pause, Play, RotateCcw, SkipForward, Wrench, Disc3, Gauge, Thermometer, CloudRain, Fuel, SlidersHorizontal, Cable } from 'lucide-react';
import * as THREE from 'three';
import { GolfEngine } from './GolfEngine';
import { GolfSystems } from './GolfSystems';
import { GolfVehicle } from './GolfVehicle';
import { GolfStudioLighting } from './GolfStudioLighting';
import { GolfTransmission } from './GolfTransmission';
import { GolfBrakeControls } from './GolfBrakeControls';
import { GolfBrakeFluidReservoir } from './GolfClutchHydraulics';
import { GolfBrakePanel, type BrakeFocus } from './GolfBrakePanel';
import { GolfWheel } from './GolfWheel';
import { GolfEgasInspection, type EgasFocus } from './GolfEgasInspection';
import { GolfEgasPanel } from './GolfEgasPanel';
import { GolfCoolingPanel } from './GolfCoolingPanel';
import { COOLING_FOCUS_OBJECTS, GolfCoolingInspection, type CoolingFocus } from './GolfCoolingInspection';
import { GolfWiperPanel, type WiperFocus } from './GolfWiperPanel';
import { GolfWiperInspection } from './GolfWiperInspection';
import { wiperViewBounds } from './golfWiperCamera';
import { sampleWipers } from './golfWipers';
import { GolfFuelPanel, type FuelFocus } from './GolfFuelPanel';
import { GolfFuelInspection } from './GolfFuelInspection';
import { fuelViewBounds } from './golfFuelCamera';
import { sampleFuelSender } from './golfFuelSender';
import { sampleEgas } from './golfEgas';
import { initialBrakes, sampleBrakes, type BrakeState } from './golfBrakeHydraulics';
import { VEHICLE_WHEELS } from './golfVehicleGeometry';
import { brakeGeometry } from './golfBrakeGeometry';
import { GOLF_POWERTRAIN_REFERENCE } from './golfPowertrainReference';
import { CLUTCH_RELEASE_REFERENCE } from './golfClutchReference';
import { clutchAxisOffset } from './golfClutchBearingGeometry';
import { CLUTCH_DISC_CANDIDATE, INPUT_SHAFT_REFERENCE } from './golfInputShaftGeometry';
import { GolfStructure } from './GolfFrontStructure';
import { GolfDimensions } from './GolfDimensions';
import { GolfDimensionMarkers } from './GolfDimensionMarkers';
import type { VehicleWheelId } from './golfVehicleGeometry';
import { dimensionCameraFrame } from './golfDimensionCamera';
import { FRONT_ASSEMBLY_REFERENCE, FRONT_BODY_DIMENSIONS, FRONT_LOCATION_REFERENCE, FRONT_STRUCTURE, STRUCTURE_ENVELOPE, VERIFIED_RUNNING_GEAR } from './golfStructureGeometry';
import { coolingSample, fuelSenderSupply, GOLF, initialClock, openCircuits, OPERATING, sampleGolf, wiperSupply, wrap, type GolfClock, type OperatingState } from './golfPhysics';
import { FUEL_LENGTH_MM, FUSE_BOX_POSITIONS, GOLF_PARTS, MOTOR_ORIGIN, partReading, type BodyMode, type GolfView, type Position } from './golfAssembly';
import { tankLitres } from './golfFuelConsumption';
import { electricalPotentials, measureVoltage, FUSE_CIRCUITS, type FuseCircuit } from './golfElectrical';
import { GolfTestPoints } from './GolfTestPoints';
import { TEST_POINTS, testPoint } from './golfService';
import './golf.css';
import { initialBodyControl, sampleBodyControl, DOOR_IDS, type BodyControlState } from './golfBodyControl';
import { bodyPower } from './golfBodyWiring';
import { GolfTimePanel } from './GolfTimePanel';
import { advanceWorld, GOLF_TIME, recordFrame, rewindTo, TIMELINE, type GolfWorld } from './golfTimeline';
import { GolfBodyPanel } from './GolfBodyPanel';
import { COCKPIT } from './golfCockpitGeometry';
import { sampleCockpit } from './golfCockpitSignals';
import { GolfSystemsPanel } from './GolfSystemsPanel';
import { GolfDeviceMap } from './GolfDeviceMap';
import { GolfDevicePanel } from './GolfDevicePanel';
import { golfDevices, type DeviceFilter } from './golfDevices';
import { allSystems, offlineCircuits, type SystemFlags, type SystemId } from './golfSystemToggles';

const lessonClock: MutableRefObject<GolfClock> = { current: initialClock() };
type ClutchFocus = 'mechanism' | 'hydraulics' | 'pack' | 'exploded' | 'gearbox' | null;

function Driver({ clock, playback, report, brakes, reportBrakes, bodyControl }: { clock: MutableRefObject<GolfClock>; playback: MutableRefObject<{ playing: boolean }>; report: (clock: GolfClock) => void; brakes: MutableRefObject<BrakeState>; reportBrakes: (state: BrakeState) => void; bodyControl: MutableRefObject<BodyControlState> }) {
  const refresh = useRef(0);
  const sampler = useRef(0);
  useFrame((_, delta) => {
    const started = GOLF_TIME.time;
    const rpm = sampleGolf(clock.current).rpm;
    const slow = GOLF_TIME.sync && rpm ? 30 / rpm : 1;
    const tick = Math.min(delta, TIMELINE.maxFrameSeconds);
    const move = (playback.current.playing ? tick * GOLF_TIME.rate * slow : 0) + GOLF_TIME.seek;
    GOLF_TIME.seek = 0;
    let world: GolfWorld = { clock: clock.current, brakes: brakes.current, body: bodyControl.current };
    if (move > 0) {
      world = advanceWorld(world, move);
      GOLF_TIME.time = started + move;
    } else if (move < 0) {
      const target = Math.max(GOLF_TIME.floor, started + move);
      const frame = rewindTo(target);
      if (frame) {
        world = frame.time < target ? advanceWorld(frame.state, target - frame.time) : frame.state;
        GOLF_TIME.time = Math.max(frame.time, target);
      }
    }
    GOLF_TIME.delta = GOLF_TIME.time - started;
    clock.current = world.clock;
    brakes.current = world.brakes;
    bodyControl.current = world.body;
    sampler.current += delta;
    if (sampler.current >= TIMELINE.sampleSeconds) { sampler.current = 0; recordFrame({ time: GOLF_TIME.time, state: world }); }
    refresh.current += delta;
    if (refresh.current >= 0.12) { refresh.current = 0; report({ ...clock.current }); reportBrakes({ ...brakes.current }); }
  }, -100);
  return null;
}

function Camera({ view, selected, reset, fuseLocation, structure, structureView, focusWheel, clutchFocus, brakeFocus, bodyView, night, deviceView }: { view: GolfView; selected: number; reset: number; fuseLocation: 'engine' | 'cabin'; structure: boolean; structureView: string; focusWheel: VehicleWheelId | null; clutchFocus: ClutchFocus; brakeFocus: BrakeFocus | null; bodyView: string; night: boolean; deviceView: { id: string; target: Position; distance: number; fit: boolean } | null }) {
  const { camera, size, scene } = useThree();
  const part = GOLF_PARTS.find(item => item.id === selected);
  const focused = structure && focusWheel ? dimensionCameraFrame(focusWheel, size.width, size.height) : null;
  const brakeWheel = VEHICLE_WHEELS.find(wheel => wheel.id === brakeFocus);
  const target: Position = deviceView?.target ?? (brakeFocus ? brakeWheel ? brakeWheel.hub : brakeFocus === 'pedal' ? [-430, 630, 545] : [0, 570, 1300] : clutchFocus ? clutchFocus === 'gearbox' ? [-310, 425, 40] : clutchFocus === 'mechanism' ? [-280, 440, -70] : clutchFocus === 'hydraulics' ? [-430, 635, 335] : clutchFocus === 'exploded' ? [-90, 440, -70] : [-220, 440, -70] : focused ? focused.target : structure ? [0, 850, 1230] : selected === 28 ? FUSE_BOX_POSITIONS[fuseLocation] : part && view !== 'compare' ? part.position : view === 'compare' ? [0, 205, 0] : view === 'engine' ? [165, 625, -20] : [0, 570, 1300]);
  const distance = deviceView ? deviceView.distance : brakeFocus ? brakeWheel ? 680 : brakeFocus === 'pedal' ? 1250 : 4100 : clutchFocus ? clutchFocus === 'gearbox' ? 850 : clutchFocus === 'mechanism' ? 800 : clutchFocus === 'hydraulics' ? 1750 : 1150 : structure ? 3900 : selected === 28 ? 420 : part && view !== 'compare' ? 650 : view === 'compare' ? 580 : view === 'engine' ? 950 : 4100;
  const roadView = !deviceView && night && view === 'vehicle' && !part && !structure && !clutchFocus && !brakeFocus && bodyView === 'front';
  const cockpitView = !deviceView && view === 'vehicle' && !part && !structure && !clutchFocus && !brakeFocus && bodyView === 'interior';
  const cameraTarget: Position = cockpitView ? COCKPIT.driverTarget : roadView ? [0, 400, -1200] : target;
  const [axis, height, depth] = cameraTarget;
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    camera.fov = 42;
    camera.updateProjectionMatrix();
    return () => { camera.fov = 42; camera.updateProjectionMatrix(); };
  }, [camera, cockpitView]);
  useEffect(() => {
    if (cockpitView) {
      camera.position.fromArray(COCKPIT.driverEye);
      camera.lookAt(...COCKPIT.driverTarget);
      camera.updateMatrixWorld(true);
      const steering = scene.getObjectByName('golf-steering-wheel');
      if (camera instanceof THREE.PerspectiveCamera) {
        let tangent = Math.tan(Math.PI / 5);
        if (steering) {
          const bounds = new THREE.Box3().setFromObject(steering);
          for (const horizontal of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) {
            const corner = new THREE.Vector3(horizontal, height, depth).applyMatrix4(camera.matrixWorldInverse);
            tangent = Math.max(tangent, Math.abs(corner.y / corner.z) / 0.92, Math.abs(corner.x / corner.z) * size.height / size.width / 0.92);
          }
        }
        camera.fov = 2 * Math.atan(tangent) * 180 / Math.PI;
      }
      camera.updateProjectionMatrix();
      return;
    }
    if (!clutchFocus && structure && focusWheel) {
      const frame = dimensionCameraFrame(focusWheel, size.width, size.height);
      camera.position.fromArray(frame.position);
      camera.lookAt(...frame.target);
      camera.updateProjectionMatrix();
      return;
    }
    const scale = Math.max(1, 1.3 / (size.width / size.height));
    const direction = deviceView ? new THREE.Vector3(0.8, 0.6, -1) : brakeFocus ? new THREE.Vector3(brakeWheel?.side ?? -0.9, brakeFocus === 'circuit' ? 1.1 : 0.4, 0.65) : clutchFocus === 'gearbox' ? new THREE.Vector3(-0.6, 0.8, -1) : clutchFocus ? new THREE.Vector3(1, 0.55, -0.85) : structure ? structureView === 'top' ? new THREE.Vector3(0, 1, -0.001) : structureView === 'bottom' ? new THREE.Vector3(0.4, -1, -0.5) : new THREE.Vector3(0.9, 0.8, -1) : selected === 28 ? new THREE.Vector3(-1, fuseLocation === 'engine' ? 1.3 : 0.3, -0.6) : view === 'compare' ? new THREE.Vector3(0.45, 0.25, 1) : view === 'engine' || part ? new THREE.Vector3(0.75, 0.5, -1) : bodyView === 'side' ? new THREE.Vector3(1, 0.12, 0) : bodyView === 'rear' ? new THREE.Vector3(1, 0.35, 1.4) : new THREE.Vector3(1, 0.35, -1.4);
    direction.normalize();
    let fittedDistance = distance * scale;
    const vehicle = brakeFocus === 'circuit' ? scene.getObjectByName('golf-brake-inspection') : deviceView?.fit ? scene.getObjectByName('golf-device-map') : !brakeFocus && !clutchFocus && !structure && !deviceView && view !== 'engine' && view !== 'compare' && !part && selected !== 28 ? scene.getObjectByName('golf-vehicle') : null;
    if (structure || vehicle || brakeWheel) {
      scene.updateMatrixWorld(true);
      const wheelExtent = brakeWheel ? brakeGeometry(brakeWheel.axle).radius * Math.SQRT2 + 50 : 0;
      const envelope = brakeWheel ? new THREE.Box3(new THREE.Vector3(...brakeWheel.hub).addScalar(-wheelExtent), new THREE.Vector3(...brakeWheel.hub).addScalar(wheelExtent)) : vehicle ? new THREE.Box3().setFromObject(vehicle) : new THREE.Box3(new THREE.Vector3(...STRUCTURE_ENVELOPE.min), new THREE.Vector3(...STRUCTURE_ENVELOPE.max));
      if (roadView) envelope.expandByPoint(new THREE.Vector3(0, 0, -6000));
      const right = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
      const up = direction.clone().cross(right).normalize();
      const verticalTangent = Math.tan(21 * Math.PI / 180) * 0.88;
      const horizontalTangent = verticalTangent * size.width / size.height;
      fittedDistance = 0;
      for (const cornerX of [envelope.min.x, envelope.max.x]) for (const cornerY of [envelope.min.y, envelope.max.y]) for (const cornerZ of [envelope.min.z, envelope.max.z]) {
        const relative = new THREE.Vector3(cornerX - axis, cornerY - height, cornerZ - depth);
        const towardsCamera = relative.dot(direction);
        fittedDistance = Math.max(fittedDistance, towardsCamera + Math.abs(relative.dot(up)) / verticalTangent, towardsCamera + Math.abs(relative.dot(right)) / horizontalTangent);
      }
    }
    direction.multiplyScalar(fittedDistance);
    camera.position.set(axis + direction.x, height + direction.y, depth + direction.z);
    camera.lookAt(axis, height, depth);
    camera.updateProjectionMatrix();
  }, [camera, scene, size.width, size.height, axis, height, depth, distance, view, part, reset, selected, fuseLocation, structure, structureView, focusWheel, clutchFocus, brakeFocus, brakeWheel, bodyView, roadView, cockpitView, deviceView?.id]);
  return <OrbitControls key={`${view}-${selected}-${reset}-${fuseLocation}-${structure}-${structureView}-${focusWheel}-${clutchFocus}-${brakeFocus}-${bodyView}-${roadView}-${deviceView?.id ?? 'off'}`} makeDefault target={cameraTarget} minDistance={100} maxDistance={18000} enableDamping dampingFactor={0.12} />;
}

const Assembly = memo(function Assembly({ view, body, clock, scanner, fault, selected, select, fuseLocation, inspection, wheelsMounted, brakes, bodyControl, show }: {
  view: GolfView; body: BodyMode; clock: MutableRefObject<GolfClock>; scanner: boolean; fault: boolean; selected: number; select: (id: number) => void; fuseLocation: 'engine' | 'cabin'; inspection: boolean; wheelsMounted: boolean; brakes: MutableRefObject<BrakeState>; bodyControl: MutableRefObject<BodyControlState>; show: SystemFlags;
}) {
  const part = GOLF_PARTS.find(item => item.id === selected);
  if (view === 'compare') return <group>
    <group position={[-105, 0, 0]} name="golf-comparison-homogeneous"><GolfEngine clock={clock} cutaway single mode="homogeneous" /></group>
    <group position={[105, 0, 0]} name="golf-comparison-stratified"><GolfEngine clock={clock} cutaway single mode="stratified" /></group>
  </group>;
  return <group onClick={event => {
    let object: THREE.Object3D | null = event.object;
    while (object && !object.userData.golfPart) object = object.parent;
    if (object?.userData.golfPart) { event.stopPropagation(); select(Number(object.userData.golfPart)); }
  }}>
    <group position={MOTOR_ORIGIN} rotation={[GOLF.tilt, Math.PI, 0]} visible={show.engine}>
      <GolfEngine clock={clock} cutaway={body !== 'solid'} />
    </group>
    <GolfSystems clock={clock} cutaway={body !== 'solid'} scanner={scanner} fault={fault} inspectFuses={selected === 28} show={show} />
    {!inspection && <GolfVehicle clock={clock} mode={body} wheelsMounted={body !== 'assembly' || wheelsMounted} brakes={brakes} bodyControl={bodyControl} show={show} />}
    {part && !inspection && <mesh position={selected === 28 ? FUSE_BOX_POSITIONS[fuseLocation] : part.position} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[47, 2, 8, 40]} /><meshBasicMaterial color="#008b8b" depthTest={false} /></mesh>}
  </group>;
});

function SignalTrace({ angle, camAdvance }: { angle: number; camAdvance: number }) {
  const ckp: string[] = [];
  const cmp: string[] = [];
  for (let degree = 0; degree <= 720; degree += 1) {
    ckp.push(`${degree},${Math.floor(wrap(degree, 360) / 6) < 58 && wrap(degree, 6) < 3 ? 8 : 27}`);
    cmp.push(`${degree},${wrap(degree + camAdvance) < 30 ? 41 : 58}`);
  }
  return <svg className="golf-trace" viewBox="0 0 720 66" role="img" aria-label="Referencia angular CKP 60-2 e CMP, 0 a 720 graus">
    <polyline points={ckp.join(' ')} stroke="#168295" fill="none" strokeWidth="1.4" />
    <polyline points={cmp.join(' ')} stroke="#bd7752" fill="none" strokeWidth="2" />
    <line x1={angle} x2={angle} y1="0" y2="66" stroke="#ad3148" strokeWidth="2" />
  </svg>;
}

function GolfLessonScene({ view }: { view: GolfView }) {
  const playback = useRef({ playing: true });
  const brakes = useRef(initialBrakes());
  const [brakeSnapshot, setBrakeSnapshot] = useState(initialBrakes);
  const [brakeFocus, setBrakeFocus] = useState<BrakeFocus | null>(null);
  const [egasFocus, setEgasFocus] = useState<EgasFocus | null>(null);
  const [coolingFocus, setCoolingFocus] = useState(false);
  const [coolingPart, setCoolingPart] = useState<CoolingFocus>('circuit');
  const [wiperFocus, setWiperFocus] = useState<WiperFocus | null>(null);
  const [fuelFocus, setFuelFocus] = useState<FuelFocus | null>(null);
  const [bodyView, setBodyView] = useState('front');
  const bodyControl = useRef(initialBodyControl());
  const [bodyPanel, setBodyPanel] = useState(false);
  const [night, setNight] = useState(false);
  const [snapshot, setSnapshot] = useState<GolfClock>(() => ({ ...lessonClock.current }));
  const [playing, setPlaying] = useState(true);
  const [body, setBody] = useState<BodyMode>(view === 'vehicle' ? 'solid' : view === 'engine' ? 'cutaway' : 'ghost');
  const [wheelsMounted, setWheelsMounted] = useState(true);
  const [selected, setSelected] = useState(0);
  const [reset, setReset] = useState(0);
  const [scanner, setScanner] = useState(false);
  const [fault, setFault] = useState(false);
  const [fuseLocation, setFuseLocation] = useState<'engine' | 'cabin'>('engine');
  const [inspection, setInspection] = useState(false);
  const [clutchFocus, setClutchFocus] = useState<ClutchFocus>(null);
  const [clutchHousing, setClutchHousing] = useState(false);
  const [selectedGear, setSelectedGear] = useState(0);
  const [structure, setStructure] = useState(false);
  const [dimensionMarkers, setDimensionMarkers] = useState(false);
  const [dimensionFocus, setDimensionFocus] = useState(false);
  const [dimensionWheel, setDimensionWheel] = useState<VehicleWheelId>('front-left');
  const [structureView, setStructureView] = useState('perspective');
  const [structureLayers, setStructureLayers] = useState({ monocoque: true, subframe: true, rear: true, cabin: true, rearSubframe: true });
  const [redPoint, setRedPoint] = useState('ecu-in');
  const [blackPoint, setBlackPoint] = useState('bodyGround');
  const [activeProbe, setActiveProbe] = useState<'red' | 'black'>('red');
  const [message, setMessage] = useState('');
  const [systemsPanel, setSystemsPanel] = useState(false);
  const [deviceFocus, setDeviceFocus] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('all');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [deviceRole, setDeviceRole] = useState(true);
  const [deviceLabels, setDeviceLabels] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [systemPower, setSystemPower] = useState<SystemFlags>(() => allSystems(true));
  const [systemShow, setSystemShow] = useState<SystemFlags>(() => ({ ...allSystems(true), bodyLoom: initialBodyControl().showWiring }));
  const root = useRef<HTMLElement>(null);
  const frame = sampleGolf(snapshot);
  const part = GOLF_PARTS.find(item => item.id === selected);
  // Sem selecao a camera enquadra o conjunto inteiro pela caixa da cena; com selecao aproxima do componente escolhido.
  const deviceTarget = deviceFocus ? golfDevices().find(device => device.id === deviceId)?.at ?? null : null;
  const deviceView = deviceFocus
    ? { id: deviceId ?? `todos-${deviceFilter}`, target: deviceTarget ?? [0, 560, 300] as Position, distance: 215, fit: !deviceTarget }
    : null;
  const voltage = measureVoltage(electricalPotentials(snapshot.operation !== 'off', openCircuits(snapshot), frame.volts), testPoint(redPoint)?.node ?? null, testPoint(blackPoint)?.node ?? null);

  const seek = (angle: number) => {
    playback.current.playing = false;
    setPlaying(false);
    lessonClock.current = { ...lessonClock.current, angle: Math.floor(lessonClock.current.angle / 720) * 720 + wrap(angle) };
    setSnapshot({ ...lessonClock.current });
  };
  const changeOperation = (operation: OperatingState) => {
    const previous = lessonClock.current;
    lessonClock.current = { ...initialClock(operation), angle: previous.angle, fuel: previous.fuel, fuelSender: previous.fuelSender, nox: previous.nox, openFuse: previous.openFuse, powerOff: previous.powerOff, egas: previous.egas, temperature: previous.temperature, cooling: previous.cooling, wipers: previous.wipers };
    setSnapshot({ ...lessonClock.current });
  };
  const changeFuse = (openFuse: FuseCircuit | null) => {
    lessonClock.current = { ...lessonClock.current, openFuse };
    setSnapshot({ ...lessonClock.current });
  };
  const applySystemPower = (next: SystemFlags, changed: readonly SystemId[]) => {
    setSystemPower(next);
    let clock = { ...lessonClock.current, powerOff: offlineCircuits(next) };
    if (changed.includes('engine')) clock = next.engine
      ? (clock.operation === 'off' ? { ...initialClock('idle'), angle: clock.angle, fuel: clock.fuel, fuelSender: clock.fuelSender, nox: clock.nox, openFuse: clock.openFuse, powerOff: clock.powerOff, egas: clock.egas, temperature: clock.temperature, cooling: clock.cooling, wipers: clock.wipers } : clock)
      : { ...initialClock('off'), angle: clock.angle, fuel: clock.fuel, fuelSender: clock.fuelSender, nox: clock.nox, openFuse: clock.openFuse, powerOff: clock.powerOff, egas: clock.egas, temperature: clock.temperature, cooling: clock.cooling, wipers: clock.wipers };
    if (changed.includes('egas') && !next.egas) clock = { ...clock, egas: { ...clock.egas, enabled: false, pedal: 0 } };
    if (changed.includes('wipers')) clock = { ...clock, wipers: { ...clock.wipers, fuseOpen: !next.wipers, mode: next.wipers ? clock.wipers.mode : 'off' } };
    if (changed.includes('brakes')) { brakes.current = { ...brakes.current, assisted: next.brakes }; setBrakeSnapshot({ ...brakes.current }); }
    lessonClock.current = clock;
    setSnapshot({ ...lessonClock.current });
  };
  const applySystemShow = (next: SystemFlags, changed: readonly SystemId[]) => {
    setSystemShow(next);
    if (changed.includes('bodyLoom')) bodyControl.current = { ...bodyControl.current, showWiring: next.bodyLoom };
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen().catch(() => setMessage('Tela cheia indisponivel neste navegador.'));
  };
  // Esc sai do modo nativo sem passar pelo botao, entao o estado vem do documento.
  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  return <section ref={root} className="golf-lab" aria-label="Motor completo do Golf FSI" data-view={view} data-angle={frame.theta.toFixed(2)} data-running={playing} data-inspection={inspection} data-structure={structure} data-clutch-focus={clutchFocus ?? 'none'} data-brake-focus={brakeFocus ?? 'none'} data-egas-focus={egasFocus ?? 'none'} data-cooling-focus={coolingFocus} data-wiper-focus={wiperFocus ?? 'none'} data-fuel-focus={fuelFocus ?? 'none'}>
    <div className="golf-toolbar">
      <div className="golf-identity"><strong>Golf V <span>2.0 FSI</span></strong><small title="Referencia didatica do motor: AXW / SSP 322">2WD / tracao dianteira</small></div>
      {view !== 'compare' && <div className="golf-segments" role="group" aria-label="Visualizacao">
        {([['solid', 'Carro'], ['ghost', 'Fantasma'], ['assembly', 'Montagem'], ['cutaway', 'Corte']] as const).map(([value, label]) => <button type="button" key={value} aria-pressed={!fuelFocus && !wiperFocus && !coolingFocus && !egasFocus && !brakeFocus && !clutchFocus && !structure && body === value} onClick={() => { setFuelFocus(null); setWiperFocus(null); setCoolingFocus(false); setEgasFocus(null); setBrakeFocus(null); setClutchFocus(null); setStructure(false); setInspection(false); setSelected(0); setReset(previous => previous + 1); setBody(value); setDeviceFocus(false); }}>{label}</button>)}
        <button type="button" aria-pressed={structure} onClick={() => { setFuelFocus(null); setWiperFocus(null); setCoolingFocus(false); setEgasFocus(null); setBrakeFocus(null); setClutchFocus(null); setStructure(true); setInspection(false); setSelected(0); setDeviceFocus(false); playback.current.playing = false; setPlaying(false); }}>Estrutura</button>
      </div>}
      <label className="golf-select"><span>Operacao</span><select aria-label="Estado de operacao" value={snapshot.operation} onChange={event => changeOperation(event.target.value as OperatingState)}>{Object.entries(OPERATING).map(([id, value]) => <option key={id} value={id}>{value.label}</option>)}</select></label>
      {view !== 'compare' && body === 'assembly' && !fuelFocus && !wiperFocus && !coolingFocus && !egasFocus && !brakeFocus && !structure && !clutchFocus && !inspection && <label className="golf-select"><input type="checkbox" checked={wheelsMounted} onChange={event => setWheelsMounted(event.target.checked)} />Pneus e aros</label>}
      {view === 'vehicle' && !fuelFocus && !wiperFocus && !coolingFocus && !egasFocus && !brakeFocus && !structure && !clutchFocus && !inspection && <label className="golf-select"><span>Vista do carro</span><select aria-label="Vista externa" value={bodyView} onChange={event => { setBodyView(event.target.value); setSelected(0); }}><option value="front">Frente</option><option value="side">Perfil</option><option value="rear">Traseira</option><option value="interior">Interior</option></select></label>}
      {view !== 'compare' && <button className="golf-service" type="button" aria-pressed={inspection} onClick={() => { setFuelFocus(null); setWiperFocus(null); setCoolingFocus(false); setEgasFocus(null); setBrakeFocus(null); setClutchFocus(null); setStructure(false); setInspection(!inspection); setDeviceFocus(false); setSelected(inspection ? 0 : 28); setFuseLocation('engine'); setBody('cutaway'); }}><Wrench size={17} />Inspecao do cofre</button>}
      {view !== 'compare' && <button className="golf-service" type="button" aria-pressed={Boolean(clutchFocus)} onClick={() => { setFuelFocus(null); setWiperFocus(null); setCoolingFocus(false); setEgasFocus(null); setBrakeFocus(null); setClutchFocus(clutchFocus ? null : 'mechanism'); setDeviceFocus(false); setStructure(false); setInspection(false); setSelected(0); }}><Disc3 size={17} />Embreagem</button>}
      {view !== 'compare' && <button className="golf-service" type="button" aria-pressed={Boolean(brakeFocus)} onClick={() => { setFuelFocus(null); setWiperFocus(null); setCoolingFocus(false); setEgasFocus(null); setBrakeFocus(brakeFocus ? null : 'circuit'); setDeviceFocus(false); setClutchFocus(null); setStructure(false); setInspection(false); setSelected(0); }}><Disc3 size={17} />Freios</button>}
      {view !== 'compare' && <button className="golf-service" type="button" aria-pressed={Boolean(egasFocus)} onClick={() => { setFuelFocus(null); setWiperFocus(null); setCoolingFocus(false); setEgasFocus(egasFocus ? null : 'circuit'); setDeviceFocus(false); setBrakeFocus(null); setClutchFocus(null); setStructure(false); setInspection(false); setSelected(0); }}><Gauge size={17} />Acelerador</button>}
      {view !== 'compare' && <button className="golf-service" type="button" aria-pressed={coolingFocus} onClick={() => { setFuelFocus(null); setWiperFocus(null); setCoolingFocus(!coolingFocus); setDeviceFocus(false); setEgasFocus(null); setBrakeFocus(null); setClutchFocus(null); setStructure(false); setInspection(false); setSelected(0); }}><Thermometer size={17} />Arrefecimento</button>}
      {view !== 'compare' && <button className="golf-service" type="button" aria-pressed={Boolean(wiperFocus)} onClick={() => { setFuelFocus(null); setWiperFocus(wiperFocus ? null : 'circuit'); setDeviceFocus(false); setCoolingFocus(false); setEgasFocus(null); setBrakeFocus(null); setClutchFocus(null); setStructure(false); setInspection(false); setSelected(0); }}><CloudRain size={17} />Limpadores</button>}
      {view !== 'compare' && <button className="golf-service" type="button" aria-pressed={Boolean(fuelFocus)} onClick={() => { setFuelFocus(fuelFocus ? null : 'circuit'); setDeviceFocus(false); setWiperFocus(null); setCoolingFocus(false); setEgasFocus(null); setBrakeFocus(null); setClutchFocus(null); setStructure(false); setInspection(false); setSelected(0); }}><Fuel size={17} />Combustivel</button>}
      <button className="golf-icon" type="button" title="Restaurar enquadramento" aria-label="Restaurar enquadramento" onClick={() => { setSelected(0); setReset(reset + 1); }}><Crosshair size={17} /></button>
      {view !== 'compare' && <button className="golf-service" type="button" aria-pressed={deviceFocus} onClick={() => { setFuelFocus(null); setWiperFocus(null); setCoolingFocus(false); setEgasFocus(null); setBrakeFocus(null); setClutchFocus(null); setStructure(false); setInspection(false); setSelected(0); setDeviceId(null); setDeviceFocus(!deviceFocus); }}><Cable size={17} />Sensores e atuadores</button>}
      {view !== 'compare' && <button className="golf-service" type="button" aria-pressed={systemsPanel} onClick={() => setSystemsPanel(!systemsPanel)}><SlidersHorizontal size={17} />Sistemas</button>}
      {view === 'vehicle' && <button type="button" className="golf-service" aria-pressed={bodyPanel && !fuelFocus && !wiperFocus && !coolingFocus && !egasFocus && !brakeFocus && !clutchFocus && !structure && !inspection} onClick={() => { setBodyPanel(!bodyPanel); setDeviceFocus(false); setFuelFocus(null); setWiperFocus(null); setCoolingFocus(false); setEgasFocus(null); setBrakeFocus(null); setClutchFocus(null); setStructure(false); setInspection(false); setSelected(0); setBody('solid'); setReset(previous => previous + 1); }}><Wrench size={17} />Carroceria</button>}
    </div>
    <div className="golf-workspace">
      <div className="golf-canvas-wrap">
        <button className="golf-icon golf-fullscreen-toggle" type="button" title={fullscreen ? 'Sair da tela cheia (Esc)' : 'Tela cheia'} aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia do motor'} aria-pressed={fullscreen} onClick={toggleFullscreen}>{fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
        {view === 'compare' && <div className="golf-comparison-labels"><span>Homogeneo <small>Injecao na admissao</small></span><span>Estratificado <small>Injecao na compressao</small></span></div>}
        <Canvas camera={{ fov: 42, near: 1, far: 30000, position: [2500, 2200, -2000] }} dpr={[1, 1.5]} gl={{ antialias: true }} onCreated={({ gl, scene, camera }) => {
          gl.domElement.setAttribute('aria-label', 'Cena 3D do motor FSI');
          gl.domElement.dataset.golfCanvas = 'true';
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectBodyFit: () => {
            scene.updateMatrixWorld(true);
            const hatchSkin = scene.getObjectByName('golf-hatch-skin');
            const clearance = [-1, 1].map(side => {
              const lens = scene.getObjectByName(`golf-tail-${side}-inner`) as THREE.Mesh | undefined;
              if (!lens || !hatchSkin) return null;
              const point = new THREE.Vector3().fromBufferAttribute(lens.geometry.getAttribute('position'), 0);
              const start = point.clone().add(new THREE.Vector3(0, 0, 100)).applyMatrix4(lens.matrixWorld);
              const direction = new THREE.Vector3(0, 0, -1).transformDirection(lens.matrixWorld);
              const hit = new THREE.Raycaster(start, direction).intersectObject(hatchSkin, false)[0];
              return hit ? hit.distance - 100 : null;
            });
            const hood = scene.getObjectByName('golf-hood-skin') as THREE.Mesh | undefined;
            const vertices = hood?.geometry.getAttribute('position');
            const hoodWidths = vertices ? [vertices.getX(16) - vertices.getX(0), vertices.getX(vertices.count - 1) - vertices.getX(vertices.count - 17)] : [];
            return { clearance, hoodWidths, hoodMatrix: hood?.matrixWorld.toArray(), fenderMatrices: [-1, 1].map(side => scene.getObjectByName(`golf-fender-shoulder-${side}`)?.matrixWorld.toArray()) };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectBodyControl: () => {
            scene.updateMatrixWorld(true);
            const state = bodyControl.current;
            const output = sampleBodyControl(state, bodyPower(lessonClock.current, brakes.current));
            const object = (name: string) => scene.getObjectByName(name);
            const lights: { name: string; intensity: number; position: number[] }[] = [];
            object('golf-body-details')?.traverse(child => { if (child instanceof THREE.SpotLight) lights.push({ name: child.name, intensity: child.intensity, position: child.getWorldPosition(new THREE.Vector3()).toArray() }); });
            return { ...state, output, engineAngle: lessonClock.current.angle, brakePedal: brakes.current.pedal,
              rearPlateMatrix: object('golf-rear-number-plate')?.matrixWorld.toArray(),
              mirrors3d: ['front-left', 'front-right'].map(id => {
                const mirror = object(`golf-door-mirror-${id}`);
                return { id, parent: mirror?.parent?.name, matrix: mirror?.matrixWorld.toArray(), localMatrix: mirror?.matrix.toArray() };
              }),
              rearQuarters: ['rear-left', 'rear-right'].map(id => {
                const quarter = object(`golf-door-quarter-${id}`);
                return { id, parent: quarter?.parent?.name, matrix: quarter?.matrixWorld.toArray(), localMatrix: quarter?.matrix.toArray() };
              }),
              trim3d: DOOR_IDS.map(id => {
                const trim = object(`golf-door-upholstery-${id}`);
                const pocket = object(`golf-door-pocket-${id}`);
                const opening = pocket?.localToWorld(new THREE.Vector3(0, 80, 0));
                const direction = pocket?.getWorldQuaternion(new THREE.Quaternion());
                const hits = pocket && opening && direction ? new THREE.Raycaster(opening, new THREE.Vector3(0, -1, 0).applyQuaternion(direction)).intersectObject(pocket, true) : [];
                return { id, parent: trim?.parent?.name, matrix: trim?.matrixWorld.toArray(), localMatrix: trim?.matrix.toArray(), pocketDepth: hits[0]?.distance };
              }),
              doors3d: DOOR_IDS.map(id => ({ id, angle: object(`golf-door-${id}`)?.rotation.y, glassY: object(`golf-door-glass-${id}`)?.position.y, glassVisible: object(`golf-door-window-pane-${id}`)?.visible, handle: object(`golf-door-outer-handle-${id}`)?.getWorldPosition(new THREE.Vector3()).toArray(), handleProjected: object(`golf-door-outer-handle-${id}`)?.getWorldPosition(new THREE.Vector3()).project(camera).toArray() })),
              hoodAngle: object('golf-hood-motion')?.rotation.x, hatchAngle: object('golf-hatch-motion')?.rotation.x,
              propData: object('golf-hood-prop')?.userData,
              struts: ['left', 'right'].map(side => object(`golf-hatch-strut-${side}`)?.userData),
              lights, wiringVisible: object('golf-body-wiring')?.visible,
              cargo: Boolean(object('golf-cargo-area')),
            };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectCockpit: () => {
            scene.updateMatrixWorld(true);
            const names = ['golf-dashboard', 'golf-steering-wheel', 'golf-fuel-gauge', 'golf-wiper-stalk-grip'];
            const steering = scene.getObjectByName('golf-steering-wheel');
            const steeringBounds = steering ? new THREE.Box3().setFromObject(steering) : null;
            const steeringProjected: number[][] = [];
            if (steeringBounds) for (const horizontal of [steeringBounds.min.x, steeringBounds.max.x]) for (const height of [steeringBounds.min.y, steeringBounds.max.y]) for (const depth of [steeringBounds.min.z, steeringBounds.max.z]) {
              steeringProjected.push(new THREE.Vector3(horizontal, height, depth).project(camera).toArray());
            }
            return {
              steeringProjected,
              source: sampleCockpit(lessonClock.current),
              rendered: scene.getObjectByName('golf-cockpit-instruments')?.userData,
              needleAngles: ['rpm', 'temperature'].map(kind => scene.getObjectByName(`golf-cockpit-${kind}-needle`)?.rotation.z),
              camera: camera.position.toArray(), fov: camera instanceof THREE.PerspectiveCamera ? camera.fov : null,
              objects: names.map(name => {
                const object = scene.getObjectByName(name);
                return { name, present: Boolean(object), projected: object?.getWorldPosition(new THREE.Vector3()).project(camera).toArray() };
              }),
              wiperMode: lessonClock.current.wipers.mode,
            };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectEgas: () => {
            scene.updateMatrixWorld(true);
            const state = lessonClock.current;
            const sample = sampleGolf(state);
            const pedal = scene.getObjectByName('golf-accelerator-pedal');
            const focus = scene.getObjectByName('golf-egas-inspection')?.userData.focus;
            const names = focus === 'pedal' ? ['golf-accelerator-assembly'] : focus === 'throttle' ? ['golf-throttle-body'] : ['golf-accelerator-assembly', 'golf-throttle-body', 'golf-egas-ecu', 'golf-egas-harness'];
            const projected: number[][] = [];
            for (const name of names) {
              const object = scene.getObjectByName(name);
              if (!object) continue;
              const box = new THREE.Box3().setFromObject(object);
              for (const axis of [box.min.x, box.max.x]) for (const height of [box.min.y, box.max.y]) for (const depth of [box.min.z, box.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
            }
            const wires: { name: string; from: number[]; to: number[] }[] = [];
            scene.traverse(object => { if (object.name.startsWith('golf-egas-wire-')) wires.push({ name: object.name, from: object.userData.from, to: object.userData.to }); });
            return { ...state.egas, electrical: sampleEgas({ ...state.egas, opening: sample.throttle }, sample.electrical.ecu), throttle: sample.throttle, rpm: sample.rpm, engineAngle: state.angle, butterflyAngle: scene.getObjectByName('golf-throttle-butterfly')?.rotation.z, pedalAngle: pedal?.rotation.x,
              pedalPoint: pedal ? new THREE.Vector3(0, -75, 134).applyMatrix4(pedal.matrixWorld).project(camera).toArray() : null,
              plugs: ['golf-egas-pedal-plug', 'golf-egas-ecu-plug', 'golf-egas-throttle-plug'].map(name => ({ name, position: scene.getObjectByName(name)?.getWorldPosition(new THREE.Vector3()).toArray() })), wires, projected, camera: camera.position.toArray() };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectBrakeHydraulics: () => {
            scene.updateMatrixWorld(true);
            const pedal = scene.getObjectByName('golf-brake-pedal');
            const focus = scene.getObjectByName('golf-brake-inspection')?.userData.focus as BrakeFocus | undefined;
            const names = focus === 'pedal' ? ['golf-brake-pedal', 'golf-brake-master-pistons', 'golf-brake-fluid-reservoir'] : focus && focus !== 'circuit' ? [`golf-brake-rotor-${focus}`, `golf-brake-fixed-${focus}`] : ['golf-brake-control', ...VEHICLE_WHEELS.map(wheel => `golf-brake-fixed-${wheel.id}`)];
            const projected: number[][] = [];
            for (const name of names) {
              const object = scene.getObjectByName(name);
              if (!object) continue;
              const box = new THREE.Box3().setFromObject(object);
              for (const axis of [box.min.x, box.max.x]) for (const height of [box.min.y, box.max.y]) for (const depth of [box.min.z, box.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
            }
            return { ...brakes.current, sample: sampleBrakes(brakes.current), pedalAngle: pedal?.rotation.x, pedalPoint: pedal ? new THREE.Vector3(0, -290, 194).applyMatrix4(pedal.matrixWorld).project(camera).toArray() : null, masterOffset: scene.getObjectByName('golf-brake-master-pistons')?.position.z, projected,
              wheels: VEHICLE_WHEELS.map(wheel => ({ id: wheel.id, inlet: scene.getObjectByName(`golf-brake-inlet-${wheel.id}`)?.getWorldPosition(new THREE.Vector3()).toArray(), lineEnd: scene.getObjectByName(`golf-brake-line-${wheel.id}`)?.userData.inlet, pads: [0, 1].map(index => scene.getObjectByName(`golf-brake-pad-${wheel.id}-${index}`)?.position.x), rotor: scene.getObjectByName(`golf-brake-rotor-${wheel.id}`)?.matrixWorld.toArray(), fixed: scene.getObjectByName(`golf-brake-fixed-${wheel.id}`)?.matrixWorld.toArray() })) };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectBrakes: () => {
            scene.updateMatrixWorld(true);
            return ['front-left', 'front-right', 'rear-left', 'rear-right'].map(id => {
              const wheel = scene.getObjectByName(`golf-wheel-${id}`);
              const rotor = scene.getObjectByName(`golf-brake-rotor-${id}`);
              const fixed = scene.getObjectByName(`golf-brake-fixed-${id}`);
              const mounted = scene.getObjectByName(`golf-wheel-mounted-${id}`);
              const rim = scene.getObjectByName(`golf-rim-face-${id}`);
              const spokes = rim?.children.filter(child => child.name.startsWith(`golf-rim-spoke-${id}-`)) ?? [];
              const projected: number[][] = [];
              if (rotor && fixed) {
                const bounds = new THREE.Box3().setFromObject(rotor).union(new THREE.Box3().setFromObject(fixed));
                for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
              }
              return { id, exists: Boolean(wheel && rotor && fixed), mounted: mounted?.visible, rimParent: rim?.parent?.name, rim: rim?.matrixWorld.toArray(), spokeCount: spokes.length, position: wheel?.getWorldPosition(new THREE.Vector3()).toArray(), rotor: rotor?.matrixWorld.toArray(), fixed: fixed?.matrixWorld.toArray(), projected, status: wheel?.userData.dimensionalStatus };
            });
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectGearbox: () => {
            scene.updateMatrixWorld(true);
            const assembly = scene.getObjectByName('golf-gearbox-internals');
            return { ...assembly?.userData, objects: ['golf-gearbox-shafts', 'golf-gearbox-synchronizers', 'golf-gearbox-selector', 'golf-differential', ...Array.from({ length: 6 }, (_, index) => `golf-gear-pair-${index + 1}`)].map(name => {
              const object = scene.getObjectByName(name);
              const projected: number[][] = [];
              if (object) {
                const bounds = new THREE.Box3().setFromObject(object);
                for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
              }
              return { name, exists: Boolean(object), projected };
            }) };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectFuelLevel: () => {
            scene.updateMatrixWorld(true);
            const state = lessonClock.current;
            const focus = (scene.getObjectByName('golf-fuel-inspection')?.userData.focus ?? 'circuit') as FuelFocus;
            const bounds = fuelViewBounds(focus);
            const projected: number[][] = [];
            for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
            return { ...state.fuelSender, ...sampleFuelSender(state.fuelSender, state.fuel, fuelSenderSupply(state)), level: state.fuel, engineAngle: state.angle, temperature: state.temperature, wipersElapsed: state.wipers.elapsed, pumpPowered: sampleGolf(state).pumpLow, camera: camera.position.toArray(), projected,
              floatPosition: scene.getObjectByName('golf-fuel-float')?.getWorldPosition(new THREE.Vector3()).toArray(),
              floatAngle: scene.getObjectByName('golf-fuel-float-arm')?.rotation.z,
              needleRotation: scene.getObjectByName('golf-fuel-gauge-needle')?.rotation.z,
              liquidSurface: 325 + 260 * state.fuel,
              wires: scene.getObjectByName('golf-fuel-sender-harness')?.children.map(object => ({ name: object.name, from: object.userData.from, to: object.userData.to })) ?? [],
            };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectWipers: () => {
            scene.updateMatrixWorld(true);
            const focus = (scene.getObjectByName('golf-wiper-inspection')?.userData.focus ?? 'circuit') as WiperFocus;
            const bounds = wiperViewBounds(focus);
            const projected: number[][] = [];
            for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
            return { ...lessonClock.current.wipers, ...sampleWipers(lessonClock.current.wipers, wiperSupply(lessonClock.current)), engineAngle: lessonClock.current.angle, camera: camera.position.toArray(), projected,
              stalkPoint: scene.getObjectByName('golf-wiper-stalk-grip')?.getWorldPosition(new THREE.Vector3()).project(camera).toArray(),
              stalkAngle: scene.getObjectByName('golf-wiper-stalk-lever')?.rotation.z,
              washerPoint: scene.getObjectByName('golf-washer-pump')?.getWorldPosition(new THREE.Vector3()).toArray(),
              arms: [0, 1].map(index => ({ rotation: scene.getObjectByName(`golf-wiper-arm-${index}`)?.rotation.z, tip: scene.getObjectByName(`golf-wiper-tip-${index}`)?.getWorldPosition(new THREE.Vector3()).toArray() })),
              links: Array.from({ length: 5 }, (_, index) => { const object = scene.getObjectByName(`golf-wiper-link-${index}`); return { length: object?.scale.y, visible: object?.visible, ends: object ? [-0.5, 0.5].map(height => new THREE.Vector3(0, height, 0).applyMatrix4(object.matrixWorld).toArray()) : [] }; }),
              wires: scene.getObjectByName('golf-wiper-harness')?.children.map(object => object.name) ?? [],
            };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectCooling: () => {
            scene.updateMatrixWorld(true);
            const focus = (scene.getObjectByName('golf-cooling-inspection')?.userData.focus ?? 'circuit') as CoolingFocus;
            const root = scene.getObjectByName(COOLING_FOCUS_OBJECTS[focus]);
            const projected: number[][] = [];
            if (root) {
              const bounds = new THREE.Box3().setFromObject(root);
              for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
            }
            return { ...lessonClock.current.cooling, ...coolingSample(lessonClock.current), temperature: lessonClock.current.temperature, angle: lessonClock.current.angle,
              fanRotation: scene.getObjectByName('golf-cooling-fan')?.rotation.z,
              pumpRotation: scene.getObjectByName('golf-water-pump-impeller')?.rotation.x,
              valveLift: scene.getObjectByName('golf-thermostat-valve')?.position.y,
              camera: camera.position.toArray(), projected,
              markers: scene.getObjectByName('golf-coolant-flow-markers')?.children.map(marker => ({ name: marker.name, visible: marker.visible, flowLpm: marker.userData.flowLpm as number, position: marker.position.toArray() })) ?? [],
            };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectAuxiliaries: () => {
            scene.updateMatrixWorld(true);
            return { temperature: lessonClock.current.temperature, fanPowered: coolingSample(lessonClock.current).fanPowered, fanAngle: scene.getObjectByName('golf-cooling-fan')?.rotation.z,
              objects: ['golf-cooling-system', 'golf-climate-system', 'golf-powertrain-mounts', 'golf-washer-system'].map(name => {
                const object = scene.getObjectByName(name);
                const bounds = object ? new THREE.Box3().setFromObject(object) : null;
                const projected: number[][] = [];
                if (bounds) for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
                return { name, exists: Boolean(object), status: object?.userData.dimensionalStatus, projected };
              }) };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectClutchPack: () => {
            scene.updateMatrixWorld(true);
            const root = scene.getObjectByName('golf-clutch-pack');
            return { ...root?.userData, angle: scene.getObjectByName('golf-clutch-pack-rotation')?.rotation.y, objects: ['golf-flywheel', 'golf-clutch-disc', 'golf-clutch-pressure-plate', 'golf-clutch-cover'].map(name => {
              const object = scene.getObjectByName(name);
              const projected: number[][] = [];
              const bounds = object ? new THREE.Box3().setFromObject(object) : null;
              if (bounds) for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
              return { name, exists: Boolean(object), position: object?.getWorldPosition(new THREE.Vector3()).toArray(), min: bounds?.min.toArray(), max: bounds?.max.toArray(), projected };
            }) };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectVehicleAssembly: () => {
            scene.updateMatrixWorld(true);
            return ['golf-cabin', 'golf-chassis', 'golf-body-panels', 'golf-steering', 'golf-brake-control', 'golf-suspension-front-left', 'golf-suspension-front-right', 'golf-suspension-rear-left', 'golf-suspension-rear-right', 'golf-halfshaft-front-left', 'golf-halfshaft-front-right'].map(name => {
              const object = scene.getObjectByName(name);
              let visible = Boolean(object);
              for (let parent = object; parent; parent = parent.parent ?? undefined) visible = visible && parent.visible;
              const bounds = object ? new THREE.Box3().setFromObject(object) : null;
              return { name, visible, status: object?.userData.dimensionalStatus, min: bounds?.min.toArray(), max: bounds?.max.toArray() };
            });
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectTransmission: () => {
            scene.updateMatrixWorld(true);
            const names = ['golf-clutch-slave', 'golf-clutch-release', 'golf-clutch-bearing-assembly', 'golf-clutch-hydraulics', 'golf-vehicle'];
            return {
              camera: camera.position.toArray(),
              housing: scene.getObjectByName('golf-transmission-housing')?.visible,
              objects: names.map(name => {
                const object = scene.getObjectByName(name);
                const projected: number[][] = [];
                if (object) {
                  const bounds = new THREE.Box3().setFromObject(object);
                  for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
                }
                return { name, exists: Boolean(object), projected, matrix: object?.matrixWorld.toArray(), status: object?.userData.dimensionalStatus };
              }),
            };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectDimensions: () => {
            scene.updateMatrixWorld(true);
            const overlay = scene.getObjectByName('golf-dimension-markers');
            const points: { wheel: string; kind: string; position: number[]; projected: number[] }[] = [];
            overlay?.traverse(object => {
              if (!object.userData.dimensionPoint) return;
              const position = object.getWorldPosition(new THREE.Vector3());
              points.push({ wheel: object.userData.wheel, kind: object.userData.kind, position: position.toArray(), projected: position.clone().project(camera).toArray() });
            });
            return { selected: overlay?.userData.selected ?? null, heightMm: overlay?.userData.heightMm ?? null, points };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectStructure: () => {
            scene.updateMatrixWorld(true);
            return ['golf-monocoque-front', 'golf-front-subframe', 'golf-monocoque-rear', 'golf-cabin-frame', 'golf-rear-subframe'].map(name => {
              const object = scene.getObjectByName(name);
              const mounts: { name: string; position: number[] }[] = [];
              object?.traverse(child => { if (child.name.startsWith('golf-body-mount-') || child.name.startsWith('golf-subframe-mount-')) mounts.push({ name: child.name, position: child.getWorldPosition(new THREE.Vector3()).toArray() }); });
              const projected: number[][] = [];
              if (object) {
                const bounds = new THREE.Box3().setFromObject(object);
                for (const axis of [bounds.min.x, bounds.max.x]) for (const height of [bounds.min.y, bounds.max.y]) for (const depth of [bounds.min.z, bounds.max.z]) projected.push(new THREE.Vector3(axis, height, depth).project(camera).toArray());
              }
              return { name, visible: Boolean(object?.visible), mounts, projected };
            });
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectPendulumBushes: () => {
            scene.updateMatrixWorld(true);
            return ['lower', 'upper'].map(id => {
              const object = scene.getObjectByName(`golf-pendulum-bush-${id}`);
              const bounds = object ? new THREE.Box3().setFromObject(object) : null;
              return { id, sourceItem: object?.userData.sourceItem, variant: object?.userData.variant, dimensionalStatus: object?.userData.dimensionalStatus, min: bounds?.min.toArray(), max: bounds?.max.toArray() };
            });
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectHarnessClearance: (margin = 3) => {
            scene.updateMatrixWorld(true);
            const solids: { name: string; box: THREE.Box3; parts: THREE.Box3[] }[] = [];
            const corner = new THREE.Vector3();
            for (const root of ['golf-engine-local', 'golf-transmission', 'golf-clutch-pack', 'golf-cooling-system', 'golf-exhaust-line']) {
              scene.getObjectByName(root)?.traverse(object => {
                const mesh = object as THREE.Mesh;
                if (!mesh.isMesh || !mesh.visible) return;
                const box = new THREE.Box3().setFromObject(mesh).expandByScalar(-margin);
                if (box.isEmpty()) return;
                let owner: THREE.Object3D | null = mesh;
                const chain: string[] = [];
                while (owner) { if (owner.name) chain.unshift(owner.name); owner = owner.parent; }
                // Tubos curvos tem caixa envolvente enorme e vazia, entao cada anel vira uma caixa propria.
                const attribute = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
                const ring = mesh.geometry.type === 'TubeGeometry' ? ((mesh.geometry as THREE.TubeGeometry).parameters.radialSegments + 1) * 2 : attribute.count;
                const parts: THREE.Box3[] = [];
                for (let start = 0; start + ring <= attribute.count; start += Math.max(1, ring / 2)) {
                  const slice = new THREE.Box3();
                  for (let index = start; index < start + ring; index += 1) slice.expandByPoint(corner.fromBufferAttribute(attribute, index).applyMatrix4(mesh.matrixWorld));
                  slice.expandByScalar(-margin);
                  if (!slice.isEmpty()) parts.push(slice);
                }
                if (parts.length) solids.push({ name: `${chain.join('/')}#${solids.length}:${mesh.geometry.type}`, box, parts });
              });
            }
            const hits = new Map<string, { route: string; part: string; at: number[]; count: number; box: number[][] }>();
            const vertex = new THREE.Vector3();
            for (const root of ['golf-sensor-harness', 'golf-egas-harness', 'golf-fuse-distribution']) {
              scene.getObjectByName(root)?.traverse(object => {
                const mesh = object as THREE.Mesh;
                if (!mesh.isMesh || !mesh.visible) return;
                const attribute = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
                let owner = mesh as THREE.Object3D;
                while (owner.parent && !owner.name.startsWith('golf-')) owner = owner.parent;
                for (let index = 0; index < attribute.count; index += 7) {
                  vertex.fromBufferAttribute(attribute, index).applyMatrix4(mesh.matrixWorld);
                  const solid = solids.find(candidate => candidate.box.containsPoint(vertex) && candidate.parts.some(part => part.containsPoint(vertex)));
                  if (!solid) continue;
                  const key = `${owner.name}|${solid.name}`;
                  const found = hits.get(key);
                  if (found) found.count += 1;
                  else hits.set(key, { route: owner.name, part: solid.name, at: vertex.toArray().map(value => Math.round(value)), count: 1, box: [solid.box.min.toArray().map(Math.round), solid.box.max.toArray().map(Math.round)] });
                }
              });
            }
            return { solids: solids.length, engine: (() => { const object = scene.getObjectByName('golf-engine-local'); const box = object ? new THREE.Box3().setFromObject(object) : null; return box ? [box.min.toArray().map(Math.round), box.max.toArray().map(Math.round)] : null; })(),
              free: (point: number[], radius = 10) => { const probe = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(...point), new THREE.Vector3(radius * 2, radius * 2, radius * 2)); return solids.filter(solid => solid.box.intersectsBox(probe) && solid.parts.some(part => part.intersectsBox(probe))).map(solid => solid.name); },
              hits: [...hits.values()].sort((a, b) => b.count - a.count) };
          } });
          if (import.meta.env.DEV) Object.assign(gl.domElement, { inspectGolf: (includePixels = true) => {
            scene.updateMatrixWorld(true);
            let contrastPixels = 0;
            let brightPixels = 0;
            if (includePixels) {
              gl.render(scene, camera);
              const context = gl.getContext();
              const pixels = new Uint8Array(gl.domElement.width * gl.domElement.height * 4);
              context.readPixels(0, 0, gl.domElement.width, gl.domElement.height, context.RGBA, context.UNSIGNED_BYTE, pixels);
              for (let offset = 0; offset < pixels.length; offset += 4 * 17) {
                if (pixels[offset] < 180 || pixels[offset + 1] < 180 || pixels[offset + 2] < 180) contrastPixels++;
                if (pixels[offset] > 180 && pixels[offset + 1] > 180 && pixels[offset + 2] > 180) brightPixels++;
              }
            }
            const parts = new Set<number>();
            const pistons: { name: string; localY: number }[] = [];
            const rods: { name: string; top: number[]; bottom: number[] }[] = [];
            scene.traverse(object => {
              if (object.userData.golfPart) parts.add(Number(object.userData.golfPart));
              if (object.name.startsWith('golf-piston-')) pistons.push({ name: object.name, localY: object.position.y });
              if (object.name.startsWith('golf-rod-')) rods.push({ name: object.name, top: object.localToWorld(new THREE.Vector3(0, 144, 0)).toArray(), bottom: object.localToWorld(new THREE.Vector3()).toArray() });
            });
            const fuseBoxes = ['golf-fusebox-engine', 'golf-fusebox-cabin'].map(name => {
              const object = scene.getObjectByName(name);
              return { name, position: object?.getWorldPosition(new THREE.Vector3()).toArray() };
            });
            const testPoints: { id: string; position: number[]; screen: number[] }[] = [];
            scene.traverse(object => {
              if (object.userData.testPoint) {
                const world = object.getWorldPosition(new THREE.Vector3());
                testPoints.push({ id: object.userData.testPoint, position: world.toArray(), screen: world.clone().project(camera).toArray() });
              }
            });
            const sparks: boolean[] = [];
            scene.traverse(object => { if (object.name.startsWith('golf-spark-')) sparks.push(object.visible); });
            const slave = scene.getObjectByName('golf-clutch-slave');
            const slaveBounds = slave ? new THREE.Box3().setFromObject(slave) : null;
            const clutchSlave = slave && slaveBounds ? {
              ...slave.userData,
              parent: slave.parent?.name,
              children: slave.children.map(child => child.name).filter(Boolean),
              matrix: slave.matrixWorld.toArray(),
              min: slaveBounds.min.toArray(),
              max: slaveBounds.max.toArray(),
              projected: slaveBounds.getCenter(new THREE.Vector3()).project(camera).toArray(),
            } : null;
            const release = scene.getObjectByName('golf-clutch-release');
            const releaseBounds = release ? new THREE.Box3().setFromObject(release) : null;
            const spring = scene.getObjectByName('golf-clutch-retaining-spring');
            const springBounds = spring ? new THREE.Box3().setFromObject(spring) : null;
            const retainingSpring = spring && springBounds ? {
              ...spring.userData,
              parent: spring.parent?.name,
              matrix: spring.matrixWorld.toArray(),
              position: spring.getWorldPosition(new THREE.Vector3()).toArray(),
              min: springBounds.min.toArray(), max: springBounds.max.toArray(),
              projected: springBounds.getCenter(new THREE.Vector3()).project(camera).toArray(),
            } : null;
            const bell = scene.getObjectByName('golf-bellhousing')?.children[0] as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> | undefined;
            const clutchRelease = release && releaseBounds ? {
              ...release.userData,
              retainingSpring,
              matrix: release.matrixWorld.toArray(),
              sourceItems: release.children.map(child => child.userData.sourceItem),
              min: releaseBounds.min.toArray(), max: releaseBounds.max.toArray(),
              projected: releaseBounds.getCenter(new THREE.Vector3()).project(camera).toArray(),
              bellOpacity: bell?.material.opacity,
              contacts: ['golf-clutch-plunger-tip', 'golf-clutch-plunger-seat', 'golf-clutch-pivot-center', 'golf-clutch-pivot-seat'].map(name => scene.getObjectByName(name)?.getWorldPosition(new THREE.Vector3()).toArray()),
            } : null;
            const bearingAssembly = scene.getObjectByName('golf-clutch-bearing-assembly');
            const guide = scene.getObjectByName('golf-clutch-guide');
            const bearing = scene.getObjectByName('golf-clutch-bearing');
            const crank = scene.getObjectByName('golf-crankshaft');
            const crankOrigin = crank?.getWorldPosition(new THREE.Vector3());
            const crankAxis = crank ? new THREE.Vector3(1, 0, 0).transformDirection(crank.matrixWorld) : null;
            const guideAxis = guide ? new THREE.Vector3(0, 1, 0).transformDirection(guide.matrixWorld) : null;
            const guideOffset = guide && crankOrigin ? guide.getWorldPosition(new THREE.Vector3()).sub(crankOrigin) : null;
            const bellAxis = bell ? new THREE.Vector3(0, 1, 0).transformDirection(bell.matrixWorld) : null;
            const clutchBearing = bearingAssembly && guide && bearing ? {
              ...bearingAssembly.userData,
              matrix: bearingAssembly.matrixWorld.toArray(),
              sourceItems: [guide.userData.sourceItem, bearing.userData.sourceItem],
              centers: [guide, bearing].map(object => object.getWorldPosition(new THREE.Vector3()).toArray()),
              guideAxis: new THREE.Vector3(0, 1, 0).transformDirection(guide.matrixWorld).toArray(),
              projected: bearingAssembly.getWorldPosition(new THREE.Vector3()).project(camera).toArray(),
              clipCount: bearing.children.filter(child => child.name.startsWith('golf-clutch-bearing-clip-')).length,
              fixings: guide.children.filter(child => child.name.startsWith('golf-clutch-guide-fixing-')).map(child => ({
                ...child.userData,
                matrix: child.matrixWorld.toArray(),
                position: child.getWorldPosition(new THREE.Vector3()).toArray(),
              })),
              axisOffset: clutchAxisOffset(),
              radialDistance: guideOffset && crankAxis ? guideOffset.clone().cross(crankAxis).length() : null,
              axisParallel: guideAxis && crankAxis ? Math.abs(guideAxis.dot(crankAxis)) : null,
              bellTowardsMotor: bellAxis && guideOffset ? bellAxis.dot(guideOffset.clone().negate().normalize()) : null,
            } : null;
            const shaft = scene.getObjectByName('golf-input-shaft');
            const shaftBounds = shaft ? new THREE.Box3().setFromObject(shaft) : null;
            const inputShaft = shaft && shaftBounds && guide && guideAxis ? {
              ...shaft.userData,
              matrix: shaft.matrixWorld.toArray(),
              parent: shaft.parent?.name,
              axisParallel: new THREE.Vector3(0, 1, 0).transformDirection(shaft.matrixWorld).dot(guideAxis),
              radialDistance: shaft.getWorldPosition(new THREE.Vector3()).sub(guide.getWorldPosition(new THREE.Vector3())).cross(guideAxis).length(),
              ends: ['golf-input-shaft-start', 'golf-input-shaft-tip'].map(name => scene.getObjectByName(name)?.getWorldPosition(new THREE.Vector3()).toArray()),
              min: shaftBounds.min.toArray(), max: shaftBounds.max.toArray(),
              projected: shaftBounds.getCenter(new THREE.Vector3()).project(camera).toArray(),
            } : null;
            return { contrastPixels, brightPixels, parts: [...parts].sort((first, second) => first - second), pistons, rods, fuseBoxes, testPoints, sparks, clutchSlave, clutchRelease, clutchBearing, inputShaft, electrical: sampleGolf(lessonClock.current).electrical, rpm: sampleGolf(lessonClock.current).rpm, openFuse: lessonClock.current.openFuse, calls: gl.info.render.calls, triangles: gl.info.render.triangles, geometries: gl.info.memory.geometries, angle: lessonClock.current.angle, elapsed: lessonClock.current.elapsed, operation: lessonClock.current.operation, pumpLow: sampleGolf(lessonClock.current).pumpLow, fuelLength: FUEL_LENGTH_MM, width: gl.domElement.width, height: gl.domElement.height };
          } });
        }}>
          <color attach="background" args={[night ? '#11171b' : '#eef2f1']} />
          <GolfStudioLighting night={night} />
          <ambientLight intensity={night ? 0.15 : 0.65} />
          <hemisphereLight args={['#ffffff', '#7e8f8c', night ? 0.18 : 0.85]} />
          <directionalLight position={[2000, 3500, -2000]} intensity={night ? 0.25 : 2.5} />
          <directionalLight position={[-2000, 2000, 2500]} intensity={night ? 0.12 : 1.2} />
          {night && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 1000]}><planeGeometry args={[16000, 16000]} /><meshStandardMaterial color="#737a7d" roughness={0.92} /></mesh>}
          <Driver clock={lessonClock} playback={playback} report={setSnapshot} brakes={brakes} reportBrakes={setBrakeSnapshot} bodyControl={bodyControl} />
          {!fuelFocus && !wiperFocus && !coolingFocus && !egasFocus && <Camera view={view} selected={selected} reset={reset} fuseLocation={fuseLocation} structure={structure} structureView={structureView} focusWheel={dimensionFocus && dimensionMarkers ? dimensionWheel : null} clutchFocus={clutchFocus} brakeFocus={brakeFocus} bodyView={bodyView} night={night} deviceView={deviceView} />}
          {deviceFocus ? <GolfDeviceMap filter={deviceFilter} byRole={deviceRole} labels={deviceLabels} selected={deviceId} select={setDeviceId} /> : fuelFocus ? <GolfFuelInspection clock={lessonClock} focus={fuelFocus} reset={reset} /> : wiperFocus ? <GolfWiperInspection clock={lessonClock} focus={wiperFocus} reset={reset} /> : coolingFocus ? <GolfCoolingInspection clock={lessonClock} reset={reset} focus={coolingPart} /> : egasFocus ? <GolfEgasInspection clock={lessonClock} focus={egasFocus} reset={reset} /> : brakeFocus ? <group name="golf-brake-inspection" userData={{ focus: brakeFocus }}><GolfBrakeControls brakes={brakes} /><GolfBrakeFluidReservoir />{VEHICLE_WHEELS.map(wheel => <GolfWheel key={wheel.id} location={wheel} clock={lessonClock} brakes={brakes} mounted={false} />)}</group> : clutchFocus ? <GolfTransmission cutaway housing={clutchHousing && clutchFocus !== 'exploded'} hydraulics={clutchFocus === 'hydraulics'} pack={clutchFocus === 'pack' || clutchFocus === 'exploded'} exploded={clutchFocus === 'exploded'} internals={clutchFocus === 'gearbox'} selectedGear={selectedGear} /> : structure ? <GolfStructure {...structureLayers} /> : <Assembly view={view} body={body} clock={lessonClock} scanner={scanner} fault={fault} selected={selected} select={setSelected} fuseLocation={fuseLocation} inspection={inspection} wheelsMounted={wheelsMounted} brakes={brakes} bodyControl={bodyControl} show={systemShow} />}
          {structure && dimensionMarkers && <GolfDimensionMarkers selected={dimensionWheel} select={setDimensionWheel} />}
          {inspection && (selected === 28 || selected === 27) && <GolfTestPoints area={selected === 27 ? 'battery' : fuseLocation} red={redPoint} black={blackPoint} select={activeProbe === 'red' ? setRedPoint : setBlackPoint} />}
          {!night && !clutchFocus && view !== 'compare' && !(structure && structureView === 'bottom') && <gridHelper args={[6000, 30, '#c6d3cf', '#dce5e1']} position={[0, -8, 1000]} />}
        </Canvas>
        <div className="golf-canvas-caption"><span>{deviceFocus ? 'Sensores e atuadores / circuito didatico por borne' : fuelFocus ? 'Combustivel / nivel e circuito didaticos estimados' : wiperFocus ? 'Limpadores / mecanismo e circuito estimados' : coolingFocus ? 'Arrefecimento / circuito didatico estimado' : egasFocus ? 'EGAS / circuito didatico estimado' : brakeFocus ? 'Freios / circuito didatico estimado' : clutchFocus ? 'Embreagem 02S / geometria estimada' : structure ? 'Estrutura do veiculo / cotas estimadas' : view === 'compare' ? 'Mesmo angulo / cilindro 1' : body === 'cutaway' ? 'Powertrain em corte' : body === 'ghost' ? 'Carroceria transparente' : 'Conjunto externo'}</span><span>mm</span></div>
      </div>
      <aside className="golf-inspector" aria-label="Leituras do motor">
        {deviceFocus && <GolfDevicePanel filter={deviceFilter} setFilter={setDeviceFilter} byRole={deviceRole} setByRole={setDeviceRole} labels={deviceLabels} setLabels={setDeviceLabels} selected={deviceId} select={setDeviceId} />}
        {systemsPanel && <GolfSystemsPanel power={systemPower} visible={systemShow} onPower={(id, value) => applySystemPower({ ...systemPower, [id]: value }, [id])} onVisible={(id, value) => applySystemShow({ ...systemShow, [id]: value }, [id])} onAllPower={value => applySystemPower(allSystems(value), ['engine', 'egas', 'wipers', 'brakes'])} onAllVisible={value => applySystemShow(allSystems(value), ['bodyLoom'])} />}
        {bodyPanel && !fuelFocus && !wiperFocus && !coolingFocus && !egasFocus && !brakeFocus && !clutchFocus && !structure && !inspection && <GolfBodyPanel state={bodyControl.current} power={bodyPower(snapshot, brakeSnapshot)} change={update => { bodyControl.current = update(bodyControl.current); setSnapshot({ ...lessonClock.current }); }} night={night} setNight={setNight} braking={brakeSnapshot.pedal > 0.01} setBraking={active => { brakes.current = { ...brakes.current, pedal: active ? 0.7 : 0 }; setBrakeSnapshot({ ...brakes.current }); }} />}
        {fuelFocus ? <GolfFuelPanel clock={snapshot} focus={fuelFocus} setFocus={setFuelFocus} change={update => { lessonClock.current = update(lessonClock.current); setSnapshot({ ...lessonClock.current }); }} /> : wiperFocus ? <GolfWiperPanel clock={snapshot} focus={wiperFocus} setFocus={setWiperFocus} change={update => { lessonClock.current = update(lessonClock.current); setSnapshot({ ...lessonClock.current }); }} /> : coolingFocus ? <GolfCoolingPanel clock={snapshot} focus={coolingPart} setFocus={setCoolingPart} change={update => { lessonClock.current = update(lessonClock.current); setSnapshot({ ...lessonClock.current }); }} /> : egasFocus ? <GolfEgasPanel clock={snapshot} focus={egasFocus} setFocus={setEgasFocus} changeFuse={changeFuse} change={update => { lessonClock.current = { ...lessonClock.current, egas: update(lessonClock.current.egas) }; setSnapshot({ ...lessonClock.current }); }} /> : brakeFocus ? <GolfBrakePanel state={brakeSnapshot} change={(update, resume) => { brakes.current = update(brakes.current); setBrakeSnapshot({ ...brakes.current }); if (resume) { playback.current.playing = true; setPlaying(true); } }} focus={brakeFocus} setFocus={setBrakeFocus} /> : clutchFocus ? <div className="golf-structure-controls">
          <h3>{clutchFocus === 'gearbox' ? 'Cambio / esquema' : 'Embreagem / 02S'}</h3>
          <div className="golf-segments" role="group" aria-label="Vista da embreagem">
            <button type="button" aria-pressed={clutchFocus === 'mechanism'} onClick={() => { setFuelFocus(null); setClutchFocus('mechanism'); }}>Mecanismo</button>
            <button type="button" aria-pressed={clutchFocus === 'pack'} onClick={() => { setFuelFocus(null); setClutchFocus('pack'); }}>Conjunto</button>
            <button type="button" aria-pressed={clutchFocus === 'exploded'} onClick={() => { setFuelFocus(null); setClutchFocus('exploded'); }}>Explodida</button>
            <button type="button" aria-pressed={clutchFocus === 'hydraulics'} onClick={() => { setFuelFocus(null); setClutchFocus('hydraulics'); }}>Circuito</button>
            <button type="button" aria-pressed={clutchFocus === 'gearbox'} onClick={() => { setFuelFocus(null); setClutchFocus('gearbox'); }}>Cambio</button>
          </div>
          {clutchFocus === 'gearbox' && <label className="golf-select"><span>Componente</span><select aria-label="Componente do cambio" value={selectedGear} onChange={event => setSelectedGear(Number(event.target.value))}><option value={0}>Todos</option>{Array.from({ length: 6 }, (_, index) => <option key={index} value={index + 1}>Par {index + 1}</option>)}<option value={7}>Diferencial</option></select></label>}
          {clutchFocus === 'gearbox' && <dl className="golf-values"><div><dt>Engrenamento</dt><dd>Esquematico</dd></div><div><dt>Relacoes / dentes OE</dt><dd>Nao definidos</dd></div><div><dt>Re / engate</dt><dd>Nao modelados</dd></div></dl>}
          <div className="golf-switches"><label><input type="checkbox" checked={clutchHousing && clutchFocus !== 'exploded'} disabled={clutchFocus === 'exploded'} onChange={event => setClutchHousing(event.target.checked)} />Campana e caixa</label></div>
          <dl className="golf-values"><div><dt>Acionamento</dt><dd>Estatico</dd></div><div><dt>Dimensoes / posicoes</dt><dd>Estimadas</dd></div><div><dt>Aplicacao exata</dt><dd>Pendente</dd></div><div><dt>Disco / plato / volante</dt><dd>Genericos</dd></div><div><dt>Torque / patinagem</dt><dd>Nao simulados</dd></div></dl>
          <a href={CLUTCH_RELEASE_REFERENCE.url} target="_blank" rel="noreferrer">Manual 02S / A30-0005</a>
        </div> : structure ? <div className="golf-structure-controls">
          <h3>Estrutura do veiculo</h3>
          <GolfDimensions markers={dimensionMarkers} setMarkers={visible => { setDimensionMarkers(visible); if (!visible) setDimensionFocus(false); }} selectedWheel={dimensionWheel} selectWheel={setDimensionWheel} focused={dimensionFocus} setFocused={focused => { setDimensionFocus(focused); if (focused) setDimensionMarkers(true); }} />
          <div className="golf-part-detail" aria-label="Auditoria da estrutura">
            <p>Dianteira incompleta: {FRONT_STRUCTURE.mounts.length} de {VERIFIED_RUNNING_GEAR.front.bodyMountCount} fixacoes representadas. Agregado dianteiro de tres partes; consoles e cotas ainda nao validados.</p>
            <p>Traseira representada: tracao dianteira, agregado de aco com fixacao direta. Nao corresponde ao conjunto 4Motion.</p>
            <a href={VERIFIED_RUNNING_GEAR.url} target="_blank" rel="noreferrer">Volkswagen SSP 321 / pp. 7 e 13</a>
            <details aria-label="Referencia do conjunto motriz">
              <summary>Motor e cambio / referencia</summary>
              <p>{GOLF_POWERTRAIN_REFERENCE.engine.code} / 2.0 FSI / {GOLF_POWERTRAIN_REFERENCE.engine.powerKw} kW. Manual {GOLF_POWERTRAIN_REFERENCE.manualGearbox.family}, {GOLF_POWERTRAIN_REFERENCE.manualGearbox.gears} marchas. Tracao dianteira.</p>
              <p>Referencia do SSP, nao confirmacao do BLX/02Q do briefing. Codigo especifico do cambio, relacoes e aplicacao por ano ainda pendentes. Rotacao das rodas permanece didatica.</p>
              <a href={GOLF_POWERTRAIN_REFERENCE.url} target="_blank" rel="noreferrer">{GOLF_POWERTRAIN_REFERENCE.source} / pp. 30, 31 e 37</a>
              <p>Embreagem 02S: cilindro escravo externo (10), alavanca (7) e rolamento separado (8). Cilindro, alavanca, pivo (2), rolamento e luva-guia (4) representados com dimensoes e posicao estimadas. Mola de retencao (5) representada como arame dobrado junto ao pivo; forma detalhada, espessura e encaixe estimados, sem elasticidade simulada. Dois olhais e fixadores da guia (6) representados; dimensoes e orientacao estimadas, rosca e torque nao especificados. Circuito hidraulico e pedal representados como geometria estatica estimada. Disco, plato e volante genericos representados; acionamento pelo pedal, patinagem e torque nao simulados.</p>
              <p>Eixo primario: volume externo estimado e estatico. Extensao interna, seis pares de engrenagens, mancais, sincronizadores, seletor e diferencial agora representados esquematicamente. Estriado, re, engate e transmissao de torque nao modelados; relacoes e dentes de fabrica nao definidos. O estriado acopla ao cubo do disco, nao a luva-guia; quantidade de estrias e cotas pendentes.</p>
              <a href={INPUT_SHAFT_REFERENCE.url} target="_blank" rel="noreferrer">Manual 02S / eixo e cubo do disco</a>
              <p>Disco candidato {CLUTCH_DISC_CANDIDATE.manufacturer} {CLUTCH_DISC_CANDIDATE.discPartNumber}, integrante do kit {CLUTCH_DISC_CANDIDATE.kitPartNumber}: {CLUTCH_DISC_CANDIDATE.diameterMm} mm, {CLUTCH_DISC_CANDIDATE.toothCount} dentes, perfil do cubo {CLUTCH_DISC_CANDIDATE.hubProfile}. Dados da peca confirmados no catalogo ZF; aplicacao no AXW/02S e volante correspondente ainda pendentes. Nao adotado na cena. O perfil do cubo nao substitui o desenho cotado do eixo.</p>
              <a href={CLUTCH_DISC_CANDIDATE.discUrl} target="_blank" rel="noreferrer">ZF Aftermarket / disco {CLUTCH_DISC_CANDIDATE.discPartNumber}</a>{' / '}<a href={CLUTCH_DISC_CANDIDATE.kitUrl} target="_blank" rel="noreferrer">ZF Aftermarket / kit {CLUTCH_DISC_CANDIDATE.kitPartNumber}</a>
              <p>Eixo da guia em relacao ao virabrequim: altura {clutchAxisOffset().height} mm, profundidade {clutchAxisOffset().depth} mm. Alinhamento radial corrigido no modelo; boca da campana voltada ao motor. Distancia axial, perfil da campana e fixacoes ainda estimados; nao representa transmissao funcional.</p>
              <a href={CLUTCH_RELEASE_REFERENCE.url} target="_blank" rel="noreferrer">Embreagem 02S / {CLUTCH_RELEASE_REFERENCE.figure} (arquivo independente)</a>
              <a href={CLUTCH_RELEASE_REFERENCE.repairUrl} target="_blank" rel="noreferrer">Alavanca / {CLUTCH_RELEASE_REFERENCE.mountedFigure} e {CLUTCH_RELEASE_REFERENCE.leverFigure}</a>
            </details>
            <details aria-label="Montagem dianteira documentada">
              <summary>Montagem dianteira / manual</summary>
              <dl className="golf-dimension-coordinates">
                <div><dt>Fixacoes na carroceria / {FRONT_LOCATION_REFERENCE.figure}</dt><dd>Consoles: 1 e 8. Agregado: 4 e 5. Suportes das buchas das bandejas: 9 e 18. Seis pontos identificados no manual; correspondencia com o 3D e cotas XYZ pendentes.</dd></div>
                <div><dt>Localizacao / {FRONT_LOCATION_REFERENCE.locatingTool}</dt><dd>Quatro pinos nas posicoes {FRONT_LOCATION_REFERENCE.locatingPositions.join(', ')}; nao sao a lista completa de fixacoes.</dd></div>
                <div><dt>Console / item {FRONT_ASSEMBLY_REFERENCE.console.item}</dt><dd>Ligacao a carroceria: figura {FRONT_LOCATION_REFERENCE.consoleFigure}. Geometria e aplicacao pendentes.</dd></div>
                <div><dt>Suporte da bandeja / item {FRONT_ASSEMBLY_REFERENCE.rearLinkBracket.item}</dt><dd>Com bucha; figura {FRONT_LOCATION_REFERENCE.mountingBracketFigure}. Aplicacao e cotas pendentes.</dd></div>
                <div><dt>Bieleta / item {FRONT_ASSEMBLY_REFERENCE.antiRollLink.item}</dt><dd>Barra estabilizadora a coluna do amortecedor</dd></div>
                <div><dt>Buchas pendulares / itens 25 e 29</dt><dd>Inferior e superior separadas no modelo. Envelope anterior preservado; divisao provisoria, perfil T/V nao confirmado.</dd></div>
                <div><dt>Apoio pendular / item 24</dt><dd>Montagem: primeiro cambio, depois agregado. Ligacao completa ainda nao representada.</dd></div>
                <div><dt>Bandejas / itens 10 e 11</dt><dd>Alternativas de construcao; nao combinar tipos ou materiais diferentes. Aplicacao ETKA pendente.</dd></div>
              </dl>
              <a href={FRONT_ASSEMBLY_REFERENCE.url} target="_blank" rel="noreferrer">Manual / figura {FRONT_ASSEMBLY_REFERENCE.figure} (arquivo independente)</a>
              <p><a href={FRONT_LOCATION_REFERENCE.url} target="_blank" rel="noreferrer">Posicionamento / {FRONT_LOCATION_REFERENCE.figure}</a>{' / '}<a href={FRONT_LOCATION_REFERENCE.removalUrl} target="_blank" rel="noreferrer">Remocao / parafusos 4 e 5</a></p>
            </details>
            <details aria-label="Cotas de reparacao dianteira">
              <summary>Assoalho dianteiro / cotas de conferencia</summary>
              <dl className="golf-dimension-coordinates">
                {FRONT_BODY_DIMENSIONS.measurements.map(measurement => <div key={measurement.figure}><dt>{measurement.label}</dt><dd>{measurement.distanceMm} mm / {measurement.figure} / p. {measurement.printedPage}</dd></div>)}
              </dl>
              <p>Medidas apenas para conferencia. Referencia final: {FRONT_BODY_DIMENSIONS.authority}, com suplemento Golf {FRONT_BODY_DIMENSIONS.supplement}. Sem cotas XYZ relativas ao eixo dianteiro e ao chao; correspondencia com os pontos do modelo pendente.</p>
              <a href={FRONT_BODY_DIMENSIONS.url} target="_blank" rel="noreferrer">{FRONT_BODY_DIMENSIONS.title} / {FRONT_BODY_DIMENSIONS.edition} / pp. 14, 28, 29 e 32 (arquivo independente)</a>
            </details>
          </div>
          <label className="golf-select"><span>Vista</span><select aria-label="Vista da estrutura" value={structureView} onChange={event => { setStructureView(event.target.value); setDimensionFocus(false); }}><option value="perspective">Obliqua</option><option value="top">Superior</option><option value="bottom">Inferior</option></select></label>
          <div className="golf-switches">
            <label><input type="checkbox" checked={structureLayers.monocoque} onChange={event => setStructureLayers({ ...structureLayers, monocoque: event.target.checked })} />Monobloco dianteiro</label>
            <label><input type="checkbox" checked={structureLayers.subframe} onChange={event => setStructureLayers({ ...structureLayers, subframe: event.target.checked })} />Agregado dianteiro</label>
            <label><input type="checkbox" checked={structureLayers.rear} onChange={event => setStructureLayers({ ...structureLayers, rear: event.target.checked })} />Monobloco traseiro</label>
            <label><input type="checkbox" checked={structureLayers.cabin} onChange={event => setStructureLayers({ ...structureLayers, cabin: event.target.checked })} />Estrutura da cabine</label>
            <label><input type="checkbox" checked={structureLayers.rearSubframe} onChange={event => setStructureLayers({ ...structureLayers, rearSubframe: event.target.checked })} />Agregado traseiro</label>
          </div>
          <dl className="golf-values"><div><dt>Etapa</dt><dd>01 / Estrutura</dd></div><div><dt>Carroceria</dt><dd>Monobloco</dd></div><div><dt>Cotas de montagem</dt><dd>Estimadas</dd></div><div><dt>Aplicacao dos agregados</dt><dd>A confirmar</dd></div><div><dt>Fixacoes modeladas</dt><dd>4 dianteiras + 4 traseiras</dd></div><div><dt>Entre-eixos</dt><dd>2578 mm</dd></div></dl>
        </div> : <>
        {view !== 'compare' && <label className="golf-select golf-parts"><span>Componentes / {GOLF_PARTS.length} grupos</span><select aria-label="Componente do motor" value={selected} onChange={event => setSelected(Number(event.target.value))}><option value={0}>Visao do conjunto</option>{GOLF_PARTS.map(item => <option key={item.id} value={item.id}>{String(item.id).padStart(2, '0')} / {item.name}</option>)}</select></label>}
        {selected === 28 && <div className="golf-fuse-controls">
          <div className="golf-segments" role="group" aria-label="Caixa de fusiveis">
            {([['engine', 'Cofre'], ['cabin', 'Habitaculo']] as const).map(([location, label]) => <button key={location} type="button" aria-pressed={fuseLocation === location} onClick={() => { setFuelFocus(null); setFuseLocation(location); }}>{label}</button>)}
          </div>
          {!inspection && <button className="golf-service" type="button" onClick={() => { setFuelFocus(null); setInspection(true); setBody('cutaway'); }}><Wrench size={17} />Abrir inspecao</button>}
          <label className="golf-select"><span>Fusivel aberto</span><select aria-label="Fusivel aberto" value={snapshot.openFuse ?? ''} onChange={event => changeFuse((event.target.value || null) as FuseCircuit | null)}><option value="">Nenhum / circuitos integros</option>{FUSE_CIRCUITS.map(circuit => <option key={circuit.id} value={circuit.id}>{circuit.label}</option>)}</select></label>
          <dl className="golf-values" aria-label="Alimentacao dos circuitos">
            <div><dt>Rele principal</dt><dd>{frame.electrical.mainRelay ? 'Fechado' : 'Aberto'}</dd></div>
            <div><dt>ECU</dt><dd>{frame.electrical.ecu ? `${frame.volts.toFixed(1)} V` : '0 V'}</dd></div>
            <div><dt>Bomba</dt><dd>{frame.electrical.pump ? 'Alimentada' : 'Desligada'}</dd></div>
            <div><dt>Bobinas</dt><dd>{frame.electrical.ignition ? 'Alimentadas' : 'Desligadas'}</dd></div>
            <div><dt>OBD2 / B+</dt><dd>{frame.electrical.diagnostics ? `${frame.volts.toFixed(1)} V` : '0 V'}</dd></div>
            <div><dt>Referencia ECU</dt><dd>{frame.electrical.sensor5V} V</dd></div>
          </dl>
        </div>}
        {inspection && (selected === 28 || selected === 27) && <div className="golf-meter" aria-label="Multimetro do cofre">
          <div className="golf-meter-display"><span>V DC</span><output aria-label="Tensao medida">{voltage === null ? '---' : voltage.toFixed(2)}</output><span>V</span></div>
          <div className="golf-segments" role="group" aria-label="Ponta ativa">
            <button type="button" aria-pressed={activeProbe === 'red'} onClick={() => setActiveProbe('red')}>Vermelha</button>
            <button type="button" aria-pressed={activeProbe === 'black'} onClick={() => setActiveProbe('black')}>Preta</button>
          </div>
          {([{ label: 'Ponta vermelha', value: redPoint, change: setRedPoint }, { label: 'Ponta preta', value: blackPoint, change: setBlackPoint }]).map(probe => <label className="golf-select" key={probe.label}><span>{probe.label}</span><select aria-label={probe.label} value={probe.value} onChange={event => probe.change(event.target.value)}>{TEST_POINTS.map(point => <option key={point.id} value={point.id}>{point.label}</option>)}</select></label>)}
          {voltage === null && <output role="status">Ponto sem referencia eletrica definida</output>}
        </div>}
        {part && view !== 'compare' ? <div className="golf-part-detail"><span className="golf-part-number">{String(part.id).padStart(2, '0')}</span><h3>{part.name}</h3><small>{part.code}</small><output aria-live="off">{partReading(part.id, frame, snapshot, scanner, fault)}</output><p>{part.description}</p></div> : <>
          <div className="golf-readings"><div><small>Rotacao</small><strong>{frame.rpm.toFixed(0)} <em>rpm</em></strong></div><div><small>Angulo</small><strong>{frame.theta.toFixed(0)}<em> graus</em></strong></div></div>
          <dl className="golf-values"><div><dt>Baixa pressao</dt><dd>{frame.lowPressure.toFixed(1)} bar</dd></div><div><dt>Galeria</dt><dd>{frame.railPressure.toFixed(1)} bar</dd></div><div><dt>Lambda</dt><dd>{frame.rpm ? frame.lambda.toFixed(2) : '--'}</dd></div><div><dt>Rede eletrica</dt><dd>{frame.volts.toFixed(1)} V</dd></div><div><dt>Massa de ar</dt><dd>{frame.consumption.airFlowGs.toFixed(2)} g/s</dd></div><div><dt>Consumo</dt><dd>{frame.consumption.litresPerHour.toFixed(2)} L/h</dd></div><div><dt>Tanque</dt><dd>{frame.dryTank ? 'Vazio / motor parado' : `${tankLitres(snapshot.fuel).toFixed(1)} L`}</dd></div></dl>
          {view === 'fuel' && <div className="golf-distances"><strong>{(FUEL_LENGTH_MM / 1000).toFixed(2)} m</strong><span>Trajeto modelado / baixa</span><strong>0,31 m</strong><span>Galeria junto aos injetores</span></div>}
        </>}
        {selected !== 28 && <><div className="golf-states" aria-label="Estados dos quatro cilindros">{frame.cylinders.map((cylinder, index) => <div key={index} data-cylinder={index + 1} data-state={cylinder.state}><span>{index + 1}</span><strong>{cylinder.state}</strong><i data-on={cylinder.injecting} title="Injecao" /><i data-on={cylinder.spark || cylinder.dwell} title="Ignicao" /></div>)}</div>
        {view !== 'fuel' && <div className="golf-scope"><small>CKP / CMP · 720 graus</small><SignalTrace angle={frame.theta} camAdvance={frame.camAdvance} /></div>}
        <label className="golf-nox">NOx acumulado <output>{Math.round(snapshot.nox * 100)}%</output><progress max={1} value={snapshot.nox} /></label></>}
        {view === 'systems' && <div className="golf-switches"><label><input type="checkbox" checked={scanner} onChange={event => setScanner(event.target.checked)} />Scanner</label><label><input type="checkbox" checked={fault} onChange={event => setFault(event.target.checked)} />Cenario de falha</label></div>}
        </>}
      </aside>
    </div>
    <div className="golf-transport">
      <button type="button" className="golf-icon" title={playing ? 'Pausar' : 'Rodar'} aria-label={playing ? 'Pausar motor' : 'Rodar motor'} onClick={() => { playback.current.playing = !playback.current.playing; setPlaying(playback.current.playing); }}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
      <button type="button" className="golf-icon" title="Voltar a zero graus" aria-label="Voltar a zero graus" onClick={() => seek(0)}><RotateCcw size={17} /></button>
      <button type="button" className="golf-icon" title="Proximo tempo" aria-label="Proximo tempo do motor" onClick={() => seek(Math.floor(frame.theta / 180 + 1) * 180)}><SkipForward size={17} /></button>
      <label className="golf-angle"><span>{frame.theta.toFixed(0)} / 720 graus</span><input type="range" aria-label="Angulo do virabrequim" min={0} max={719} step={1} value={frame.theta} onChange={event => seek(Number(event.target.value))} /></label>
    </div>
    <GolfTimePanel />
    {message && <div role="status" className="golf-message">{message}</div>}
  </section>;
}

export function GolfVehicleScene() { return <GolfLessonScene view="vehicle" />; }
export function GolfEngineScene() { return <GolfLessonScene view="engine" />; }
export function GolfFuelScene() { return <GolfLessonScene view="fuel" />; }
export function GolfCompareScene() { return <GolfLessonScene view="compare" />; }
export function GolfSystemsScene() { return <GolfLessonScene view="systems" />; }