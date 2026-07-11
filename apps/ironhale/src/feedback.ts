import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/**
 * Tactile + audio feedback for the workout loop. Every call is best-effort:
 * on a simulator, a muted device or a platform without a Taptic Engine it is a
 * silent no-op and never blocks the set the user just logged.
 */

let player: AudioPlayer | null = null;

function beeper(): AudioPlayer | null {
  try {
    if (!player) {
      // Play the beep even when the phone is on silent — it is a training cue.
      void setAudioModeAsync({ playsInSilentMode: true });
      player = createAudioPlayer(require('../assets/timer-done.wav'));
    }
    return player;
  } catch {
    return null;
  }
}

/** Light tick when a set is marked done. */
export function setLogged(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Rest is over: success haptic + the two-blip cue, so eyes can leave the phone. */
export function restFinished(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  const p = beeper();
  if (p) {
    try {
      p.seekTo(0);
      p.play();
    } catch {
      /* audio is a bonus, never a blocker */
    }
  }
}

/** Warm success buzz when a whole workout is completed. */
export function workoutFinished(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
