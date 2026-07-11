import { assert, describe, expect, it } from 'vitest';
import { applyProgress, createInitialProgress, generatePlan, reflowWorkout } from './engine';
import { EXERCISES, EXERCISE_BY_ID } from './exercises';
import type { EquipmentProfile, ExerciseResult, Joint, Pattern, Profile, SetResult } from './types';

const EQUIP: EquipmentProfile[] = ['gym', 'home_dumbbells', 'bodyweight'];
const JOINTS: Joint[] = ['knee', 'shoulder', 'lumbar', 'hip', 'wrist'];
const PATTERNS: Pattern[] = ['squat', 'hinge', 'horizontal_push', 'vertical_push', 'horizontal_pull', 'vertical_pull'];
const FLAGSETS: Joint[][] = [[], ...JOINTS.map((j) => [j]), ['knee', 'shoulder'], ['lumbar', 'wrist'], [...JOINTS]];

const profile = (equipment: EquipmentProfile, flaggedJoints: Joint[], skillTier: 1 | 2 | 3 = 3, daysPerWeek: 2 | 3 | 4 = 3): Profile => ({
  goal: 'strong',
  ageBand: '50–54',
  equipment,
  flaggedJoints,
  temporaryFlags: [],
  skillTier,
  daysPerWeek,
});

const sets = (reps: number[], loadKg: number, rir = 2): SetResult[] => reps.map((r) => ({ reps: r, loadKg, rir, complete: true }));

/** Every generated plan across the full profile matrix. */
function* everyPlan() {
  for (const equipment of EQUIP)
    for (const flags of FLAGSETS)
      for (const skillTier of [1, 2, 3] as const)
        for (const days of [2, 3, 4] as const)
          yield { equipment, flags, skillTier, days, tag: `${equipment}/${flags.join('+') || 'none'}/T${skillTier}/${days}d`, plan: generatePlan(profile(equipment, flags, skillTier, days)) };
}

describe('substitution safety — the injury-critical promise (§8/§17)', () => {
  it('never loads a flagged joint above the tolerated threshold (2) on any profile', () => {
    for (const { flags, tag, plan } of everyPlan()) {
      for (const w of plan)
        for (const x of w.exercises) {
          const e = EXERCISE_BY_ID[x.exerciseId]!;
          for (const j of flags) assert.ok(e.jointLoad[j] <= 2, `${tag} w${w.index} ${e.id} loads flagged ${j} at ${e.jointLoad[j]}`);
        }
    }
  });

  it('bodyweight removes vertical patterns and keeps only the table row for pulling (§7)', () => {
    for (const { equipment, tag, plan } of everyPlan()) {
      if (equipment !== 'bodyweight') continue;
      for (const w of plan)
        for (const x of w.exercises) {
          const e = EXERCISE_BY_ID[x.exerciseId]!;
          assert.ok(e.pattern !== 'vertical_push' && e.pattern !== 'vertical_pull', `${tag} w${w.index} has vertical ${e.pattern}`);
          if (e.pattern === 'horizontal_pull') assert.equal(e.id, 'inverted_row_table', `${tag} w${w.index} pull=${e.id}`);
        }
    }
  });

  it('bodyweight + sensitive wrist forces the fist push-up (§7)', () => {
    for (const { equipment, flags, tag, plan } of everyPlan()) {
      if (equipment !== 'bodyweight' || !flags.includes('wrist')) continue;
      for (const w of plan)
        for (const x of w.exercises) {
          const e = EXERCISE_BY_ID[x.exerciseId]!;
          if (e.pattern === 'horizontal_push') assert.equal(e.id, 'fist_pushup', `${tag} w${w.index} push=${e.id}`);
        }
    }
  });

  it('home + sensitive shoulder drops the vertical pull program-wide and adds compensating row volume (§7)', () => {
    const flagged = generatePlan(profile('home_dumbbells', ['shoulder']));
    // safety: the sensitive shoulder is never asked to pull overhead
    expect(flagged.every((w) => w.exercises.every((x) => EXERCISE_BY_ID[x.exerciseId]!.pattern !== 'vertical_pull'))).toBe(true);
    // compensation: the lost pulling volume comes back as an extra row set outside deload
    expect(flagged.some((w) => !w.isDeload && w.exercises.some((x) => x.extraSet === true))).toBe(true);
    // recovery weeks stay clean of the extra volume
    expect(flagged.filter((w) => w.isDeload).every((w) => w.exercises.every((x) => !x.extraSet))).toBe(true);
  });
});

