import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

import { ArtistRole } from "app/shared-artists/models/artist-role";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FindSingerByNameService {
  constructor(private http: HttpClient) {}

  find(singerName: string): Observable<ArtistRole[]> {
    let findSingerByName = `${environment.API_ENDPOINT}/singers/name/${singerName}`;
    return this.http.get<ArtistRole[]>(findSingerByName);
  }
}
