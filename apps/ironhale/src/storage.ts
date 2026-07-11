import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from './types';

const KEY = '@ironhale/state/v1';
const SCHEMA_VERSION = 3;
export const initialState = (): AppState => ({ schemaVersion:SCHEMA_VERSION, profile:null, plan:[], history:[], progress:{}, onboardingDraft:{}, activeWorkout:null, unitSystem:'kg', restSeconds:90, createdAt:Date.now() });

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as AppState | (Omit<AppState,'schemaVersion'|'activeWorkout'|'unitSystem'> & {schemaVersion:2});
    if(parsed.schemaVersion===SCHEMA_VERSION)return {...parsed,restSeconds:(parsed as AppState).restSeconds??90} as AppState;
    if(parsed.schemaVersion===2)return {...parsed,schemaVersion:SCHEMA_VERSION,activeWorkout:null,unitSystem:'kg',restSeconds:90};
    return initialState();
  } catch { return initialState(); }
}
export async function saveState(state:AppState): Promise<void> { await AsyncStorage.setItem(KEY,JSON.stringify(state)); }
export async function clearState(): Promise<void> { await AsyncStorage.removeItem(KEY); }
