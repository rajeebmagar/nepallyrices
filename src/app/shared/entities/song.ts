import { Image } from "../../shared-models/image";
import { Link } from "./link";
import { EmbeddedVideo } from "./embedded-video";
import { SongAudio } from "../../shared-models/song-audio";
import { ArtistRole } from "../../shared-artists/models/artist-role";
import { Genre } from "../../shared-models/genre";
import { Tag } from "./tag";
import { CreateAuditable } from "app/shared/entities/create-auditable";
import { SocialMediaShareable } from "./social-media-shareable";
import { SocialMediaTags } from "./social-media-tags";
export class Song extends CreateAuditable implements SocialMediaShareable {
  songId: number;
  title: string;
  urlFriendlyTitle: string;
  lyric: string;
  description: string;
  lyricExcerpt: string;
  lyricsCollected: boolean;
  coverPhoto: Image;
  coverPhotoPositionY: number;
  profilePicture: Image;
  lyricists: ArtistRole[];
  singers: ArtistRole[];
  coverSingers: ArtistRole[];
  musicians: ArtistRole[];
  embeddedVideos: EmbeddedVideo[];
  audios: SongAudio[];
  links: Link[];
  genres: Genre[];
  tags: Tag[];
  lastUpdatedDate: string;
  status: string; //Published, Draft, Removed, Spammed

  getSocialMediaTags(): SocialMediaTags {
    let socialMediaTags = new SocialMediaTags();
    socialMediaTags.type = "Nepali Songs";
    socialMediaTags.title = this.title;
    socialMediaTags.description =
      this.description || this.lyricExcerpt || this.lyric.length < 200
        ? this.lyric
        : this.lyric.substring(1, 200);
    socialMediaTags.url = window.location.href;
    if (this.coverPhoto) {
      socialMediaTags.image = this.coverPhoto.imageUrl;
    } else if (this.profilePicture) {
      socialMediaTags.image = this.profilePicture.imageUrl;
    }
    return socialMediaTags;
  }
}
