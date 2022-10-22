import { UserIntro } from "app/shared-models/user-intro";
import { Image } from "app/shared-models/image";
import { Genre } from "app/shared-models/genre";
import { ArtistRole } from "app/shared-artists/models/artist-role";
import { CreateAuditable } from "app/shared/entities/create-auditable";
export class PlayList extends CreateAuditable {
  id: number;
  title: string;
  private: boolean;
  owner: UserIntro;
  coverPhoto: Image;
  profilePicture: Image;
  genres: Genre[];
  singers: ArtistRole[];
  songCount: number;
  lastUpdatedDate: string;
}
