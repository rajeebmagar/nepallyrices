import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class SearchFormService {

  private SEARCH_ALL: string = `${environment.API_ENDPOINT}/` + 'search/all/';

  constructor(private http: HttpClient) {
  }

  searchAll(query): Observable<any> {
    const url = this.SEARCH_ALL + query;
    return this.http.get(url).
      pipe(map(response => response));
  }

}
