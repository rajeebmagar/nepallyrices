import { Pipe, PipeTransform } from '@angular/core';
import { SocialNotification } from "app/shared/entities/social-notification";

@Pipe({
  name: 'notificationToUrl'
})
export class NotificationToUrlPipe implements PipeTransform {

  transform(socialNotification: SocialNotification): string {
    if(socialNotification.objectType==='Song')
      return '/songs/'+socialNotification.objectIdentifier;
    else if(socialNotification.objectType==='Artist')
      return '/artists/'+socialNotification.objectIdentifier;
    else if(socialNotification.objectType==='User')
      return '/'+socialNotification.objectIdentifier;
    else
      return "/";
  }

}
