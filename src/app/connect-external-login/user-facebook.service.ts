import { Injectable } from '@angular/core';
import { ConnectExternalAccount } from 'app/shared/entities/connect-external-account';
import { environment } from 'environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {ExternalAccount} from '../shared/entities/external-account';

@Injectable()
export class UserFacebookService {

  constructor(private http: HttpClient) { }

  link(connectExternalAccount: ConnectExternalAccount) { 
    const linkAccountAPI = `${environment.API_ENDPOINT}/externalaccounts/link`;
    return this.http.post(linkAccountAPI, connectExternalAccount);
  }
  unlink(provider: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'blob'
      })
    };
    const unlinkAccountAPI = `${environment.API_ENDPOINT}/externalaccounts/${provider}/unlink`;
    return this.http.delete(unlinkAccountAPI, options);
  }
  getExternalAccounts(): Observable<ExternalAccount[]> {
    let connectFacebookAPI = `${environment.API_ENDPOINT}/users/externalaccounts`;
    return this.http.get<ExternalAccount[]>(connectFacebookAPI);
    ;
  }
}
