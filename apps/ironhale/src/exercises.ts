import type { EquipmentProfile, Exercise, Joint, Pattern } from './types';

const J = (knee: 0|1|2|3, shoulder: 0|1|2|3, lumbar: 0|1|2|3, hip: 0|1|2|3, wrist: 0|1|2|3): Record<Joint, 0|1|2|3> => ({ knee, shoulder, lumbar, hip, wrist });
const G: EquipmentProfile[] = ['gym'];
const GH: EquipmentProfile[] = ['gym', 'home_dumbbells'];
const B: EquipmentProfile[] = ['bodyweight'];
const lower = (pattern: Pattern) => pattern === 'squat' || pattern === 'hinge';

const loaded = (
  id: string, name: string, pattern: Pattern, profiles: EquipmentProfile[], jointLoad: Record<Joint,0|1|2|3>,
  skillTier: 1|2|3, stabilityDemand: 0|1|2|3, unilateral = false,
  cues: [string,string,string] = ['Move with control.', 'Keep two reps in reserve.', 'Stop if the movement feels wrong.'],
): Exercise => ({ id, name, pattern, profiles, jointLoad, progressionMode: 'load', loadIncrementKg: lower(pattern) ? 2.5 : 1, skillTier, stabilityDemand, unilateral, demoId: id, cues });

const SQUAT_CHAIN = ['chair_sit_to_stand','box_squat_bw','bw_squat','split_squat_bw'];
const HINGE_CHAIN = ['glute_bridge','single_leg_glute_bridge','bw_good_morning','sl_rdl_bw'];
const PUSH_CHAIN = ['wall_pushup','incline_pushup','knee_pushup','floor_pushup'];
const tier = (id:string,name:string,pattern:Pattern,jointLoad:Record<Joint,0|1|2|3>,chain:string[],tierIndex:number,stabilityDemand:0|1|2|3,unilateral=false,cues:[string,string,string]=['Move with control.','Keep two reps in reserve.','Stop if the movement feels wrong.']): Exercise => ({ id,name,pattern,profiles:B,jointLoad,progressionMode:'tier',tierChain:chain,tierIndex,skillTier: Math.min(3, tierIndex + 1) as 1|2|3,stabilityDemand,unilateral,demoId:id,cues });

