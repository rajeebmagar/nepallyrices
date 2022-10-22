import { Link } from "app/shared/entities/link";
import { Observable, Observer } from "rxjs";
import { Injectable, Inject } from "@angular/core";

import { PagedResponse } from "app/shared-models/paged-response";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PaginationService {
  constructor(private http: HttpClient) {}

  nextPage<TItemType>(links: Link[]): Observable<PagedResponse<TItemType>> {
    //find next page
    var nextPage = this.getNextPageUrl(links);
    return this.getNextPageResponse<TItemType>(nextPage);
  }
  getNextPageResponse<TItemType>(
    apiUrl: string
  ): Observable<PagedResponse<TItemType>> {
    return this.http.get<PagedResponse<TItemType>>(apiUrl);
  }
  getNextPageUrl(links: Link[]): string {
    for (var i = 0; i < links.length; i++) {
      if (links[i].rel == "nextPage") return links[i].href;
    }
    return null;
  }
  public hasNext(links: Link[]): boolean {
    for (var i = 0; i < links.length; i++) {
      if (links[i].rel == "nextPage") return true;
    }
    return false;
  }
}
