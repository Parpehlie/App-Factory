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

export interface PlannedWorkout {
  id: string;
  index: number;
  week: number;
  title: string;
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

export interface AppState {
  schemaVersion: 1;
  profile: Profile | null;
  plan: PlannedWorkout[];
  history: WorkoutResult[];
  progress: Record<string, ExerciseProgress>;
  onboardingDraft: Partial<Profile>;
  createdAt: number;
}
