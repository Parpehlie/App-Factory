import { useLocalSearchParams, useRouter } from 'expo-router';
import { Paywall } from '@app-factory/core';
import { useApp } from '../src/AppProvider';
import { useT } from '../src/i18n';

const PRIVACY_URL='https://parphelie.com/projects/ironhale/privacy';
const TERMS_URL='https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const HARD=new Set(['session7_gate','substitution_gate','progress_gate']);

export default function PaywallScreen(){
  const router=useRouter(); const {placement='onboarding'}=useLocalSearchParams<{placement?:string}>(); const {state}=useApp();
  const t=useT(); const p=t.paywall;
  const hard=HARD.has(placement);
  const done=()=>hard?router.back():router.replace('/(tabs)/today');
  return <Paywall placement={placement} allowDismiss={!hard} onPurchased={done} onDismiss={done} privacyUrl={PRIVACY_URL} termsUrl={TERMS_URL} analyticsProperties={{equipment:state.profile?.equipment??'unknown'}} content={{title:p.title,subtitle:p.subtitle,benefits:[...p.benefits],cta:p.cta,footnote:p.footnote}} labels={{restore:p.restore,terms:p.terms,privacy:p.privacy,perYear:p.perYear,perMonth:p.perMonth,yearly:p.yearly,monthly:p.monthly,sixMonth:p.sixMonth,threeMonth:p.threeMonth,twoMonth:p.twoMonth,weekly:p.weekly,lifetime:p.lifetime,freeTrial:p.freeTrial,nTrial:p.nTrial,startTrial:p.startTrial,noProducts:p.noProducts}}/>;
}
