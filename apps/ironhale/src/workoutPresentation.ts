import type { PlannedWorkout, WorkoutTitleKey } from './types';

/**
 * Keep presentation separate from the plan engine. The stored key makes plans
 * safe to translate later without having to migrate every locally saved plan.
 */
const EN_WORKOUT_TITLES: Record<WorkoutTitleKey, string> = {
  full_body_a: 'Full Body A',
  full_body_b: 'Full Body B',
  full_body_c: 'Full Body C',
  upper_a: 'Upper A',
  lower_a: 'Lower A',
  upper_b: 'Upper B',
  lower_b: 'Lower B',
};

export function workoutTitle(workout: Pick<PlannedWorkout, 'titleKey'>): string {
  return EN_WORKOUT_TITLES[workout.titleKey];
}

export function workoutDayLabel(scheduledAt: number, now = new Date()): string {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWorkout = new Date(scheduledAt);
  const workoutDay = new Date(startOfWorkout.getFullYear(), startOfWorkout.getMonth(), startOfWorkout.getDate()).getTime();
  const offset = Math.round((workoutDay - startOfToday) / 86_400_000);

  if (offset === 0) return 'TODAY';
  if (offset === 1) return 'TOMORROW';
  if (offset === -1) return 'YESTERDAY';
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(startOfWorkout).toUpperCase();
}
