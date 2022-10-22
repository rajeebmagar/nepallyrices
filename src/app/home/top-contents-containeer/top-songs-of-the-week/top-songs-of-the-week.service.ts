import { Injectable } from "@angular/core";
import { SongIntro } from "app/shared-models/song-intro";
import { Observable } from "rxjs";

import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { PagedResponse } from "app/shared-models/paged-response";
@Injectable()
export class TopSongsOfTheWeekService {
  constructor(private http: HttpClient) {}
  getTopSongsOfTheWeek(): Observable<PagedResponse<SongIntro>> {
    let topSongsOfTheWeekUrl = `${environment.API_ENDPOINT}/songs/topsongsoftheweek?pageSize=5`;
    return this.http.get<PagedResponse<SongIntro>>(topSongsOfTheWeekUrl);
  }
}
