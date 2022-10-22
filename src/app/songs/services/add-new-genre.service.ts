import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

import { ArtistRole } from "app/shared-artists/models/artist-role";
import { HttpClient } from "@angular/common/http";
import { Genre } from "../../shared-models/genre";

@Injectable()
export class AddNewGenreService {
  constructor(private http: HttpClient) {}

  add(genreName: string): Observable<Genre> {
    let newSingerAPI = `${environment.API_ENDPOINT}/genres/new`;
    return this.http.post<Genre>(newSingerAPI, { name: genreName });
  }
}
