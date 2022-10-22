import {Injectable} from '@angular/core';
import {SocialSharing} from 'app/shared/entities/social-sharing';
import {environment} from 'environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class NepalyricsSharingService {

  constructor(private http: HttpClient) {
  }

  disconnect(provider: string){

    const removeSaringAccount = `${environment.API_ENDPOINT}/sharings/${provider}/disconnect`;
    return this.http.delete(removeSaringAccount);
  }
}
