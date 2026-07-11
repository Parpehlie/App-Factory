import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { track } from '@app-factory/core';
import { applyProgress, createInitialProgress, generatePlan } from './engine';
import { clearState, initialState, loadState, saveState } from './storage';
import type { AppState, Profile, WorkoutResult } from './types';

interface Value { state:AppState; ready:boolean; update:(fn:(s:AppState)=>AppState)=>void; finishOnboarding:(profile:Profile)=>Promise<void>; completeWorkout:(result:WorkoutResult)=>Promise<void>; reset:()=>Promise<void>; }
const Context = createContext<Value|null>(null);

export function AppProvider({children}:{children:React.ReactNode}) {
  const [state,setState] = useState<AppState>(initialState);
  const [ready,setReady] = useState(false);
  useEffect(() => { void loadState().then((s) => {setState(s);setReady(true);}); },[]);
  const commit = useCallback((next:AppState) => { setState(next); void saveState(next); },[]);
  const update = useCallback((fn:(s:AppState)=>AppState) => setState((current) => { const next=fn(current); void saveState(next); return next; }),[]);
  const finishOnboarding = useCallback(async (profile:Profile) => {
    const progress=createInitialProgress(profile); const next={...state,profile,progress,plan:generatePlan(profile,progress),onboardingDraft:{}};
    commit(next); track('core_action',{action:'plan_generated'});
  },[commit,state]);
  const completeWorkout = useCallback(async (result:WorkoutResult) => {
    const next={...state,history:[...state.history,result],progress:applyProgress(state,result.exercises)};
    next.plan=generatePlan(next.profile!,next.progress,next.plan[0]?.scheduledAt ?? state.createdAt);
    commit(next); track('core_action',{action:'workout_complete',index:result.workoutIndex});
  },[commit,state]);
  const reset=useCallback(async()=>{await clearState();commit(initialState());},[commit]);
  const value=useMemo(()=>({state,ready,update,finishOnboarding,completeWorkout,reset}),[state,ready,update,finishOnboarding,completeWorkout,reset]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp(){const value=useContext(Context);if(!value)throw new Error('useApp must be inside AppProvider');return value;}
