import * as Notifications from 'expo-notifications';

// Show the session reminder even if the app happens to be foregrounded when it fires.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

/** Copy is passed in (not a hook context) so the reminder fires in the user's language. */
export async function scheduleWorkoutReminder(scheduledAt:number,copy:{title:string;body:string}):Promise<void>{
  try{
    const permission=await Notifications.requestPermissionsAsync();
    if(!permission.granted)return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    const fireAt=Math.max(Date.now()+60000,scheduledAt-3*60*60*1000);
    await Notifications.scheduleNotificationAsync({content:{title:copy.title,body:copy.body,sound:true},trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date:new Date(fireAt)}});
  }catch{/* Local reminders are best-effort and never block a workout. */}
}
