import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

import { ArtistRole } from "app/shared-artists/models/artist-role";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FindMusicianByNameService {
  constructor(private http: HttpClient) {}

  find(musiciansName: string): Observable<ArtistRole[]> {
    let findSingerByName = `${environment.API_ENDPOINT}/musicians/name/${musiciansName}`;
    return this.http.get<ArtistRole[]>(findSingerByName);
  }
}
