import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

import { ArtistRole } from "app/shared-artists/models/artist-role";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AssignArtistAsLyricistService {
  constructor(private http: HttpClient) {}

  assign(artistId: string): Observable<ArtistRole> {
    let assignArtistAPI = `${environment.API_ENDPOINT}/lyricists/assignartist/${artistId}`;
    return this.http.post<ArtistRole>(assignArtistAPI, null);
  }
}
