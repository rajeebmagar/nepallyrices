import { Pipe, PipeTransform } from '@angular/core';
import { SocialNotification } from "app/shared/entities/social-notification";

@Pipe({
  name: 'notificationToTitle'
})
export class NotificationToTitlePipe implements PipeTransform {

  transform(socialNotification: SocialNotification): string {
    if(socialNotification.objectType==='Song'){
      if(socialNotification.actionType==='Liked'){
        return 'liked a song';
      }
      else if(socialNotification.actionType==='Commented'){
        return 'commented on a song';
      }
      else if(socialNotification.actionType==='Published'){
        return 'published a new song';
      }
      else if(socialNotification.actionType==='KaraokePublished'){
        return 'published karaoke of a song';
      }
      else{
        return socialNotification.actionType +'on a song';
      }
    }
    else if(socialNotification.objectType==='Artist')
      return 'started follwing an artist';//artist only have follow action
    else if(socialNotification.objectType==='User')
      return 'started following you.';//user only have follow action
    else
      return "/";
  }

}
