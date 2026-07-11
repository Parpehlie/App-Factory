import { EXERCISES, EXERCISE_BY_ID } from './exercises';
import type { AppState, Exercise, ExerciseProgress, ExerciseResult, Joint, Pattern, PlannedWorkout, Profile, WorkoutExercise } from './types';

const SAFE = 1;
const TOLERATED = 2;

export function activeFlags(profile: Profile, now = Date.now()): Joint[] {
  return [...new Set([...profile.flaggedJoints, ...profile.temporaryFlags.filter((f) => f.expiresAt > now).map((f) => f.joint)])];
}

function score(exercise: Exercise, target: Exercise, profile: Profile, flagged: Joint[]): number {
  const jointCost = flagged.reduce((sum, joint) => sum + exercise.jointLoad[joint], 0);
  return -10 * jointCost + 4 * Number(exercise.progressionMode === 'load') + 3 * Number(exercise.unilateral === target.unilateral) + 2 * Number(exercise.skillTier <= profile.skillTier) - Math.abs(exercise.stabilityDemand - target.stabilityDemand);
}

export function substitute(target: Exercise, profile: Profile): Exercise[] {
  const flagged = activeFlags(profile);
  const pool = EXERCISES.filter((e) => e.pattern === target.pattern && e.id !== target.id && e.profiles.includes(profile.equipment));
  let safe = pool.filter((e) => flagged.every((j) => e.jointLoad[j] <= SAFE));
  if (!safe.length) safe = pool.filter((e) => flagged.every((j) => e.jointLoad[j] <= TOLERATED));
  return safe.map((e) => ({ e, value: score(e, target, profile, flagged) })).sort((a,b) => b.value-a.value).slice(0,2).map(({e}) => e);
}

function safeExercise(target: Exercise, profile: Profile): Exercise | null {
  const flags = activeFlags(profile);
  if (flags.every((j) => target.jointLoad[j] <= SAFE)) return target;
  return substitute(target, profile)[0] ?? null;
}

const BASE: Record<Profile['equipment'], Record<Pattern, string | null>> = {
  gym: { squat:'back_squat', hinge:'deadlift', horizontal_push:'barbell_bench', vertical_push:'barbell_ohp', horizontal_pull:'barbell_row', vertical_pull:'pull_up' },
  home_dumbbells: { squat:'goblet_squat', hinge:'db_romanian_deadlift', horizontal_push:'db_bench', vertical_push:'seated_db_press', horizontal_pull:'single_arm_db_row', vertical_pull:'db_pullover' },
  bodyweight: { squat:'chair_sit_to_stand', hinge:'glute_bridge', horizontal_push:'wall_pushup', vertical_push:null, horizontal_pull:'inverted_row_table', vertical_pull:null },
};

const SPLITS: Record<2|3|4, { title:string; patterns:Pattern[] }[]> = {
  2: [
    { title:'Full Body A', patterns:['squat','horizontal_push','horizontal_pull','hinge'] },
    { title:'Full Body B', patterns:['hinge','vertical_push','vertical_pull','squat'] },
  ],
  3: [
    { title:'Full Body A', patterns:['squat','horizontal_push','horizontal_pull','hinge'] },
    { title:'Full Body B', patterns:['hinge','vertical_push','vertical_pull','squat'] },
    { title:'Full Body C', patterns:['squat','horizontal_pull','horizontal_push','hinge'] },
  ],
  4: [
    { title:'Upper A', patterns:['horizontal_push','horizontal_pull','vertical_push','vertical_pull'] },
    { title:'Lower A', patterns:['squat','hinge','squat','hinge'] },
    { title:'Upper B', patterns:['vertical_push','vertical_pull','horizontal_push','horizontal_pull'] },
    { title:'Lower B', patterns:['hinge','squat','hinge','squat'] },
  ],
};

const startingLoad = (e: Exercise, profile: Profile) => {
  const base = e.pattern === 'squat' || e.pattern === 'hinge' ? 20 : 8;
  const factor = profile.skillTier === 1 ? 0.6 : profile.skillTier === 2 ? 0.8 : 1;
  return Math.max(e.loadIncrementKg ?? 1, Math.round(base * factor / (e.loadIncrementKg ?? 1)) * (e.loadIncrementKg ?? 1));
};

export function createInitialProgress(profile: Profile): Record<string, ExerciseProgress> {
  return Object.fromEntries(EXERCISES.map((e) => [e.id, { exerciseId:e.id, currentLoadKg:e.progressionMode === 'load' ? startingLoad(e,profile) : 0, tierIndex:e.tierIndex ?? 0, consecutiveUnderMin:0 }]));
}

