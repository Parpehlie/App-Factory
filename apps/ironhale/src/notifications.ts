import * as Notifications from 'expo-notifications';

export async function scheduleWorkoutReminder(scheduledAt:number):Promise<void>{
  try{
    const permission=await Notifications.requestPermissionsAsync();
    if(!permission.granted)return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    const fireAt=Math.max(Date.now()+60000,scheduledAt-3*60*60*1000);
    await Notifications.scheduleNotificationAsync({content:{title:'Your next IronHale session is ready',body:'A focused 35–45 minutes. RIR 2, never to failure.',sound:true},trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date:new Date(fireAt)}});
  }catch{/* Local reminders are best-effort and never block a workout. */}
}
