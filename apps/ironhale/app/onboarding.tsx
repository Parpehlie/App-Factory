import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingFlow, setOnboardingComplete, type OnboardingStep } from '@app-factory/core';
import { Ionicons } from '@expo/vector-icons';
import { BrandMark, Choice } from '../src/components';
import { useApp } from '../src/AppProvider';
import { useT } from '../src/i18n';
import { colors } from '../src/theme';
import type { EquipmentProfile, Joint, Profile, SkillTier } from '../src/types';

const wait=(ms:number)=>new Promise<void>((resolve)=>setTimeout(resolve,ms));

function StepIcon({name}:{name:React.ComponentProps<typeof Ionicons>['name']}){
  return <View style={s.iconWrap}><Ionicons name={name} size={27} color={colors.green}/></View>;
}

/** SPEC §3: the medical disclaimer must be shown before the first onboarding step. */
function DisclaimerNote({text}:{text:string}){
  return <View style={s.disclaimer}><Ionicons name="medical-outline" size={17} color={colors.orange}/><Text style={s.disclaimerText}>{text}</Text></View>;
}

export default function Onboarding(){
  const router=useRouter(); const {finishOnboarding}=useApp();
  const t=useT();
  const [goal,setGoal]=useState<Profile['goal']>(); const [ageBand,setAge]=useState<string>();
  const [joints,setJoints]=useState<Joint[]>([]); const [none,setNone]=useState(false);
  const [equipment,setEquipment]=useState<EquipmentProfile>(); const [skillTier,setSkill]=useState<SkillTier>(); const [days,setDays]=useState<2|3|4>();
  const toggleJoint=(joint:Joint)=>{setNone(false);setJoints((all)=>all.includes(joint)?all.filter((j)=>j!==joint):[...all,joint]);};
  const profile:Profile|undefined=goal&&ageBand&&equipment&&skillTier&&days?{goal,ageBand,equipment,skillTier,daysPerWeek:days,flaggedJoints:joints,temporaryFlags:[]}:undefined;
  const adapted = profile ? (joints.includes('knee') ? t.onboarding.reveal.adaptKnee : joints.includes('shoulder') ? t.onboarding.reveal.adaptShoulder : joints.includes('lumbar') ? t.onboarding.reveal.adaptLumbar : t.onboarding.reveal.adaptDefault) : '';

  const steps=useMemo<OnboardingStep[]>(()=>[
    {id:'goal',title:t.onboarding.goal.title,description:t.onboarding.goal.description,canContinue:!!goal,content:<View style={{width:'100%',gap:10}}><View style={{alignItems:'center'}}><BrandMark size={58}/></View><Choice label={t.onboarding.goal.strong} selected={goal==='strong'} onPress={()=>setGoal('strong')}/><Choice label={t.onboarding.goal.independent} selected={goal==='independent'} onPress={()=>setGoal('independent')}/><Choice label={t.onboarding.goal.muscle} selected={goal==='muscle'} onPress={()=>setGoal('muscle')}/><DisclaimerNote text={t.onboarding.disclaimer}/></View>},
    {id:'age_band',title:t.onboarding.age.title,description:t.onboarding.age.description,canContinue:!!ageBand,content:<View style={{width:'100%',gap:8}}><StepIcon name="hourglass-outline"/>{['50–54','55–59','60–64','65–69','70+'].map((x)=><Choice key={x} label={x} selected={ageBand===x} onPress={()=>setAge(x)}/>)}</View>},
    {id:'joints',title:t.onboarding.joints.title,description:t.onboarding.joints.description,canContinue:true,content:<View style={{width:'100%',gap:8}}><StepIcon name="shield-checkmark-outline"/>{(Object.keys(t.joints) as Joint[]).map((j)=><Choice key={j} label={t.joints[j]} selected={joints.includes(j)} onPress={()=>toggleJoint(j)}/>)}<Choice label={t.onboarding.joints.none} selected={none} onPress={()=>{setNone(true);setJoints([]);}}/></View>},
    {id:'equipment',title:t.onboarding.equipment.title,description:t.onboarding.equipment.description,canContinue:!!equipment,content:<View style={{width:'100%',gap:10}}><StepIcon name="barbell-outline"/><Choice label={t.onboarding.equipment.gym} detail={t.onboarding.equipment.gymDetail} selected={equipment==='gym'} onPress={()=>setEquipment('gym')}/><Choice label={t.onboarding.equipment.home} detail={t.onboarding.equipment.homeDetail} selected={equipment==='home_dumbbells'} onPress={()=>setEquipment('home_dumbbells')}/><Choice label={t.onboarding.equipment.bodyweight} detail={t.onboarding.equipment.bodyweightDetail} selected={equipment==='bodyweight'} onPress={()=>setEquipment('bodyweight')}/></View>},
    {id:'experience',title:t.onboarding.experience.title,description:t.onboarding.experience.description,canContinue:!!skillTier,content:<View style={{width:'100%',gap:10}}><StepIcon name="trending-up-outline"/><Choice label={t.onboarding.experience.never} selected={skillTier===1} onPress={()=>setSkill(1)}/><Choice label={t.onboarding.experience.yearsAgo} selected={skillTier===2} onPress={()=>setSkill(2)}/><Choice label={t.onboarding.experience.current} selected={skillTier===3} onPress={()=>setSkill(3)}/></View>},
    {id:'days',title:t.onboarding.days.title,description:t.onboarding.days.description,canContinue:!!days,content:<View style={{width:'100%',gap:10}}><StepIcon name="calendar-outline"/>{([2,3,4] as const).map((n)=><Choice key={n} label={t.onboarding.days.perWeek(n)} detail={n===2?t.onboarding.days.detail72:t.onboarding.days.detail48} selected={days===n} onPress={()=>setDays(n)}/>)}</View>},
    {id:'building_plan',title:t.onboarding.building.title,description:t.onboarding.building.description,cta:t.onboarding.building.cta,canContinue:!!profile,onContinue:async()=>{if(profile){await wait(3500);await finishOnboarding(profile);}},content:<View style={{width:'100%',backgroundColor:colors.soft,borderRadius:18,padding:18,gap:12}}><StepIcon name="sparkles-outline"/>{t.onboarding.building.steps.map((x)=><Text key={x} style={{color:colors.green,fontSize:15,fontWeight:'700'}}>✓  {x}</Text>)}</View>},
    {id:'plan_reveal',title:t.onboarding.reveal.title,description:t.onboarding.reveal.description,cta:t.onboarding.reveal.cta,canContinue:!!profile,content:<PlanReveal sessions={days??3} adapted={adapted} t={t.onboarding.reveal}/>},
  ],[adapted,ageBand,days,equipment,finishOnboarding,goal,joints,none,profile,skillTier,t]);

  return <OnboardingFlow steps={steps} primaryColor={colors.green} backgroundColor={colors.bg} textColor={colors.ink} mutedColor={colors.muted} backLabel={t.common.goBack} busyLabel={t.onboarding.buildingBusy} continueLabel={t.common.continue} onComplete={async()=>{await setOnboardingComplete();router.replace({pathname:'/paywall',params:{placement:'onboarding'}});}}/>;
}
function PlanReveal({sessions,adapted,t}:{sessions:number;adapted:string;t:ReturnType<typeof useT>['onboarding']['reveal']}){return <View style={s.reveal}><View style={s.planHero}><View style={s.heroTop}><View style={s.heroIcon}><Ionicons name="calendar-outline" size={22} color={colors.lime}/></View><Text style={s.heroLabel}>{t.weekOne}</Text></View><Text style={s.heroSessions}>{t.sessionSummary(sessions)}</Text></View><View style={s.adaptation}><View style={s.adaptationIcon}><Ionicons name="shield-checkmark" size={20} color={colors.green}/></View><View style={{flex:1}}><Text style={s.adaptationLabel}>{t.eyebrow}</Text><Text style={s.adaptationText}>{adapted}</Text></View></View><View style={s.promise}><Ionicons name="trending-up" size={19} color={colors.green}/><Text style={s.promiseText}>{t.addLoad}</Text></View><View style={s.effort}><Ionicons name="hand-left-outline" size={18} color={colors.orange}/><Text style={s.effortText}>{t.rirNote}</Text></View></View>}
const s=StyleSheet.create({iconWrap:{alignSelf:'center',width:56,height:56,borderRadius:18,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center',marginBottom:2},disclaimer:{marginTop:6,backgroundColor:'#FFF5EC',borderRadius:14,padding:13,flexDirection:'row',gap:9,alignItems:'flex-start'},disclaimerText:{flex:1,fontSize:13,lineHeight:19,fontWeight:'600',color:'#67462F'},reveal:{width:'100%',gap:13},planHero:{backgroundColor:colors.ink,borderRadius:22,padding:20,gap:10,overflow:'hidden'},heroTop:{flexDirection:'row',alignItems:'center',gap:9},heroIcon:{width:38,height:38,borderRadius:12,backgroundColor:'#2C4134',alignItems:'center',justifyContent:'center'},heroLabel:{color:colors.lime,fontSize:13,fontWeight:'900',letterSpacing:1.2},heroSessions:{color:'#fff',fontSize:26,lineHeight:32,fontWeight:'900',letterSpacing:-.6},adaptation:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,borderRadius:18,padding:16,flexDirection:'row',gap:11,alignItems:'flex-start'},adaptationIcon:{width:38,height:38,borderRadius:12,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center'},adaptationLabel:{fontSize:12,fontWeight:'900',letterSpacing:1,color:colors.green},adaptationText:{fontSize:17,lineHeight:23,fontWeight:'800',color:colors.ink,marginTop:4},promise:{flexDirection:'row',gap:9,alignItems:'flex-start',paddingHorizontal:5},promiseText:{flex:1,color:colors.ink,fontSize:16,lineHeight:23,fontWeight:'800'},effort:{backgroundColor:'#FFF4E8',borderRadius:14,padding:14,flexDirection:'row',gap:9,alignItems:'flex-start'},effortText:{flex:1,color:'#72523A',fontSize:15,lineHeight:22,fontWeight:'600'}});
