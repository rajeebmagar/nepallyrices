import { Injectable } from "@angular/core";
import { ArtistProfile } from "app/shared/entities/artist-profile";
import { Image } from "app/shared-models/image";
import { PagedResponse } from "app/shared-models/paged-response";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { GetExistingPictureService } from "app/shared-services/get-existing-picture.service";
@Injectable()
export class GetArtistCoverPicturesService
  implements GetExistingPictureService
{
  type: string = "cover";
  entityIds: string[];
  constructor(private http: HttpClient) {}
  get(): Observable<PagedResponse<Image>> {
    let getArtistPicturesAPI = `${environment.API_ENDPOINT}/artists/${
      this.type
    }/photographs?${this.getUrlParams()}`;
    return this.http.get<PagedResponse<Image>>(getArtistPicturesAPI);
  }
  getUrlParams(): string {
    let params = this.entityIds.reduce((previousValue, artistId, index) => {
      return previousValue.concat(`artistIds[${index}]=${artistId}&`);
    }, "");
    return params.substring(0, params.length - 1);
  }
}