export const EXERCISES: Exercise[] = [
  loaded('back_squat','Back Squat','squat',G,J(3,2,3,2,2),3,3,false,['Sit between your hips.','Brace before each rep.','Keep two reps in reserve.']),
  loaded('goblet_squat','Goblet Squat','squat',GH,J(2,1,1,2,1),2,1),
  loaded('box_goblet_squat','Box Goblet Squat','squat',GH,J(1,1,1,2,1),1,1,false,['Reach your hips to the box.','Tap softly—do not collapse.','Drive through your whole foot.']),
  loaded('leg_press','Leg Press','squat',G,J(1,0,1,2,0),1,0),
  loaded('deadlift','Deadlift','hinge',G,J(1,1,3,3,2),3,3),
  loaded('trap_bar_deadlift','Trap Bar Deadlift','hinge',G,J(2,1,2,3,2),2,2),
  loaded('db_romanian_deadlift','Dumbbell Romanian Deadlift','hinge',GH,J(1,1,2,3,1),2,2),
  loaded('db_hip_thrust','Dumbbell Hip Thrust','hinge',GH,J(1,0,1,3,0),1,1),
  loaded('barbell_bench','Barbell Bench Press','horizontal_push',G,J(0,3,1,0,2),3,2),
  loaded('db_bench','Dumbbell Bench Press','horizontal_push',GH,J(0,2,1,0,1),2,2),
  loaded('db_floor_press_neutral','Neutral-Grip Floor Press','horizontal_push',GH,J(0,1,0,0,1),1,0,false,['Keep palms facing in.','Pause your upper arms on the floor.','Press without shrugging.']),
  loaded('machine_chest_press','Machine Chest Press','horizontal_push',G,J(0,1,0,0,1),1,0),
  loaded('barbell_ohp','Barbell Overhead Press','vertical_push',G,J(0,3,2,0,2),3,2),
  loaded('seated_db_press','Seated Dumbbell Press','vertical_push',GH,J(0,2,1,0,1),2,1),
  loaded('landmine_press','Landmine Press','vertical_push',G,J(0,1,1,0,1),1,1,true),
  loaded('db_low_incline_press','Low-Incline Dumbbell Press','vertical_push',GH,J(0,2,1,0,1),2,1),
  loaded('barbell_row','Barbell Row','horizontal_pull',G,J(1,1,3,1,1),3,3),
  loaded('chest_supported_db_row','Chest-Supported Dumbbell Row','horizontal_pull',GH,J(0,1,0,0,1),1,0),
  loaded('single_arm_db_row','Single-Arm Dumbbell Row','horizontal_pull',GH,J(0,1,1,0,1),2,1,true),
  loaded('seated_cable_row','Seated Cable Row','horizontal_pull',G,J(0,1,1,0,1),1,0),
  loaded('pull_up','Pull-Up','vertical_pull',G,J(0,3,1,0,2),3,3),
  loaded('lat_pulldown','Lat Pulldown','vertical_pull',G,J(0,2,1,0,1),2,1),
  loaded('db_pullover','Dumbbell Pullover','vertical_pull',GH,J(0,2,1,0,1),2,1),
  loaded('half_kneeling_1arm_pulldown','Half-Kneeling One-Arm Pulldown','vertical_pull',G,J(0,1,0,0,1),2,2,true),
  tier('chair_sit_to_stand','Chair Sit-to-Stand','squat',J(1,0,1,2,0),SQUAT_CHAIN,0,0),
  tier('box_squat_bw','Bodyweight Box Squat','squat',J(1,0,1,2,0),SQUAT_CHAIN,1,1),
  tier('bw_squat','Bodyweight Squat','squat',J(2,0,1,2,0),SQUAT_CHAIN,2,1),
  tier('split_squat_bw','Bodyweight Split Squat','squat',J(2,0,1,2,0),SQUAT_CHAIN,3,2,true),
  tier('glute_bridge','Glute Bridge','hinge',J(0,0,1,2,0),HINGE_CHAIN,0,0),
  tier('single_leg_glute_bridge','Single-Leg Glute Bridge','hinge',J(1,0,1,3,0),HINGE_CHAIN,1,2,true),
  tier('bw_good_morning','Bodyweight Good Morning','hinge',J(0,0,2,3,0),HINGE_CHAIN,2,1),
  tier('sl_rdl_bw','Single-Leg Bodyweight RDL','hinge',J(1,0,2,3,0),HINGE_CHAIN,3,3,true),
  tier('wall_pushup','Wall Push-Up','horizontal_push',J(0,1,0,0,2),PUSH_CHAIN,0,0),
  tier('incline_pushup','Incline Push-Up','horizontal_push',J(0,2,1,0,3),PUSH_CHAIN,1,1),
  tier('knee_pushup','Knee Push-Up','horizontal_push',J(0,2,1,0,3),PUSH_CHAIN,2,1),
  tier('floor_pushup','Floor Push-Up','horizontal_push',J(0,2,1,0,3),PUSH_CHAIN,3,2),
  tier('fist_pushup','Fist Push-Up','horizontal_push',J(0,2,1,0,0),PUSH_CHAIN,2,1,false,['Use a padded, stable surface.','Keep wrists neutral.','Keep two reps in reserve.']),
  tier('inverted_row_table','Table Inverted Row','horizontal_pull',J(0,1,1,0,1),['inverted_row_table'],0,2,false,['Use a solid, weighted table.','Test it with your full weight first.','Pull your chest toward the edge.']),
];

export const EXERCISE_BY_ID = Object.fromEntries(EXERCISES.map((e) => [e.id, e])) as Record<string, Exercise>;
export const PATTERN_LABELS: Record<Pattern,string> = { squat:'Squat',hinge:'Hinge',horizontal_push:'Chest press',vertical_push:'Overhead press',horizontal_pull:'Row',vertical_pull:'Pulldown' };
