import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, EMPTY} from 'rxjs';

@Injectable()
export class SearchService {

  private SEARCH_ALL: string = `${environment.API_ENDPOINT}/` + 'search/all/';
  private SEARCH_ARTIST: string = `${environment.API_ENDPOINT}/` + 'search/all/';

  constructor(private http: HttpClient) {
  }

  searchAll(query): Observable<any> {

    if (query) {
      var url = this.SEARCH_ALL + query;
      return this.http.get(url);
    }
    else {
      return EMPTY;
      ;
    }

  }

  search(query, type): Observable<any> {
    var url = this.SEARCH_ALL;
    switch (type) {
      case 'all': {
        break
      }
      case 'artist': {
        url = this.SEARCH_ARTIST;
        break;
      }
    }
    if (query) {
      var fullUrl = this.SEARCH_ALL + query;
      return this.http.get(fullUrl);
    }
    else {
      return EMPTY;
    }

  }

}
