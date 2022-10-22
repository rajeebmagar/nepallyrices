import { Image } from "./image";

export class ArtistIntro {
  artistId: string;
  name: string;
  urlFriendlyName: string;
  image: Image;
  address: string;
  followersCount: number;
  songsCount: number;
  isFollowing: boolean;
}
