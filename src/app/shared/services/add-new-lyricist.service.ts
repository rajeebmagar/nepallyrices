import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

import { ArtistRole } from "app/shared-artists/models/artist-role";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AddNewLyricistService {
  constructor(private http: HttpClient) {}

  add(lyricistsName: string): Observable<ArtistRole> {
    let newSingerAPI = `${environment.API_ENDPOINT}/lyricists/new`;
    return this.http.post<ArtistRole>(newSingerAPI, {
      artistName: lyricistsName,
    });
  }
}
