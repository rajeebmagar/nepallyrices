import { Injectable } from '@angular/core';
import { SocialMedia } from 'app/shared/entities/social-media';

import { environment } from 'environments/environment';
import { appsetting } from 'app-settings/app-setting';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class SocialMediaService {

  constructor(private http: HttpClient) { }
  addNew(newSocialMedia: SocialMedia, artistId: string): Observable<SocialMedia> {
    let newSocialMediaAPI = `${environment.API_ENDPOINT}/artists/${artistId}/socialprofilesites/new`;
    return this.http.post<SocialMedia>(newSocialMediaAPI, newSocialMedia);
  }
  remove(socialMedia: SocialMedia, artistId: string){
    let newSocialMediaAPI = `${environment.API_ENDPOINT}/artists/${artistId}/socialprofilesites/${socialMedia.id}`;
    return this.http.delete(newSocialMediaAPI);
  }
}
