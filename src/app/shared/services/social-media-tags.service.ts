import { Injectable } from '@angular/core';
import { SocialMediaTags } from 'app/shared/entities/social-media-tags'
import { Meta } from '@angular/platform-browser';
@Injectable()
export class SocialMediaTagsService {

  constructor(private meta: Meta) { }
  addTags(socialMediaTags: SocialMediaTags): void {

    this.addFacebookMetaTags(socialMediaTags);
    this.addTwitterMetaTags(socialMediaTags);
    this.addGoogleMetaTags(socialMediaTags);
  }

  addFacebookMetaTags(socialMediaTags: SocialMediaTags): void {
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:url"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('property="og:type"');

    this.meta.addTag({ property: 'og:type', content: socialMediaTags.type }, true);
    this.meta.addTag({ property: 'og:title', content: socialMediaTags.title }, true);
    this.meta.addTag({ property: 'og:description', content: socialMediaTags.description }, true);
    this.meta.addTag({ property: 'og:url', content: socialMediaTags.url }, true);
    this.meta.addTag({ property: 'og:image', content: socialMediaTags.image }, true);
  }

  addTwitterMetaTags(socialMediaTags: SocialMediaTags): void {

    this.meta.removeTag('property="twitter:card"');
    this.meta.removeTag('property="twitter:title"');
    this.meta.removeTag('property="twitter:description"');
    this.meta.removeTag('property="twitter:url"');
    this.meta.removeTag('property="twitter:image"');

    this.meta.addTag({ name: 'twitter:card', content: socialMediaTags.type }, true);
    this.meta.addTag({ name: 'twitter:title', content: socialMediaTags.title }, true);
    this.meta.addTag({ name: 'twitter:description', content: socialMediaTags.description }, true);
    this.meta.addTag({ name: 'twitter:url', content: socialMediaTags.url }, true);
    this.meta.addTag({ name: 'twitter:image', content: socialMediaTags.image }, true);
  }

  addGoogleMetaTags(socialMediaTags: SocialMediaTags): void {
    this.meta.removeTag('property="name"');
    this.meta.removeTag('property="description"');
    this.meta.removeTag('property="og:image"');
    
    this.meta.addTag({ itemprop: 'name', content: socialMediaTags.title }, true);
    this.meta.addTag({ itemprop: 'description', content: socialMediaTags.description }, true);
    this.meta.addTag({ itemprop: 'og:image', content: socialMediaTags.image }, true);
  }

}
