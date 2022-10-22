import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocialSharing } from 'app/shared/entities/social-sharing';
import { environment } from 'environments/environment';
import { FacebookPage } from 'app/shared/entities/facebook-page';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class NepalyricsFacebookSharingService {

  constructor(private http: HttpClient) { }

  connect(SocialSharing: SocialSharing) {
    let connectFacebookAPI = `${environment.API_ENDPOINT}/sharings/facebook`;
    return this.http.post(connectFacebookAPI, SocialSharing);
  }

  getPages(accessToken: string): Observable<FacebookPage[]> {
    let getFacebookPagesAPI = `${environment.API_ENDPOINT}/sharings/facebook/pages?accessToken=${accessToken}`;
    return this.http.get<FacebookPage[]>(getFacebookPagesAPI);
  }

  isConnected(): Observable<boolean> {
    let connectedFacebookAPI = `${environment.API_ENDPOINT}/sharings/facebook/connected`;
    return this.http.get<boolean>(connectedFacebookAPI);
  }

}
