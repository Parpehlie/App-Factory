import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXERCISE_BY_ID } from '../exercises';
import { en } from './strings/en';
import { fr } from './strings/fr';
import { de } from './strings/de';
import { es } from './strings/es';
import { fr as frExercises } from './exercises/fr';
import { de as deExercises } from './exercises/de';
import { es as esExercises } from './exercises/es';
import { LOCALES, LOCALE_TAG, type ExerciseDict, type ExerciseText, type Locale, type Strings } from './types';

const DICTS: Record<Locale, Strings> = { en, fr, de, es };
// English lives in exercises.ts (the canonical library), so only non-EN dicts exist here.
const EXERCISE_DICTS: Partial<Record<Locale, ExerciseDict>> = { fr: frExercises, de: deExercises, es: esExercises };
const STORAGE_KEY = '@ironhale/locale';

const isSupported = (code: string | null | undefined): code is Locale =>
  !!code && (LOCALES as string[]).includes(code);

/** First device language IronHale supports, else English. Runs synchronously so there's no flash. */
function detectLocale(): Locale {
  try {
    for (const entry of Localization.getLocales()) {
      const code = entry.languageCode?.toLowerCase();
      if (isSupported(code)) return code;
    }
  } catch {
    // getLocales can throw on some hosts; English is a safe default.
  }
  return 'en';
}

interface I18nValue {
  locale: Locale;
  t: Strings;
  setLocale: (locale: Locale) => void;
  /** Localized name + cues for an exercise id, falling back to the English library. */
  exerciseText: (id: string) => ExerciseText;
  /** Locale-aware date formatter (weekday/month names follow the active language). */
  formatDate: (timestamp: number, options: Intl.DateTimeFormatOptions) => string;
}

const Context = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  // A persisted manual choice overrides device detection once storage resolves.
  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (isSupported(saved)) setLocaleState(saved);
    });
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const exerciseText = useCallback((id: string): ExerciseText => {
    const hit = EXERCISE_DICTS[locale]?.[id];
    if (hit) return hit;
    const fallback = EXERCISE_BY_ID[id];
    return fallback ? { name: fallback.name, cues: fallback.cues } : { name: id, cues: ['', '', ''] };
  }, [locale]);

  const formatDate = useCallback(
    (timestamp: number, options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(LOCALE_TAG[locale], options).format(new Date(timestamp)),
    [locale],
  );

  const value = useMemo<I18nValue>(
    () => ({ locale, t: DICTS[locale], setLocale, exerciseText, formatDate }),
    [locale, setLocale, exerciseText, formatDate],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function useI18n(): I18nValue {
  const value = useContext(Context);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}

/** The active translation dictionary. */
export const useT = (): Strings => useI18n().t;
/** The active locale plus its setter — for the Settings language switcher. */
export const useLocale = (): [Locale, (locale: Locale) => void] => {
  const { locale, setLocale } = useI18n();
  return [locale, setLocale];
};
/** Resolver for localized exercise name + cues. */
export const useExerciseText = (): ((id: string) => ExerciseText) => useI18n().exerciseText;
/** Locale-aware date formatter. */
export const useFormatDate = (): ((timestamp: number, options: Intl.DateTimeFormatOptions) => string) =>
  useI18n().formatDate;
