import { Injectable } from "@angular/core";
import { Image } from "app/shared-models/image";
import { environment } from "environments/environment";
import { SetPictureService } from "app/shared/services/set-picture-service";
import { UserProfile } from "app/shared/entities/user-profile";
import { CoverPhotoHelper } from "app/shared/helpers/cover-photo-helper";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class SetUserAccountCoverPictureService
  implements SetPictureService<UserProfile>
{
  constructor(
    private http: HttpClient,
    private coverPhotoHelper: CoverPhotoHelper
  ) {}
  setEntityPicture(
    userProfile: UserProfile,
    coverPicture: Image,
    repositionOnly: boolean
  ) {
    let setArtistCoverPictureAPI = `${
      environment.API_ENDPOINT
    }/userprofiles/setCoverPhoto/${
      repositionOnly ? userProfile.coverPhoto.id : coverPicture.id
    }/${this.coverPhotoHelper.getOffsetPercentage(
      userProfile.coverPhotoPositionY
    )}`;
    return this.http.post(setArtistCoverPictureAPI, null);
  }
}
