import { Injectable } from "@angular/core";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { Observable } from "rxjs";

import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { PagedResponse } from "app/shared-models/paged-response";
@Injectable()
export class TopMusiciansOfTheWeekService {
  constructor(private http: HttpClient) {}
  getTopMusiciansOfTheWeek(): Observable<PagedResponse<ArtistIntro>> {
    let topMusiciansOfTheWeekUrl = `${environment.API_ENDPOINT}/musicians/musiciansOfTheWeek?pageSize=5`;
    return this.http.get<PagedResponse<ArtistIntro>>(topMusiciansOfTheWeekUrl);
  }
}
