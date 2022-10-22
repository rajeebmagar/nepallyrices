import { Injectable } from '@angular/core';
import {SocialSharing} from 'app/shared/entities/social-sharing';
import { environment } from 'environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
@Injectable()
export class NepalyricsTwitterSharingService {

  constructor(private http: HttpClient) { }

  connect(socialSharing: SocialSharing){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'blob'
      })
    };
    const connectTwitterAPI = `${environment.API_ENDPOINT}/sharings/twitter`;
     return this.http.post(connectTwitterAPI, socialSharing, options);
  }
  isConnected():Observable<boolean>{
    let connectedTwitterAPI = `${environment.API_ENDPOINT}/sharings/twitter/connected`;
    return this.http.get<boolean>(connectedTwitterAPI);
  }
}