export function generatePlan(profile: Profile, progress = createInitialProgress(profile), startAt = Date.now()): PlannedWorkout[] {
  const split = SPLITS[profile.daysPerWeek];
  const gapDays = profile.daysPerWeek === 2 ? 3.5 : profile.daysPerWeek === 3 ? 2.3 : 1.75;
  const total = profile.daysPerWeek * 12;
  return Array.from({length:total}, (_,index) => {
    const template = split[index % split.length]!;
    const week = Math.floor(index / profile.daysPerWeek) + 1;
    const isDeload = week === 5;
    const used = new Set<string>();
    const exercises: WorkoutExercise[] = [];
    for (const pattern of template.patterns) {
      const baseId = BASE[profile.equipment][pattern];
      if (!baseId) continue;
      let target = EXERCISE_BY_ID[baseId];
      if (!target) continue;
      if(target.progressionMode==='tier'&&target.tierChain){const tierIndex=progress[target.id]?.tierIndex??target.tierIndex??0;target=EXERCISE_BY_ID[target.tierChain[tierIndex]??target.id]??target;}
      const chosen = [safeExercise(target, profile), ...substitute(target, profile)].find((candidate) => candidate && !used.has(candidate.id));
      if (!chosen) continue;
      used.add(chosen.id);
      const p = progress[chosen.id];
      const baseLoad=p?.currentLoadKg ?? startingLoad(chosen,profile);
      const plannedLoad=isDeload?baseLoad*0.9:week===6?baseLoad+(chosen.loadIncrementKg??1):baseLoad;
      exercises.push({ exerciseId:chosen.id, sets:isDeload ? 2 : 3, repMin:8, repMax:chosen.progressionMode === 'load' ? 12 : 15, targetLoadKg:chosen.progressionMode === 'load' ? Math.round(plannedLoad * 10)/10 : undefined, targetRir:2, substitutedFrom:chosen.id !== target.id ? target.id : undefined, substitutionReason:chosen.id !== target.id ? activeFlags(profile).find((j) => target.jointLoad[j] > SAFE) : undefined });
    }
    // Home + sensitive shoulder: the vertical pull is removed program-wide (§7), so add a
    // compensating row set on the days that carry a row (the vertical-pull day itself has
    // none). Skipped on the deload week so recovery weeks stay a uniform 2 sets (§9).
    if (!isDeload && profile.equipment === 'home_dumbbells' && profile.flaggedJoints.includes('shoulder') && !exercises.some((x) => EXERCISE_BY_ID[x.exerciseId]?.pattern === 'vertical_pull')) {
      const row = exercises.find((x) => x.exerciseId === 'chest_supported_db_row') ?? exercises.find((x) => EXERCISE_BY_ID[x.exerciseId]?.pattern === 'horizontal_pull');
      if (row) { row.sets += 1; row.extraSet = true; }
    }
    return { id:`workout-${index+1}`, index:index+1, week, title:template.title, scheduledAt:startAt + index*gapDays*86400000, exercises, isDeload };
  });
}

export function reflowWorkout(workout: PlannedWorkout, profile: Profile, joint: Joint, fromIndex: number, chosenCurrent?: string): PlannedWorkout {
  const temporaryFlags = [...profile.temporaryFlags.filter((f) => f.joint !== joint), {joint, expiresAt:Date.now()+7*86400000}];
  const nextProfile = {...profile, temporaryFlags};
  const exercises = workout.exercises.flatMap((item,index) => {
    const current = EXERCISE_BY_ID[item.exerciseId];
    if (!current) return [];
    if (index < fromIndex) return [item];
    if (index === fromIndex && chosenCurrent) return [{...item, exerciseId:chosenCurrent, substitutedFrom:item.exerciseId, substitutionReason:joint, targetRir:3 as const}];
    if (current.jointLoad[joint] >= 2) {
      const replacement = substitute(current,nextProfile)[0];
      return replacement ? [{...item,exerciseId:replacement.id,substitutedFrom:item.exerciseId,substitutionReason:joint,targetRir:3 as const}] : [];
    }
    return [{...item,targetRir: current.jointLoad[joint] === 1 ? 3 as const : item.targetRir}];
  });
  return {...workout,exercises};
}

export function applyProgress(state: AppState, results: ExerciseResult[]): Record<string,ExerciseProgress> {
  const progress = {...state.progress};
  for (const result of results) {
    const exercise = EXERCISE_BY_ID[result.exerciseId];
    if (!exercise) continue;
    const previous = progress[result.exerciseId] ?? {exerciseId:result.exerciseId,currentLoadKg:0,tierIndex:exercise.tierIndex??0,consecutiveUnderMin:0};
    const completed = result.sets.filter((s) => s.complete);
    const allTop = completed.length > 0 && completed.every((s) => s.reps >= (exercise.progressionMode === 'load' ? 12 : 15) && s.rir >= 2);
    const underMin = completed.length > 0 && completed.every((s) => s.reps < 8);
    let next = {...previous, consecutiveUnderMin:underMin ? previous.consecutiveUnderMin+1 : 0};
    if (exercise.progressionMode === 'load') {
      const usedLoad = Math.max(previous.currentLoadKg, ...completed.map((s) => s.loadKg));
      next.currentLoadKg = allTop ? usedLoad + (exercise.loadIncrementKg ?? 1) : next.consecutiveUnderMin >= 2 ? Math.round(usedLoad*0.9*10)/10 : usedLoad;
      if (next.consecutiveUnderMin >= 2) next.consecutiveUnderMin = 0;
    } else if (allTop && exercise.tierChain) next.tierIndex = Math.min(exercise.tierChain.length-1, previous.tierIndex+1);
    progress[result.exerciseId] = next;
    if(exercise.progressionMode==='tier'&&exercise.tierChain){for(const id of exercise.tierChain){progress[id]={...(progress[id]??next),exerciseId:id,tierIndex:next.tierIndex};}}
  }
  return progress;
}

export function epley(loadKg:number,reps:number): number { return Math.round(loadKg*(1+reps/30)*10)/10; }
