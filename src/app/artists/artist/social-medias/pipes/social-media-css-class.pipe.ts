import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'socialMediaCssClass'
})
export class SocialMediaCssClassPipe implements PipeTransform {

  transform(url: string): string {
      if(url.indexOf('facebook') > -1) {
        return "facebook";   
      }
      else if(url.indexOf('twitter') > -1) {
        return "twitter";   
      }
      else if(url.indexOf('instagram') > -1) {
        return "instagram";   
      }
      else if(url.indexOf('youtube') > -1) {
        return "youtube";   
      }
      else   
        return "web";
  }

}
