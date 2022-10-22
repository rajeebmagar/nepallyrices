import { Image } from "app/shared-models/image";
export class ArtistRole {
  artistRoleId: number;
  artistId: string;
  artistName: string;
  artistUrlFriendlyName: string;
  coverPhoto: Image;
  profilePicture: Image;

  public static readonly NewArtistRoleId = -101;
  public static readonly NewArtistId = "NEW_ARTIST_ID";

  public static NewArtist({
    name,
    role,
  }: {
    name: string;
    role: string;
  }): ArtistRole {
    return {
      artistId: ArtistRole.NewArtistId,
      artistName: `Add New ${role} - '${name}'`,
      artistRoleId: ArtistRole.NewArtistRoleId,
      artistUrlFriendlyName: "",
      coverPhoto: null,
      profilePicture: null,
    } as ArtistRole;
  }
}