describe('programming (§9)', () => {
  it('plan spans 12 weeks at the chosen frequency', () => {
    for (const days of [2, 3, 4] as const) expect(generatePlan(profile('gym', [], 3, days)).length).toBe(days * 12);
  });

  it('can retain a 12-week runway after the initial block, with stable ids and weeks', () => {
    const p = profile('gym', [], 3, 3);
    const initial = generatePlan(p);
    const rolling = generatePlan(p, createInitialProgress(p), initial[0]!.scheduledAt, 39);
    expect(rolling).toHaveLength(39);
    expect(rolling[0]!.id).toBe(initial[0]!.id);
    expect(rolling.at(-1)!.index).toBe(39);
    expect(rolling.at(-1)!.week).toBe(13);
  });

  it('deload is week 5 only, and week 5 is a uniform 2 sets — including home+shoulder (regression)', () => {
    for (const { tag, plan } of everyPlan()) {
      for (const w of plan) {
        assert.equal(w.isDeload, w.week === 5, `${tag} w${w.index} isDeload=${w.isDeload} week=${w.week}`);
        if (w.isDeload) for (const x of w.exercises) assert.equal(x.sets, 2, `${tag} w${w.index} deload set count ${x.sets} on ${x.exerciseId}`);
      }
    }
  });

  it('double progression: +2.5 kg lower / +1 kg upper after three top-rep sets', () => {
    const p = profile('gym', []);
    const prog = createInitialProgress(p);
    const lower = prog['goblet_squat']!.currentLoadKg;
    const upper = prog['db_bench']!.currentLoadKg;
    const afterLower = applyProgress({ progress: prog } as never, [{ exerciseId: 'goblet_squat', sets: sets([12, 12, 12], lower) }]);
    const afterUpper = applyProgress({ progress: prog } as never, [{ exerciseId: 'db_bench', sets: sets([12, 12, 12], upper) }]);
    expect(afterLower['goblet_squat']!.currentLoadKg).toBe(lower + 2.5);
    expect(afterUpper['db_bench']!.currentLoadKg).toBe(upper + 1);
  });

  it('does not increase load when top reps were completed at the user’s limit', () => {
    const p = profile('gym', []);
    const prog = createInitialProgress(p);
    const load = prog['goblet_squat']!.currentLoadKg;
    const atLimit = sets([12, 12, 12], load, 0);
    const after = applyProgress({ progress: prog } as never, [{ exerciseId: 'goblet_squat', sets: atLimit, effort: 'limit' }]);
    expect(after['goblet_squat']!.currentLoadKg).toBe(load);
  });

  it('drops load 10% after two consecutive sessions under 8 reps', () => {
    const p = profile('gym', []);
    let prog = createInitialProgress(p);
    const load = prog['goblet_squat']!.currentLoadKg;
    const low: ExerciseResult = { exerciseId: 'goblet_squat', sets: sets([6, 5, 6], load) };
    prog = applyProgress({ progress: prog } as never, [low]);
    expect(prog['goblet_squat']!.currentLoadKg).toBe(load); // first bad session holds
    prog = applyProgress({ progress: prog } as never, [low]);
    expect(prog['goblet_squat']!.currentLoadKg).toBe(Math.round(load * 0.9 * 10) / 10);
  });

  it('tier progression: three sets of 15 advances the bodyweight chain', () => {
    const prog = createInitialProgress(profile('bodyweight', [], 1));
    const t0 = prog['wall_pushup']!.tierIndex;
    const after = applyProgress({ progress: prog } as never, [{ exerciseId: 'wall_pushup', sets: sets([15, 15, 15], 0) }]);
    expect(after['wall_pushup']!.tierIndex).toBe(t0 + 1);
  });
});

describe('reflow — "It\'s bothering me today" (§8)', () => {
  it('keeps the rest of the session safe for the temporary joint', () => {
    const p = profile('gym', []);
    const reflowed = reflowWorkout(generatePlan(p)[0]!, p, 'shoulder', 0);
    for (const x of reflowed.exercises) {
      const e = EXERCISE_BY_ID[x.exerciseId]!;
      expect(e.jointLoad['shoulder']).toBeLessThanOrEqual(2);
      if (e.jointLoad['shoulder'] === 1) expect(x.targetRir).toBe(3); // reduced intensity
    }
  });
});

describe('exercise library integrity — the data is the product (§6/§7)', () => {
  it('holds exactly 38 exercises with unique ids', () => {
    expect(EXERCISES.length).toBe(38);
    expect(new Set(EXERCISES.map((e) => e.id)).size).toBe(38);
  });

  it('every exercise is well formed', () => {
    for (const e of EXERCISES) {
      assert.ok(e.cues.length === 3 && e.cues.every((c) => c.length > 0), `${e.id} cues`);
      assert.ok(e.profiles.length > 0, `${e.id} profiles`);
      assert.ok(JOINTS.every((j) => [0, 1, 2, 3].includes(e.jointLoad[j])), `${e.id} jointLoad`);
      assert.ok(PATTERNS.includes(e.pattern), `${e.id} pattern`);
      assert.ok(!!EXERCISE_BY_ID[e.demoId], `${e.id} demoId`);
      if (e.progressionMode === 'load') {
        assert.ok(e.loadIncrementKg === 1 || e.loadIncrementKg === 2.5, `${e.id} increment`);
      } else {
        assert.ok((e.tierChain?.length ?? 0) > 0 && typeof e.tierIndex === 'number', `${e.id} tier meta`);
        assert.ok(e.tierChain!.every((id) => EXERCISE_BY_ID[id]?.pattern === e.pattern), `${e.id} chain pattern`);
        // fist_pushup reuses PUSH_CHAIN as a parallel wrist-safe variant (§7, "3*").
        if (e.id !== 'fist_pushup') assert.equal(e.tierChain![e.tierIndex!], e.id, `${e.id} self index`);
      }
    }
  });

  it('gym and home cover all six patterns; bodyweight covers exactly its four', () => {
    for (const eq of ['gym', 'home_dumbbells'] as const)
      for (const pat of PATTERNS) expect(EXERCISES.some((e) => e.profiles.includes(eq) && e.pattern === pat), `${eq}/${pat}`).toBe(true);
    const bw = new Set(EXERCISES.filter((e) => e.profiles.includes('bodyweight')).map((e) => e.pattern));
    expect(bw.has('vertical_push') || bw.has('vertical_pull')).toBe(false);
    for (const pat of ['squat', 'hinge', 'horizontal_push', 'horizontal_pull'] as const) expect(bw.has(pat), pat).toBe(true);
  });
});
