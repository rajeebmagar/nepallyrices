import { Injectable } from "@angular/core";
import { SetPictureService } from "app/shared/services/set-picture-service";
import { ArtistProfile } from "app/shared/entities/artist-profile";
import { Image } from "app/shared-models/image";
import { environment } from "environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { CoverPhotoHelper } from "../../../shared/helpers/cover-photo-helper";

@Injectable()
export class SetArtistCoverPictureService
  implements SetPictureService<ArtistProfile>
{
  constructor(
    private http: HttpClient,
    private coverPhotoHelper: CoverPhotoHelper
  ) {}
  setEntityPicture(
    artistProfile: ArtistProfile,
    coverPicture: Image,
    repositionOnly: boolean
  ): Observable<any> {
    console.log("y:" + artistProfile.coverPhotoPositionY);
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "blob",
      }),
    };
    const setArtistCoverPictureAPI = `${environment.API_ENDPOINT}/artists/${
      artistProfile.artistProfileId
    }/setCoverPhoto/${
      repositionOnly ? artistProfile.coverPhoto.id : coverPicture.id
    }/${this.coverPhotoHelper.getOffsetPercentage(
      artistProfile.coverPhotoPositionY
    )}`;
    return this.http.post(setArtistCoverPictureAPI, null, options);
  }
}
