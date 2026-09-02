import Dexie, { type Table } from 'dexie';
import type { SimulationPreset } from '@/simulation/types';

export interface KeyValueRecord {
  key: string;
  value: unknown;
}

export interface SavedPresetRecord {
  id: string;
  preset: SimulationPreset;
  savedAt: number;
}

/** Local IndexedDB database for progress, settings and saved presets. */
class EngineDataFlowDB extends Dexie {
  settings!: Table<KeyValueRecord, string>;
  presets!: Table<SavedPresetRecord, string>;

  constructor() {
    super('enginedataflow');
    this.version(1).stores({
      settings: 'key',
      presets: 'id',
    });
  }
}

export const db = new EngineDataFlowDB();

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const record = await db.settings.get(key);
    return (record?.value as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  try {
    await db.settings.put({ key, value });
  } catch {
    // IndexedDB may be unavailable (private mode); persistence is best-effort.
  }
}

export async function saveUserPreset(preset: SimulationPreset): Promise<void> {
  await db.presets.put({ id: preset.id, preset, savedAt: Date.now() });
}

export async function listUserPresets(): Promise<SavedPresetRecord[]> {
  try {
    return await db.presets.orderBy('savedAt').reverse().toArray();
  } catch {
    return [];
  }
}

export async function deleteUserPreset(id: string): Promise<void> {
  await db.presets.delete(id);
}
