import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingFlow, setOnboardingComplete, type OnboardingStep } from '@app-factory/core';
import { BrandMark, Choice } from '../src/components';
import { useApp } from '../src/AppProvider';
import { colors } from '../src/theme';
import type { EquipmentProfile, Joint, Profile, SkillTier } from '../src/types';

const jointLabels:Record<Joint,string>={knee:'Knee',shoulder:'Shoulder',lumbar:'Lower back',hip:'Hip',wrist:'Wrist'};
const wait=(ms:number)=>new Promise<void>((resolve)=>setTimeout(resolve,ms));

export default function Onboarding(){
  const router=useRouter(); const {finishOnboarding}=useApp();
  const [goal,setGoal]=useState<Profile['goal']>(); const [ageBand,setAge]=useState<string>();
  const [joints,setJoints]=useState<Joint[]>([]); const [none,setNone]=useState(false);
  const [equipment,setEquipment]=useState<EquipmentProfile>(); const [skillTier,setSkill]=useState<SkillTier>(); const [days,setDays]=useState<2|3|4>();
  const toggleJoint=(joint:Joint)=>{setNone(false);setJoints((all)=>all.includes(joint)?all.filter((j)=>j!==joint):[...all,joint]);};
  const profile:Profile|undefined=goal&&ageBand&&equipment&&skillTier&&days?{goal,ageBand,equipment,skillTier,daysPerWeek:days,flaggedJoints:joints,temporaryFlags:[]}:undefined;
  const adapted = profile ? (joints.includes('knee') ? 'Back Squat → Box Goblet Squat' : joints.includes('shoulder') ? 'Bench Press → Neutral-Grip Floor Press' : joints.includes('lumbar') ? 'Deadlift → Hip Thrust' : 'Joint-friendly from your first session') : '';

  const steps=useMemo<OnboardingStep[]>(()=>[
    {id:'goal',title:'What matters most?',description:'IronHale is real strength training, paced for recovery after 50.',canContinue:!!goal,content:<View style={{width:'100%',gap:10}}><View style={{alignItems:'center'}}><BrandMark size={58}/></View><View style={{backgroundColor:'#FFF4E8',padding:12,borderRadius:12}}><Text style={{color:'#72523A',fontSize:12,lineHeight:17}}>IronHale is not medical advice. Consult your doctor before starting a new training program.</Text></View><Choice label="Get strong again" selected={goal==='strong'} onPress={()=>setGoal('strong')}/><Choice label="Stay independent" selected={goal==='independent'} onPress={()=>setGoal('independent')}/><Choice label="Rebuild muscle" selected={goal==='muscle'} onPress={()=>setGoal('muscle')}/></View>},
    {id:'age_band',title:'Your recovery window',description:'Age helps us space demanding sessions—not limit what you can achieve.',canContinue:!!ageBand,content:<View style={{width:'100%',gap:8}}>{['50–54','55–59','60–64','65–69','70+'].map((x)=><Choice key={x} label={x} selected={ageBand===x} onPress={()=>setAge(x)}/>)}</View>},
    {id:'joints',title:'Train around sensitive joints',description:'Select every area you want IronHale to protect. You can change this later.',canContinue:true,content:<View style={{width:'100%',gap:8}}>{(Object.keys(jointLabels) as Joint[]).map((j)=><Choice key={j} label={jointLabels[j]} selected={joints.includes(j)} onPress={()=>toggleJoint(j)}/>)}<Choice label="None right now" selected={none} onPress={()=>{setNone(true);setJoints([]);}}/></View>},
    {id:'equipment',title:'Where do you train?',description:'Your plan only uses equipment you actually have.',canContinue:!!equipment,content:<View style={{width:'100%',gap:10}}><Choice label="Gym" detail="Machines, cables, barbells and dumbbells" selected={equipment==='gym'} onPress={()=>setEquipment('gym')}/><Choice label="Dumbbells at home" detail="A bench is helpful, but optional" selected={equipment==='home_dumbbells'} onPress={()=>setEquipment('home_dumbbells')}/><Choice label="Bodyweight only" detail="Three movement patterns, progressive tiers" selected={equipment==='bodyweight'} onPress={()=>setEquipment('bodyweight')}/></View>},
    {id:'experience',title:'Your lifting experience',description:'We use this to choose stable, learnable movements and a sensible starting load.',canContinue:!!skillTier,content:<View style={{width:'100%',gap:10}}><Choice label="Never lifted" selected={skillTier===1} onPress={()=>setSkill(1)}/><Choice label="Lifted years ago" selected={skillTier===2} onPress={()=>setSkill(2)}/><Choice label="Currently lifting" selected={skillTier===3} onPress={()=>setSkill(3)}/></View>},
    {id:'days',title:'A rhythm you can sustain',description:'Every plan respects at least 48–72 hours of recovery.',canContinue:!!days,content:<View style={{width:'100%',gap:10}}>{([2,3,4] as const).map((n)=><Choice key={n} label={`${n} days per week`} detail={n===2?'At least 72 hours between sessions':'At least 48 hours of recovery'} selected={days===n} onPress={()=>setDays(n)}/>)}</View>},
    {id:'building_plan',title:'Building around you',description:'We are checking every movement against your equipment, experience and sensitive joints.',cta:'Build my plan',canContinue:!!profile,onContinue:async()=>{if(profile){await wait(3500);await finishOnboarding(profile);}},content:<View style={{width:'100%',backgroundColor:colors.soft,borderRadius:18,padding:18,gap:12}}>{['Choosing stable compound movements','Applying joint load limits','Spacing recovery windows','Setting week-one targets'].map((x)=><Text key={x} style={{color:colors.green,fontSize:15,fontWeight:'700'}}>✓  {x}</Text>)}</View>},
    {id:'plan_reveal',title:`Your Week 1 — ${days??3} sessions.`,description:adapted,cta:'See my plan',canContinue:!!profile,content:<View style={{width:'100%',gap:12}}><View style={{backgroundColor:colors.green,borderRadius:18,padding:20}}><Text style={{color:colors.lime,fontWeight:'900',fontSize:13,letterSpacing:1}}>YOUR ADAPTATION</Text><Text style={{color:'#fff',fontWeight:'900',fontSize:20,marginTop:7}}>{adapted}</Text></View><Text style={{color:colors.ink,fontSize:18,fontWeight:'800',textAlign:'center'}}>We add load every week.</Text><Text style={{color:colors.muted,textAlign:'center'}}>Always at RIR 2. Never to muscular failure.</Text></View>},
  ],[adapted,ageBand,days,equipment,finishOnboarding,goal,joints,none,profile,skillTier]);

  return <OnboardingFlow steps={steps} primaryColor={colors.green} backgroundColor={colors.bg} textColor={colors.ink} mutedColor={colors.muted} onComplete={async()=>{await setOnboardingComplete();router.replace({pathname:'/paywall',params:{placement:'onboarding'}});}}/>;
}
