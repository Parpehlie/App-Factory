import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from './theme';
import type { Exercise, Pattern } from './types';

/**
 * Home-grown SVG rig — SPEC §10 route (b). Exercises are DATA, not video.
 * An articulated side-view figure interpolates between two keyframes (start → end)
 * and loops ~2.5s. Adding the 39th exercise costs zero production: it just reuses
 * its pattern's motion. This is the visual checkpoint the SPEC gates the price on.
 */

type Joint = 'hip' | 'neck' | 'head' | 'elbow' | 'hand' | 'knee' | 'foot';
type Pose = Record<Joint, [number, number]>;

// viewBox is 108 wide × 132 tall. Ground at y≈124. Figure faces right (+x).
const POSES: Record<Pattern, { a: Pose; b: Pose }> = {
  squat: {
    a: { hip: [54, 74], neck: [54, 46], head: [54, 33], elbow: [60, 60], hand: [66, 66], knee: [54, 98], foot: [54, 122] },
    b: { hip: [50, 92], neck: [52, 66], head: [52, 53], elbow: [58, 80], hand: [66, 84], knee: [70, 100], foot: [54, 122] },
  },
  hinge: {
    a: { hip: [54, 74], neck: [54, 46], head: [54, 33], elbow: [56, 62], hand: [57, 77], knee: [54, 98], foot: [54, 122] },
    b: { hip: [54, 74], neck: [76, 58], head: [85, 51], elbow: [74, 72], hand: [75, 88], knee: [57, 98], foot: [54, 122] },
  },
  horizontal_push: {
    a: { hip: [54, 74], neck: [54, 46], head: [54, 33], elbow: [46, 54], hand: [41, 56], knee: [54, 98], foot: [54, 122] },
    b: { hip: [54, 74], neck: [54, 46], head: [54, 33], elbow: [63, 52], hand: [79, 52], knee: [54, 98], foot: [54, 122] },
  },
  vertical_push: {
    a: { hip: [54, 74], neck: [54, 46], head: [54, 33], elbow: [48, 52], hand: [50, 42], knee: [54, 98], foot: [54, 122] },
    b: { hip: [54, 74], neck: [54, 46], head: [54, 33], elbow: [54, 30], hand: [54, 14], knee: [54, 98], foot: [54, 122] },
  },
  horizontal_pull: {
    a: { hip: [54, 74], neck: [62, 52], head: [70, 46], elbow: [72, 62], hand: [82, 70], knee: [55, 98], foot: [54, 122] },
    b: { hip: [54, 74], neck: [62, 52], head: [70, 46], elbow: [52, 56], hand: [44, 58], knee: [55, 98], foot: [54, 122] },
  },
  vertical_pull: {
    a: { hip: [54, 74], neck: [54, 46], head: [54, 33], elbow: [54, 30], hand: [54, 14], knee: [54, 98], foot: [54, 122] },
    b: { hip: [54, 74], neck: [54, 46], head: [54, 33], elbow: [45, 48], hand: [51, 50], knee: [54, 98], foot: [54, 122] },
  },
};

const APath = Animated.createAnimatedComponent(Path);
const ACircle = Animated.createAnimatedComponent(Circle);

export function ExerciseDemo({ exercise, compact = false }: { exercise: Exercise; compact?: boolean }) {
  const progress = useSharedValue(0);
  const pose = POSES[exercise.pattern];
  const a = pose.a;
  const b = pose.b;

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(withTiming(1, { duration: 1250, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [exercise.id, progress]);

  // Interpolated skeleton, recomputed on the UI thread every frame.
  const skeleton = useDerivedValue(() => {
    'worklet';
    const p = progress.value;
    const at = (j: Joint) => ({ x: a[j][0] + (b[j][0] - a[j][0]) * p, y: a[j][1] + (b[j][1] - a[j][1]) * p });
    return { hip: at('hip'), neck: at('neck'), head: at('head'), elbow: at('elbow'), hand: at('hand'), knee: at('knee'), foot: at('foot') };
  }, [a, b]);

  const bodyProps = useAnimatedProps(() => {
    'worklet';
    const s = skeleton.value;
    return {
      d:
        `M${s.hip.x},${s.hip.y} L${s.neck.x},${s.neck.y}` + // spine
        ` M${s.neck.x},${s.neck.y} L${s.elbow.x},${s.elbow.y} L${s.hand.x},${s.hand.y}` + // front arm
        ` M${s.hip.x},${s.hip.y} L${s.knee.x},${s.knee.y} L${s.foot.x},${s.foot.y}`, // front leg
    };
  });

  // Back limbs, offset and dimmed, give the flat figure a sense of depth.
  const backProps = useAnimatedProps(() => {
    'worklet';
    const s = skeleton.value;
    const o = -8;
    return {
      d:
        `M${s.neck.x + o},${s.neck.y} L${s.elbow.x + o},${s.elbow.y} L${s.hand.x + o},${s.hand.y}` +
        ` M${s.hip.x + o},${s.hip.y} L${s.knee.x + o},${s.knee.y} L${s.foot.x + o},${s.foot.y}`,
    };
  });

  const headProps = useAnimatedProps(() => {
    'worklet';
    return { cx: skeleton.value.head.x, cy: skeleton.value.head.y };
  });

  return (
    <View style={[styles.demo, compact && { height: 118 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 108 132">
        <Ellipse cx={52} cy={125} rx={26} ry={4} fill="#B7C6BB" opacity={0.6} />
        <APath animatedProps={backProps} stroke={colors.green} strokeOpacity={0.32} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <APath animatedProps={bodyProps} stroke={colors.green} strokeWidth={8.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ACircle animatedProps={headProps} r={8.5} fill={colors.green} />
      </Svg>
      <View style={styles.pill}>
        <Text style={styles.pillText}>2.5S FORM LOOP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  demo: { height: 168, borderRadius: 18, backgroundColor: '#E6EDE7', overflow: 'hidden' },
  pill: { position: 'absolute', right: 10, top: 10, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9 },
  pillText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8, color: colors.green },
});
