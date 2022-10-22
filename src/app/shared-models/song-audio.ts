import { Song } from "../shared/entities/song";
import { SongIntro } from "./song-intro";
import { LyricKaraoke } from "../shared/entities/lyric-karaoke";
import { CreateAuditable } from "app/shared/entities/create-auditable";
export class SongAudio extends CreateAuditable {
  id: number;
  mediaUrl: string;
  mediaType: string;
  hasKaraoke: boolean;
  lyricKaraoke: LyricKaraoke;
  song: Song;
  songIntro: SongIntro;
  songId: number;
}
