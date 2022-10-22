import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {Observable, EMPTY} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SongsService {
  private SEARCH_SONGS: string = `${environment.API_ENDPOINT}/` + 'search/songs/startsWithTitle/';

  constructor(private http: HttpClient) {
  }

  search(query): Observable<any> {
    if (query) {
      const fullUrl = this.SEARCH_SONGS + query;
      return this.http.get<any>(fullUrl);
    } else {
      return EMPTY;
    }

  }
}
