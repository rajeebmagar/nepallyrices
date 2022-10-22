import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { Genre } from "../../shared-models/genre";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FindGenreByNameService {
  constructor(private http: HttpClient) {}

  find(genreName: string): Observable<Genre[]> {
    let findGenreByName = `${environment.API_ENDPOINT}/genres/name/${genreName}`;
    return this.http.get<Genre[]>(findGenreByName);
  }
}
