import type { Joint, Pattern, WorkoutTitleKey } from '../types';

export type Locale = 'en' | 'fr' | 'de' | 'es';

/** BCP-47 tags used for Intl date/number formatting per locale. */
export const LOCALE_TAG: Record<Locale, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
};

/** Native language names for the Settings switcher (each shown in its own language). */
export const LOCALE_NAME: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
};

export const LOCALES: Locale[] = ['en', 'fr', 'de', 'es'];

/**
 * The full translation contract. Every locale file implements this interface, so a
 * missing or mistyped key is a compile error — the type is the single source of truth
 * for what text the app renders. Parameterized strings are functions (interpolation +
 * plural rules live in each locale, where German word order and French elision differ).
 */
export interface Strings {
  common: {
    continue: string;
    cancel: string;
    goBack: string;
    yes: string;
  };
  tabs: { today: string; progress: string; settings: string };
  joints: Record<Joint, string>;
  patterns: Record<Pattern, string>;
  workoutTitles: Record<WorkoutTitleKey, string>;
  onboarding: {
    disclaimer: string;
    buildingBusy: string;
    goal: { title: string; description: string; strong: string; independent: string; muscle: string };
    age: { title: string; description: string };
    joints: { title: string; description: string; none: string };
    equipment: {
      title: string; description: string;
      gym: string; gymDetail: string;
      home: string; homeDetail: string;
      bodyweight: string; bodyweightDetail: string;
    };
    experience: { title: string; description: string; never: string; yearsAgo: string; current: string };
    days: { title: string; description: string; perWeek: (n: number) => string; detail72: string; detail48: string; cta: string };
    building: { title: string; description: string; cta: string; steps: [string, string, string, string] };
    reveal: {
      title: string;
      description: string;
      weekOne: string;
      sessionSummary: (sessions: number) => string;
      cta: string;
      eyebrow: string;
      addLoad: string;
      rirNote: string;
      adaptKnee: string;
      adaptShoulder: string;
      adaptLumbar: string;
      adaptDefault: string;
    };
  };
  today: {
    blockCompleteTitle: string;
    blockCompleteBody: string;
    eyebrow: string;
    ready: string;
    done: string;
    freeSession: (current: number) => string;
    freeRemaining: (n: number) => string;
    freeReady: string;
    primeMember: string;
    week: (n: number) => string;
    recoveryWeek: string;
    meta: (movements: number) => string;
    adaptedFor: (joint: Joint) => string;
    startWorkout: string;
    unlockSession7: string;
    reschedule: string;
    recoveryTitle: string;
    recoveryBody: string;
    history: string;
    sessionN: (index: number) => string;
    minutes: (n: number) => string;
    rescheduleAlertTitle: string;
    rescheduleAlertBody: string;
    keepSchedule: string;
    moveTomorrow: string;
    goalHeadline: Record<'strong' | 'independent' | 'muscle', string>;
    nextUp: string;
    sessionNumber: (index: number) => string;
    cadence: (days: number) => string;
    protectedAreas: (count: number) => string;
    noProtectedAreas: string;
    adaptationsReady: (count: number) => string;
    moreMovements: (count: number) => string;
    recentTraining: string;
    todayDate: string;
    tomorrowDate: string;
    overdueDate: string;
  };
  progress: {
    eyebrow: string;
    tiersTitle: string;
    tiersBody: string;
    tierOf: (current: number, total: number) => string;
    curveEyebrow: string;
    curveTitle: string;
    curveBody: string;
    firstPointTitle: string;
    firstPointBody: string;
    sessionPoints: (n: number) => string;
    kg: string;
  };
  settings: {
    title: string;
    yourPlan: string;
    premiumPlan: string;
    freePlan: string;
    goPremium: string;
    sensitiveJoints: string;
    sensitiveJointsBody: string;
    checkin: (joint: Joint) => string;
    protectedUntil: (date: string) => string;
    makePermanent: string;
    feelingBetter: (joint: Joint) => string;
    yes: string;
    stillABit: string;
    permanent: string;
    restore: string;
    manageSub: string;
    privacy: string;
    terms: string;
    language: string;
    units: string;
    restDuration: string;
    disclaimer: string;
    reset: string;
    version: (v: string) => string;
    restoreOk: string;
    restoreNothing: string;
    restoreFailedTitle: string;
    restoreFailedBody: string;
    resetTitle: string;
    resetBody: string;
    cancel: string;
    deleteEverything: string;
  };
  workout: {
    unavailableTitle: string;
    goBack: string;
    reducedIntensity: string;
    adaptedForPill: (joint: Joint) => string;
    bother: string;
    setHeader: string;
    kgHeader: string;
    repsHeader: string;
    doneHeader: string;
    targetRir: (rir: number) => string;
    complete: string;
    next: string;
    restTimer: string;
    skip: string;
    finish: string;
    ofCount: (current: number, total: number) => string;
    formLoop: string;
    leaveTitle: string;
    leaveBody: string;
    stay: string;
    leave: string;
    finishTitle: string;
    finishBody: string;
    keepTraining: string;
    chooseTitle: string;
    whatTitle: string;
    chooseBody: (joint: Joint) => string;
    whatBody: string;
    altMeta: (load: number) => string;
    noAlternative: string;
    removeMovement: string;
    cancel: string;
    previous: string;
    sessionTime: string;
    volume: string;
    setsProgress: (done: number, total: number) => string;
    lastTime: string;
    firstTime: string;
    useLast: string;
    formTips: string;
    hideTips: string;
    addThirty: string;
    progressSaved: string;
    effortTitle: string;
    effortBody: string;
    effortComfortable: string;
    effortHard: string;
    effortLimit: string;
    summaryTitle: string;
    summaryBody: string;
    resumeTitle: string;
    resumeAction: string;
    skipConfirm: string;
  };
  paywall: {
    title: string;
    subtitle: string;
    benefits: [string, string, string, string];
    cta: string;
    footnote: string;
    restore: string;
    terms: string;
    privacy: string;
    yearly: string;
    monthly: string;
    sixMonth: string;
    threeMonth: string;
    twoMonth: string;
    weekly: string;
    lifetime: string;
    perYear: string;
    perMonth: string;
    freeTrial: string;
    nTrial: (n: number, unit: string) => string;
    startTrial: (label: string) => string;
    noProducts: string;
  };
  notifications: { reminderTitle: string; reminderBody: string };
}

/** Localized name + coaching cues for one exercise, keyed by its library id. */
export interface ExerciseText {
  name: string;
  cues: [string, string, string];
}
export type ExerciseDict = Record<string, ExerciseText>;
