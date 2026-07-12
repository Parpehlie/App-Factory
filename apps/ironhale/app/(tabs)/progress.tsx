import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '@app-factory/core';
import { useApp } from '../../src/AppProvider';
import { epley } from '../../src/engine';
import { EXERCISES, EXERCISE_BY_ID } from '../../src/exercises';
import { common,colors } from '../../src/theme';
import { useExerciseText, useT } from '../../src/i18n';
import type { Pattern } from '../../src/types';

const patterns:Pattern[]=['squat','hinge','horizontal_push','vertical_push','horizontal_pull','vertical_pull'];
export default function Progress(){
  const router=useRouter();const {isPremium}=usePremium();const {state}=useApp();
  const t=useT();const exerciseText=useExerciseText();
  const points=useMemo(()=>patterns.map((pattern)=>{const values=state.history.flatMap((workout)=>workout.exercises.filter((r)=>EXERCISE_BY_ID[r.exerciseId]?.pattern===pattern).map((r)=>{const best=r.sets.filter((s)=>s.complete&&s.loadKg>0).map((s)=>epley(s.loadKg,s.reps));return {date:workout.completedAt,value:Math.max(0,...best)};})).filter((p)=>p.value>0);return {pattern,values};}),[state.history]);
  // One card per bodyweight pattern, showing the member's current tier. Keyed off the chain
  // (not per-exercise index) so the initial state shows 4 patterns, not 4 squat variants.
  const tierItems=useMemo(()=>{const seen=new Set<Pattern>();const items:{pattern:Pattern;chain:string[];tierIndex:number}[]=[];for(const exercise of EXERCISES){if(exercise.progressionMode!=='tier'||!exercise.tierChain||!exercise.profiles.includes('bodyweight')||seen.has(exercise.pattern))continue;seen.add(exercise.pattern);const tierIndex=state.progress[exercise.tierChain[0]!]?.tierIndex??exercise.tierIndex??0;items.push({pattern:exercise.pattern,chain:exercise.tierChain,tierIndex});}return items;},[state.progress]);
  const hasPoints=points.some(({values})=>values.length>0);
  const unitFactor=state.unitSystem==='lb'?2.2046226218:1;
  if(!isPremium)return <LockedProgress t={t} onUnlock={()=>router.push({pathname:'/paywall',params:{placement:'progress_gate'}})}/>;
  if(state.profile?.equipment==='bodyweight')return <SafeAreaView style={common.screen} edges={['top']}><ScrollView contentContainerStyle={common.page}><Text style={common.eyebrow}>{t.progress.eyebrow}</Text><Text style={common.h1}>{t.progress.tiersTitle}</Text><Text style={common.body}>{t.progress.tiersBody}</Text>{tierItems.map(({pattern,chain,tierIndex})=>{const currentId=chain[tierIndex]??chain[0]!;return <View key={pattern} style={common.card}><Text style={s.cardTitle}>{t.patterns[pattern]}</Text><Text style={s.current}>{exerciseText(currentId).name}</Text><View style={s.tierTrack}>{chain.map((id,i)=><View key={id} style={[s.tierDot,i<=tierIndex&&s.tierDotActive]}/>)}</View><Text style={s.muted}>{t.progress.tierOf(tierIndex+1,chain.length)}</Text></View>})}</ScrollView></SafeAreaView>;
  return <SafeAreaView style={common.screen} edges={['top']}><ScrollView contentContainerStyle={common.page}><Text style={common.eyebrow}>{t.progress.curveEyebrow}</Text><Text style={common.h1}>{t.progress.curveTitle}</Text><Text style={common.body}>{t.progress.curveBody}</Text>{points.filter((x)=>x.values.length>0).map(({pattern,values})=><CurveCard key={pattern} title={t.patterns[pattern]} unit={state.unitSystem} values={values.map((v)=>Math.round(v.value*unitFactor*10)/10)}/>)}{!hasPoints?<View style={[common.card,s.emptyCard]}><View style={s.emptyIcon}><Text style={s.emptyIconText}>↗</Text></View><View style={{flex:1}}><Text style={s.cardTitle}>{t.progress.firstPointTitle}</Text><Text style={[common.body,{fontSize:15,marginTop:4}]}>{t.progress.firstPointBody}</Text></View></View>:null}</ScrollView></SafeAreaView>;
}
/** Non-premium state for the Strength Curve tab. A teaser + explicit CTA replaces an
 *  auto-opened hard paywall, so tapping the tab never dead-ends on a blank screen. */
