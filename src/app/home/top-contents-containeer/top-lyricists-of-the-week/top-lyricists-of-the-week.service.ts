import { Injectable } from "@angular/core";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { Observable } from "rxjs";

import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { PagedResponse } from "app/shared-models/paged-response";
@Injectable()
export class TopLyricistsOfTheWeekService {
  constructor(private http: HttpClient) {}
  getTopLyricistsOfTheWeek(): Observable<PagedResponse<ArtistIntro>> {
    let topLyricistsOfTheWeekUrl = `${environment.API_ENDPOINT}/lyricists/lyricistsOfTheWeek?pageSize=5`;
    return this.http.get<PagedResponse<ArtistIntro>>(topLyricistsOfTheWeekUrl);
  }
}
