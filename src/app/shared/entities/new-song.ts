import { ArtistRole } from "app/shared-artists/models/artist-role";

export class NewSong {
  title: string;
  lyrics: string;
  singers: ArtistRole[];
}
