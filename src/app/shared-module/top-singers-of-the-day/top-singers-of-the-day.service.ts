import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ArtistIntro } from "app/shared-models/artist-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class TopSingersOfTheDayService {
  constructor(private http: HttpClient) {}
  getTopSingersOfTheDay(): Observable<PagedResponse<ArtistIntro>> {
    let topSingersURL = `${environment.API_ENDPOINT}/singers/singersOfTheDay?pageSize=12`;
    return this.http.get<PagedResponse<ArtistIntro>>(topSingersURL);
  }
}
