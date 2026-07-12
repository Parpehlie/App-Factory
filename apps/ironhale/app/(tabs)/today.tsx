import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '@app-factory/core';
import { useApp } from '../../src/AppProvider';
import { EXERCISE_BY_ID } from '../../src/exercises';
import { common, colors } from '../../src/theme';
import { BrandMark } from '../../src/components';
import { useExerciseText, useFormatDate, useT } from '../../src/i18n';

const dayOffset = (timestamp: number) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const date = new Date(timestamp);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return Math.round((target - today) / 86_400_000);
};

export default function Today() {
  const router = useRouter();
  const { state, update } = useApp();
  const { isPremium } = usePremium();
  const t = useT();
  const formatDate = useFormatDate();
  const exerciseText = useExerciseText();
  const completed = new Set(state.history.map((item) => item.workoutId));
  const workout = state.plan.find((item) => !completed.has(item.id));

  if (!workout) {
    return <SafeAreaView style={common.screen}><View style={common.page}><Text style={common.h1}>{t.today.blockCompleteTitle}</Text><Text style={common.body}>{t.today.blockCompleteBody}</Text></View></SafeAreaView>;
  }

  const profile = state.profile;
  const freeLeft = Math.max(0, 6 - state.history.length);
  const locked = workout.index >= 7 && !isPremium;
  const adaptations = workout.exercises.filter((item) => item.substitutedFrom).length;
  const scheduleOffset = dayOffset(workout.scheduledAt);
  const scheduleLabel = scheduleOffset < 0
    ? t.today.overdueDate
    : scheduleOffset === 0
      ? t.today.todayDate
      : scheduleOffset === 1
        ? t.today.tomorrowDate
        : formatDate(workout.scheduledAt, { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  const fullDate = formatDate(workout.scheduledAt, { weekday: 'long', month: 'long', day: 'numeric' });
  const headline = t.today.goalHeadline[profile?.goal ?? 'strong'];
  const planTitle = t.workoutTitles[workout.titleKey];
  const protectedLabel = profile?.flaggedJoints.length
    ? t.today.protectedAreas(profile.flaggedJoints.length)
    : t.today.noProtectedAreas;
  const equipmentLabel = profile?.equipment === 'gym'
    ? t.onboarding.equipment.gym
    : profile?.equipment === 'home_dumbbells'
      ? t.onboarding.equipment.home
      : t.onboarding.equipment.bodyweight;
  const displayLoad = (kg:number) => state.unitSystem==='lb' ? Math.round(kg*2.2046226218*10)/10 : kg;

  const start = () => locked
    ? router.push({ pathname: '/paywall', params: { placement: 'session7_gate' } })
    : router.push({ pathname: '/workout/[id]', params: { id: workout.id } });

  const reschedule = () => Alert.alert(
    t.today.rescheduleAlertTitle,
    t.today.rescheduleAlertBody,
    [
      { text: t.today.keepSchedule, style: 'cancel' },
      {
        text: t.today.moveTomorrow,
        onPress: () => {
          const tomorrow = Date.now() + 86_400_000;
          const delta = tomorrow - workout.scheduledAt;
          update((current) => ({
            ...current,
            plan: current.plan.map((item) => item.index >= workout.index ? { ...item, scheduledAt: item.scheduledAt + delta } : item),
          }));
        },
      },
    ],
  );

  return (
    <SafeAreaView style={common.screen} edges={['top']}>
      <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={s.page}>
        <View style={s.topbar}>
          <View style={s.identity}>
            <BrandMark size={39} />
            <View>
              <Text style={s.brand}>IRONHALE</Text>
              <Text style={s.date}>{formatDate(Date.now(), { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
            </View>
          </View>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={t.tabs.settings} hitSlop={8} style={s.settingsButton} onPress={() => router.push('/(tabs)/settings')}>
            <Ionicons name="person-outline" size={20} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <Text style={s.headline}>{headline}</Text>

        <View style={s.contextRow}>
          <ContextItem value={String(state.history.length)} label={t.today.done} />
          <View style={s.contextDivider} />
          <ContextItem value={String(profile?.daysPerWeek ?? 3)} label={t.today.cadence(profile?.daysPerWeek ?? 3).replace(/^\d+\s*/, '')} />
          <View style={s.contextDivider} />
          <ContextItem icon="shield-checkmark-outline" value={String(profile?.flaggedJoints.length ?? 0)} label={protectedLabel.replace(/^\d+\s*/, '')} />
        </View>

        <View style={s.workoutCard}>
          <View style={s.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.nextUp}>{t.today.nextUp}</Text>
              <Text style={s.workoutTitle}>{planTitle}</Text>
              <Text style={s.sessionLine}>{t.today.sessionNumber(workout.index)} · {fullDate}</Text>
            </View>
            <View style={[s.schedulePill, scheduleOffset < 0 && s.schedulePillReady]}>
              <View style={s.scheduleDot} />
              <Text style={s.scheduleText}>{scheduleLabel}</Text>
            </View>
          </View>

          <View style={s.metaRow}>
            <Meta icon="time-outline" text="35–45 min" />
            <Meta icon="barbell-outline" text={t.today.meta(workout.exercises.length).split('·')[0]?.trim() ?? ''} />
            <Meta icon={profile?.equipment === 'gym' ? 'business-outline' : 'home-outline'} text={equipmentLabel} />
            {workout.isDeload ? <Meta icon="leaf-outline" text={t.today.recoveryWeek.trim()} /> : null}
          </View>

          {adaptations > 0 ? (
            <View style={s.adaptationBanner}>
              <Ionicons name="shield-checkmark" size={19} color={colors.lime} />
              <Text style={s.adaptationText}>{t.today.adaptationsReady(adaptations)}</Text>
            </View>
          ) : null}

          <View style={s.exerciseList}>
            {workout.exercises.slice(0, 3).map((item, index) => {
              const exercise = EXERCISE_BY_ID[item.exerciseId];
              if (!exercise) return null;
              return (
                <View key={`${item.exerciseId}-${index}`} style={s.exerciseRow}>
                  <Text style={s.exerciseIndex}>{String(index + 1).padStart(2, '0')}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.exerciseName}>{exerciseText(exercise.id).name}</Text>
                    <Text style={s.exercisePrescription}>{item.sets} × {item.repMin}–{item.repMax}{item.targetLoadKg ? `  ·  ${displayLoad(item.targetLoadKg)} ${state.unitSystem}` : ''}</Text>
                  </View>
                  {item.substitutedFrom ? <Ionicons name="shield-checkmark-outline" size={17} color={colors.lime} /> : null}
                </View>
              );
            })}
            {workout.exercises.length > 3 ? <Text style={s.moreMovements}>{t.today.moreMovements(workout.exercises.length - 3)}</Text> : null}
          </View>

          <TouchableOpacity accessibilityRole="button" accessibilityLabel={locked ? t.today.unlockSession7 : t.today.startWorkout} activeOpacity={0.88} style={s.startButton} onPress={start}>
            <Text style={s.startText}>{locked ? t.today.unlockSession7 : state.activeWorkout?.workoutId===workout.id ? t.workout.resumeAction : t.today.startWorkout}</Text>
            <View style={s.startArrow}><Ionicons name={locked ? 'lock-closed' : 'arrow-forward'} size={18} color={colors.ink} /></View>
          </TouchableOpacity>
          {isPremium ? <TouchableOpacity hitSlop={8} style={s.reschedule} onPress={reschedule}><Ionicons name="calendar-outline" size={15} color="#BFC8C2" /><Text style={s.rescheduleText}>{t.today.reschedule}</Text></TouchableOpacity> : null}
        </View>

        {!isPremium ? (
          <View style={[s.freePlan, locked && s.freePlanComplete]}>
            <View style={s.freeCopy}>
              <Text style={s.freeEyebrow}>{locked ? t.today.freePlanComplete : t.today.freeSession(Math.min(workout.index, 6))}</Text>
              <Text style={s.freeBody}>{freeLeft > 0 ? t.today.freeRemaining(freeLeft) : t.today.freeReady}</Text>
            </View>
            <View style={s.freeProgress}><View style={[s.freeProgressFill, { width: `${Math.min(100, state.history.length / 6 * 100)}%` }]} /></View>
            <Text style={s.freeCount}>{Math.min(state.history.length, 6)}/6</Text>
          </View>
        ) : null}

        <View style={s.insightCard}>
          <View style={s.insightIcon}><Ionicons name="refresh-outline" size={21} color={colors.green} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.insightTitle}>{t.today.recoveryTitle}</Text>
            <Text style={s.insightBody}>{t.today.recoveryBody}</Text>
          </View>
        </View>

        {state.history.length > 0 ? (
          <View style={s.historySection}>
            <Text style={s.sectionLabel}>{t.today.recentTraining}</Text>
            <View style={s.historyCard}>
              {state.history.slice().reverse().slice(0, 3).map((result, index) => {
                const planned = state.plan.find((item) => item.id === result.workoutId);
                return (
                  <View key={`${result.workoutId}-${result.completedAt}`} style={[s.historyRow, index > 0 && s.historyBorder]}>
                    <View style={s.historyCheck}><Ionicons name="checkmark" size={15} color="#fff" /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.historyTitle}>{planned ? t.workoutTitles[planned.titleKey] : t.today.sessionN(result.workoutIndex)}</Text>
                      <Text style={s.historyMeta}>{formatDate(result.completedAt, { month: 'short', day: 'numeric' })} · {t.today.minutes(Math.max(1, Math.round(result.durationSeconds / 60)))}</Text>
                    </View>
                    <Text style={s.historySessionTag}>{t.today.sessionN(result.workoutIndex)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function ContextItem({ value, label, icon }: { value: string; label: string; icon?: React.ComponentProps<typeof Ionicons>['name'] }) {
  return <View style={s.contextItem}><View style={s.contextValueRow}>{icon?<Ionicons name={icon} size={16} color={colors.green}/>:null}<Text style={s.contextValue}>{value}</Text></View><Text numberOfLines={2} style={s.contextLabel}>{label}</Text></View>;
}

function Meta({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }) {
  return <View style={s.meta}><Ionicons name={icon} size={15} color="#BFC8C2" /><Text style={s.metaText}>{text}</Text></View>;
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 36, gap: 18 },
  topbar: { minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brand: { fontSize: 12, fontWeight: '900', letterSpacing: 1.35, color: colors.green },
  date: { fontSize: 14, color: colors.muted, marginTop: 2, textTransform: 'capitalize' },
  settingsButton: { width: 41, height: 41, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  headline: { maxWidth: 345, fontSize: 30, lineHeight: 35, letterSpacing: -1, fontWeight: '900', color: colors.ink },
  contextRow: { minHeight: 74, borderRadius: 17, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  contextItem: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  contextValueRow: { minHeight: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  contextValue: { fontSize: 19, fontWeight: '900', color: colors.ink },
  contextLabel: { minHeight: 30, marginTop: 2, fontSize: 12, lineHeight: 15, fontWeight: '800', color: colors.muted, textTransform: 'uppercase', textAlign: 'center' },
  contextDivider: { width: 1, height: 38, backgroundColor: colors.line, marginHorizontal: 3 },
  workoutCard: { backgroundColor: colors.ink, borderRadius: 25, padding: 19, gap: 17, shadowColor: '#0B1710', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 9 }, elevation: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  nextUp: { color: colors.lime, fontSize: 12, fontWeight: '900', letterSpacing: 1.25 },
  workoutTitle: { color: '#fff', fontSize: 27, lineHeight: 31, fontWeight: '900', letterSpacing: -.7, marginTop: 4 },
  sessionLine: { color: '#C0C8C2', fontSize: 14, lineHeight: 20, marginTop: 5, textTransform: 'capitalize' },
  schedulePill: { maxWidth: 122, minHeight: 36, paddingHorizontal: 11, borderRadius: 999, backgroundColor: '#2E3B34', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  schedulePillReady: { backgroundColor: '#344C39' },
  scheduleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime },
  scheduleText: { flexShrink: 1, color: '#F2F5F2', fontSize: 12, lineHeight: 16, fontWeight: '900', letterSpacing: .4, textAlign: 'center' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 13 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: '#D0D7D2', fontSize: 13, fontWeight: '700' },
  adaptationBanner: { borderRadius: 13, backgroundColor: '#2A4132', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  adaptationText: { flex: 1, color: '#F0F8E2', fontSize: 14, lineHeight: 19, fontWeight: '800' },
  exerciseList: { gap: 0 },
  exerciseRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#344039' },
  exerciseIndex: { width: 24, color: '#96A39B', fontSize: 12, fontWeight: '900' },
  exerciseName: { color: '#F7F9F7', fontSize: 16, lineHeight: 21, fontWeight: '800' },
  exercisePrescription: { color: '#B7C1BA', fontSize: 13, lineHeight: 18, marginTop: 3 },
  moreMovements: { color: '#B7C1BA', fontSize: 13, fontWeight: '700', paddingTop: 11, paddingLeft: 35 },
  startButton: { minHeight: 55, borderRadius: 16, backgroundColor: colors.lime, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 18, paddingRight: 8 },
  startText: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  startArrow: { width: 39, height: 39, borderRadius: 13, backgroundColor: '#E7FFB8', alignItems: 'center', justifyContent: 'center' },
  reschedule: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 1 },
  rescheduleText: { color: '#D0D7D2', fontSize: 14, fontWeight: '700' },
  freePlan: { minHeight: 76, padding: 14, borderRadius: 17, backgroundColor: '#E6EED6', flexDirection: 'row', alignItems: 'center', gap: 10 },
  freePlanComplete: { backgroundColor: '#F6E8D9' },
  freeCopy: { flex: 1 },
  freeEyebrow: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  freeBody: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 3 },
  freeProgress: { width: 47, height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: '#C7D0B7' },
  freeProgressFill: { height: 6, borderRadius: 3, backgroundColor: colors.green },
  freeCount: { color: colors.green, fontSize: 13, fontWeight: '900' },
  insightCard: { padding: 16, borderRadius: 19, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  insightIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  insightTitle: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  insightBody: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 4 },
  historySection: { gap: 9 },
  sectionLabel: { color: colors.green, fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  historyCard: { borderRadius: 19, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 14 },
  historyRow: { minHeight: 73, flexDirection: 'row', alignItems: 'center', gap: 11 },
  historyBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  historyCheck: { width: 29, height: 29, borderRadius: 10, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  historyTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  historyMeta: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 3, textTransform: 'capitalize' },
  historySessionTag: { color: colors.green, fontSize: 12, fontWeight: '900', backgroundColor: colors.soft, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9, overflow: 'hidden' },
});
