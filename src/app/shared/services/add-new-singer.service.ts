import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { ArtistRole } from "app/shared-artists/models/artist-role";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class AddNewSingerService {
  constructor(private http: HttpClient) {}

  add(singerName: string): Observable<ArtistRole> {
    let newSingerAPI = `${environment.API_ENDPOINT}/singers/new`;
    return this.http.post<ArtistRole>(newSingerAPI, { artistName: singerName });
  }
}
