import { Image } from "./image";
import { Link } from "../shared/entities/link";
import { ArtistRole } from "../shared-artists/models/artist-role";
import { EmbeddedVideo } from "../shared/entities/embedded-video";
import { SongAudio } from "./song-audio";
import { Genre } from "./genre";

export class SongIntro {
  id: number;
  title: string;
  lyric: string;
  description: string;
  lyricExcerpt: string;
  lyricsCollected: boolean;
  image: Image;
  lyricists: ArtistRole[];
  links: Link[];
  singers: ArtistRole[];
  musicians: ArtistRole[];
  embeddedVideos: EmbeddedVideo[];
  urlFriendlyTitle: string;
  audios: SongAudio[];
  genres: Genre[];
}
