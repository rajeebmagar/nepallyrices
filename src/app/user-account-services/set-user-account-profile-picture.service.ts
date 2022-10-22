import { Injectable } from "@angular/core";
import { Image } from "app/shared-models/image";
import { environment } from "environments/environment";
import { SetPictureService } from "app/shared/services/set-picture-service";
import { UserProfile } from "app/shared/entities/user-profile";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class SetUserAccountProfilePictureService
  implements SetPictureService<UserProfile>
{
  constructor(private http: HttpClient) {}
  setEntityPicture(
    userProfile: UserProfile,
    profilePicture: Image,
    repositionOnly: boolean
  ) {
    let setUserProfilePictureAPI = `${
      environment.API_ENDPOINT
    }/userprofiles/setProfilePicture/${
      repositionOnly ? userProfile.profilePicture.id : profilePicture.id
    }`;
    return this.http.post(setUserProfilePictureAPI, null);
  }
}
