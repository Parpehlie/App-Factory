import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from './types';

const KEY = '@ironhale/state/v1';
export const initialState = (): AppState => ({ schemaVersion:1, profile:null, plan:[], history:[], progress:{}, onboardingDraft:{}, createdAt:Date.now() });

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as AppState;
    return parsed.schemaVersion === 1 ? parsed : initialState();
  } catch { return initialState(); }
}
export async function saveState(state:AppState): Promise<void> { await AsyncStorage.setItem(KEY,JSON.stringify(state)); }
export async function clearState(): Promise<void> { await AsyncStorage.removeItem(KEY); }
