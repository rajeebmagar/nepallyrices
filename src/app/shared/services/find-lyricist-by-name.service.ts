import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

import { ArtistRole } from "app/shared-artists/models/artist-role";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FindLyricistByNameService {
  constructor(private http: HttpClient) {}

  find(lyricistName: string): Observable<ArtistRole[]> {
    let findSingerByName = `${environment.API_ENDPOINT}/lyricists/name/${lyricistName}`;
    return this.http.get<ArtistRole[]>(findSingerByName);
  }
}
