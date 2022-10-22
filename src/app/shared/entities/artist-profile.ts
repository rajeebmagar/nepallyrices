import { Address } from "./address";
import { Image } from "../../shared-models/image";
import { Gender } from "./gender";
import { CreateAuditable } from "app/shared/entities/create-auditable";
import { SocialMediaShareable } from "./social-media-shareable";
import { SocialMediaTags } from "./social-media-tags";
export class ArtistProfile
  extends CreateAuditable
  implements SocialMediaShareable
{
  artistProfileId: string;
  fullName: string;
  urlFriendlyName: string;
  overview: string;
  biography: string;
  address: Address;
  profilePicture: Image;
  coverPhoto: Image;
  coverPhotoPositionY: number;
  roles: string[];
  genres: string[];
  songsCount: number;
  followersCount: number;
  dateOfBirth: Date;
  firstName: string;
  middlename: string;
  lastName: string;
  gender: Gender;
  lastUpdatedDate: string;

  getSocialMediaTags(): SocialMediaTags {
    let socialMediaTags = new SocialMediaTags();
    socialMediaTags.type = "Nepali Artist";
    socialMediaTags.title = this.fullName;
    socialMediaTags.description =
      this.overview || this.biography.length < 200
        ? this.biography
        : this.biography.substring(1, 200);
    socialMediaTags.url = window.location.href;
    if (this.coverPhoto) {
      socialMediaTags.image = this.coverPhoto.imageUrl;
    } else if (this.profilePicture) {
      socialMediaTags.image = this.profilePicture.imageUrl;
    }
    return socialMediaTags;
  }
}
