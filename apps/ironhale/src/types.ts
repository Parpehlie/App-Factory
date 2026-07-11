export type Pattern =
  | 'squat'
  | 'hinge'
  | 'horizontal_push'
  | 'vertical_push'
  | 'horizontal_pull'
  | 'vertical_pull';

export type Joint = 'knee' | 'shoulder' | 'lumbar' | 'hip' | 'wrist';
export type EquipmentProfile = 'gym' | 'home_dumbbells' | 'bodyweight';
export type SkillTier = 1 | 2 | 3;

export interface Exercise {
  id: string;
  name: string;
  pattern: Pattern;
  profiles: EquipmentProfile[];
  jointLoad: Record<Joint, 0 | 1 | 2 | 3>;
  progressionMode: 'load' | 'tier';
  loadIncrementKg?: 1 | 2.5;
  tierChain?: string[];
  tierIndex?: number;
  skillTier: SkillTier;
  stabilityDemand: 0 | 1 | 2 | 3;
  unilateral: boolean;
  demoId: string;
  cues: [string, string, string];
}

export interface Profile {
  goal: 'strong' | 'independent' | 'muscle';
  ageBand: string;
  equipment: EquipmentProfile;
  flaggedJoints: Joint[];
  temporaryFlags: { joint: Joint; expiresAt: number }[];
  skillTier: SkillTier;
  daysPerWeek: 2 | 3 | 4;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  repMin: number;
  repMax: number;
  targetLoadKg?: number;
  targetRir: 2 | 3;
  extraSet?: boolean;
  substitutedFrom?: string;
  substitutionReason?: Joint;
}

export type WorkoutTitleKey =
  | 'full_body_a'
  | 'full_body_b'
  | 'full_body_c'
  | 'upper_a'
  | 'lower_a'
  | 'upper_b'
  | 'lower_b';

export interface PlannedWorkout {
  id: string;
  index: number;
  week: number;
  /** Structured title key — localized at render so a language switch retitles stored plans. */
  titleKey: WorkoutTitleKey;
  scheduledAt: number;
  exercises: WorkoutExercise[];
  isDeload: boolean;
}

export interface SetResult {
  reps: number;
  loadKg: number;
  rir: number;
  complete: boolean;
}

export interface ExerciseResult {
  exerciseId: string;
  sets: SetResult[];
  effort?: 'comfortable' | 'hard' | 'limit';
}

export interface WorkoutResult {
  workoutId: string;
  workoutIndex: number;
  completedAt: number;
  durationSeconds: number;
  exercises: ExerciseResult[];
}

export interface ExerciseProgress {
  exerciseId: string;
  currentLoadKg: number;
  tierIndex: number;
  consecutiveUnderMin: number;
}

export type UnitSystem = 'kg' | 'lb';

export interface ActiveWorkoutDraft {
  workoutId: string;
  startedAt: number;
  elapsedSeconds: number;
  exerciseIndex: number;
  results: Record<number, ExerciseResult>;
  restEndsAt: number | null;
  updatedAt: number;
}

export interface AppState {
  schemaVersion: 3;
  profile: Profile | null;
  plan: PlannedWorkout[];
  history: WorkoutResult[];
  progress: Record<string, ExerciseProgress>;
  onboardingDraft: Partial<Profile>;
  activeWorkout: ActiveWorkoutDraft | null;
  unitSystem: UnitSystem;
  restSeconds: 60 | 90 | 120;
  createdAt: number;
}
