import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { ArtistRole } from "app/shared-artists/models/artist-role";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AddNewMusicianService {
  constructor(private http: HttpClient) {}

  add(musicianName: string): Observable<ArtistRole> {
    let newSingerAPI = `${environment.API_ENDPOINT}/musicians/new`;
    return this.http.post<ArtistRole>(newSingerAPI, {
      artistName: musicianName,
    });
  }
}
