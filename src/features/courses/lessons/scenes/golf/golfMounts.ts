import { Quaternion, Vector3 } from 'three';

type Point = [number, number, number];
export const INJECTOR_ORIGIN: Point = [0, 240, 38];
export const INJECTOR_AXIS = new Vector3(0, 0.42, 0.9075).normalize();
export const INJECTOR_ROTATION = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), INJECTOR_AXIS);
export const INJECTOR_FUEL_PORT = new Vector3(...INJECTOR_ORIGIN).addScaledVector(INJECTOR_AXIS, 88).toArray() as Point;
export const INJECTOR_PLUG = new Vector3(0, 62, 26).applyQuaternion(INJECTOR_ROTATION).add(new Vector3(...INJECTOR_ORIGIN)).toArray() as Point;
export const RAIL_SENSOR_MOUNT: Point = [-23, 280, 128];
export const RAIL_SENSOR_PLUG: Point = [-70, 280, 141];
export const THROTTLE_INLET: Point = [316, 215, 199];
export const HIGH_PUMP_INLET: Point = [342, 400, 13];
export const ENGINE_CONNECTORS: { name: string; part: number; point: Point }[] = [
  { name: 'map', part: 11, point: [132, 229, 211] },
  { name: 'rail-pressure', part: 13, point: RAIL_SENSOR_PLUG },
  { name: 'cmp', part: 20, point: [-45, 335, 63] },
  { name: 'ckp', part: 17, point: [310, -57, 76] },
  { name: 'ect', part: 21, point: [330, 242, -54] },
  { name: 'knock-1', part: 16, point: [44, 57, 58] },
  { name: 'knock-2', part: 16, point: [220, 57, 58] },
];