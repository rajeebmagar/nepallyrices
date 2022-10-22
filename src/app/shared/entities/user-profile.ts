import { CreateAuditable } from "./create-auditable";
import { Gender } from "./gender";
import { Image } from "../../shared-models/image";
import { Address } from "./address";
export class UserProfile extends CreateAuditable {
  userProfileId: string;
  fullName: string;
  urlFriendlyName: string;
  aboutMe: string;
  biography: string;
  address: Address;
  profilePicture: Image;
  coverPhoto: Image;
  coverPhotoPositionY: number;
  roles: string[];
  genres: string[];
  songsCount: number;
  followersCount: number;
  followingCount: number;
  dateOfBirth: Date;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  userName: string;
}
