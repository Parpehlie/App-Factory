import { useLocalSearchParams, useRouter } from 'expo-router';
import { Paywall } from '@app-factory/core';
import { useApp } from '../src/AppProvider';

const PRIVACY_URL='https://parphelie.com/ironhale/privacy';
const TERMS_URL='https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const HARD=new Set(['session7_gate','substitution_gate','progress_gate']);

export default function PaywallScreen(){
  const router=useRouter(); const {placement='onboarding'}=useLocalSearchParams<{placement?:string}>(); const {state}=useApp();
  const hard=HARD.has(placement);
  const done=()=>hard?router.back():router.replace('/(tabs)/today');
  return <Paywall placement={placement} allowDismiss={!hard} onPurchased={done} onDismiss={done} privacyUrl={PRIVACY_URL} termsUrl={TERMS_URL} analyticsProperties={{equipment:state.profile?.equipment??'unknown'}} content={{title:'Keep getting stronger. Every week.',subtitle:'Progressive strength training built around your joints — not against them.',benefits:['A new session every week, heavier than the last','Swap any exercise the day a joint complains','Watch your strength curve climb month after month','Recovery windows calibrated for training after 50'],cta:'Unlock IronHale',footnote:'Auto-renews yearly unless cancelled. Cancel anytime in the App Store. Terms · Privacy'}}/>;
}
