import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'socialMediaIconCssClass'
})
export class SocialMediaIconCssClassPipe implements PipeTransform {

  transform(url: string): string {
      if(url.indexOf('facebook') > -1) {
        return "ion-social-facebook";   
      }
      else if(url.indexOf('twitter') > -1) {
        return "ion-social-twitter";   
      }
      else if(url.indexOf('instagram') > -1) {
        return "ion-social-instagram";   
      }
      else if(url.indexOf('youtube') > -1) {
        return "ion-social-youtube";   
      }
      else   
        return "ion-android-globe";
  }

}
