import { Injectable } from "@angular/core";
import { ArtistProfile } from "app/shared/entities/artist-profile";
import { Image } from "app/shared-models/image";
import { PagedResponse } from "app/shared-models/paged-response";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GetExistingPictureService } from "app/shared-services/get-existing-picture.service";
@Injectable()
export class GetUserCoverPicturesService implements GetExistingPictureService {
  type: string = "cover";
  entityIds: string[];
  constructor(private http: HttpClient) {}
  get(): Observable<PagedResponse<Image>> {
    let getArtistPicturesAPI = `${environment.API_ENDPOINT}/users/${this.entityIds[0]}/${this.type}/photographs`;
    return this.http.get<PagedResponse<Image>>(getArtistPicturesAPI);
  }
}
