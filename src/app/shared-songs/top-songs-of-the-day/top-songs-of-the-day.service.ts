import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { SongIntro } from "app/shared-models/song-intro";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class TopSongsOfTheDayService {
  constructor(private http: HttpClient) {}
  getTopSongsOfTheDay(): Observable<SongIntro[]> {
    let topSongsURL = `${environment.API_ENDPOINT}/songs/topsongsoftheday?pageSize=12`;
    return this.http.get<SongIntro[]>(topSongsURL);
  }
}
