import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import { EMPTY } from 'rxjs';

@Injectable()
export class ArtistsService {
  private SEARCH_ARTISTS: string = `${environment.API_ENDPOINT}/` + 'search/artists/startsWithFirstName/';

  constructor(private http: HttpClient) {
  }

  search(query): Observable<any> {
    if (query) {
      const fullUrl = this.SEARCH_ARTISTS + query;
      return this.http.get<any>(fullUrl);
    } else {
      return EMPTY;
    }

  }
}