function LockedProgress({t,onUnlock}:{t:ReturnType<typeof useT>;onUnlock:()=>void}){
  const bars=[26,32,29,41,37,52,49,64];
  return <SafeAreaView style={common.screen} edges={['top']}><ScrollView contentContainerStyle={common.page}>
    <Text style={common.eyebrow}>{t.progress.curveEyebrow}</Text>
    <Text style={common.h1}>{t.progress.curveTitle}</Text>
    <Text style={common.body}>{t.progress.curveBody}</Text>
    <View style={s.lockedCard}>
      <View style={s.lockedChart}>{bars.map((h,i)=><View key={i} style={s.lockedBarSlot}><View style={[s.lockedBar,{height:h}]}/></View>)}</View>
      <View style={s.lockBadge}><Ionicons name="lock-closed" size={22} color={colors.green}/></View>
    </View>
    <View style={s.lockedBenefits}>{t.paywall.benefits.map((b)=><View key={b} style={s.benefitRow}><Ionicons name="checkmark-circle" size={20} color={colors.green}/><Text style={s.benefitText}>{b}</Text></View>)}</View>
    <TouchableOpacity accessibilityRole="button" style={common.button} onPress={onUnlock}><Text style={common.buttonText}>{t.settings.goPremium}</Text></TouchableOpacity>
  </ScrollView></SafeAreaView>;
}
function CurveCard({title,values,unit}:{title:string;values:number[];unit:'kg'|'lb'}){const t=useT();const max=Math.max(...values);const min=Math.min(...values);const range=Math.max(1,max-min);const first=values[0]??0;const last=values.at(-1)??0;const gain=values.length>1?last-first:0;return <View style={common.card}><View style={s.row}><View><Text style={s.cardTitle}>{title}</Text><Text style={s.big}>{last.toFixed(1)} {unit}</Text></View><Text style={[s.gain,gain<0&&{color:colors.danger}]}>{gain>=0?'+':''}{gain.toFixed(1)} {unit}</Text></View><View accessible accessibilityLabel={`${title} · ${t.progress.sessionPoints(values.length)}`} style={s.chart}>{values.map((value,i)=><View key={i} style={s.barSlot}><View style={[s.bar,{height:18+((value-min)/range)*62}]}/></View>)}</View><View style={s.chartFooter}><Text style={s.muted}>{first.toFixed(1)} → {last.toFixed(1)} {unit}</Text><Text style={s.muted}>{t.progress.sessionPoints(values.length)}</Text></View></View>}
const s=StyleSheet.create({row:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},cardTitle:{fontSize:18,fontWeight:'800',color:colors.ink},big:{fontSize:28,fontWeight:'900',color:colors.ink,marginTop:5},gain:{color:colors.green,fontWeight:'900',fontSize:15,backgroundColor:colors.soft,paddingHorizontal:10,paddingVertical:7,borderRadius:10},chart:{height:96,flexDirection:'row',alignItems:'flex-end',gap:5,marginTop:14,borderBottomWidth:1,borderBottomColor:colors.line},barSlot:{flex:1,alignItems:'center',justifyContent:'flex-end'},bar:{width:'72%',maxWidth:22,backgroundColor:colors.green,borderTopLeftRadius:5,borderTopRightRadius:5},chartFooter:{flexDirection:'row',justifyContent:'space-between',gap:10},muted:{fontSize:14,lineHeight:19,color:colors.muted,marginTop:8},emptyCard:{flexDirection:'row',alignItems:'center',gap:13},emptyIcon:{width:44,height:44,borderRadius:14,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center'},emptyIconText:{fontSize:25,fontWeight:'900',color:colors.green},current:{fontSize:23,fontWeight:'900',color:colors.green,marginTop:6},tierTrack:{flexDirection:'row',gap:7,marginTop:16},tierDot:{flex:1,height:8,borderRadius:4,backgroundColor:colors.line},tierDotActive:{backgroundColor:colors.green},lockedCard:{height:150,borderRadius:20,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,padding:18,justifyContent:'center',overflow:'hidden'},lockedChart:{flex:1,flexDirection:'row',alignItems:'flex-end',gap:7,opacity:.28},lockedBarSlot:{flex:1,alignItems:'center',justifyContent:'flex-end'},lockedBar:{width:'70%',maxWidth:20,backgroundColor:colors.green,borderTopLeftRadius:5,borderTopRightRadius:5},lockBadge:{position:'absolute',alignSelf:'center',width:52,height:52,borderRadius:26,backgroundColor:colors.soft,borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'},lockedBenefits:{gap:12,marginTop:4},benefitRow:{flexDirection:'row',alignItems:'center',gap:11},benefitText:{flex:1,fontSize:16,lineHeight:22,fontWeight:'600',color:colors.ink}});
