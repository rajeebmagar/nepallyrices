import { Injectable } from "@angular/core";
import { SetPictureService } from "app/shared/services/set-picture-service";
import { ArtistProfile } from "app/shared/entities/artist-profile";
import { Image } from "app/shared-models/image";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class SetArtistProfilePictureService
  implements SetPictureService<ArtistProfile>
{
  constructor(private http: HttpClient) {}
  setEntityPicture(
    artistProfile: ArtistProfile,
    profilePicture: Image,
    repsitionOnly: boolean
  ) {
    let setArtistCoverPictureAPI = `${environment.API_ENDPOINT}/artists/${
      artistProfile.artistProfileId
    }/setProfilePicture/${
      repsitionOnly ? artistProfile.profilePicture.id : profilePicture.id
    }`;
    return this.http.post(setArtistCoverPictureAPI, null);
  }
}
