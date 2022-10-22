import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared-module/shared.module";
import { SharedSongsModule } from "app/shared-songs/shared-songs.module";
import { SongService } from "app/shared-songs/song.service";
import { CommentEditComponent } from "./song/comment/comment-edit/comment-edit.component";
import { CommentComponent } from "./song/comment/comment.component";
import { EmbeddedVideos } from "./song/embedded-videos/embeded-videos";
import { MiniAudioPlayerComponent } from "./song/mini-audio-player/mini-audio-player.component";
import { NewEmbeddedVideoComponent } from "./song/new-embedded-video/new-embedded-video.component";
import { NewEmbeddedVideoService } from "./song/new-embedded-video/new-embedded-video.service";
import { RelatedTracksComponent } from "./song/related-tracks/related-tracks.component";
import { SongArtistsComponent } from "../shared-songs/song-artists/song-artists.component";
import { SongAudioUploadComponent } from "./song/song-audio-upload/song-audio-upload.component";
import { SetSongCoverPictureService } from "./song/song-header/set-song-cover-picture.service";
import { SetSongProfilePictureService } from "./song/song-header/set-song-profile-picture.service";
import { SongHeaderComponent } from "./song/song-header/song-header.component";
import { SongRelatedWidgetComponent } from "./song/song-related-widget/song-related-widget.component";
import { SongComponent } from "./song/song.component";
import { SongsRoutingModule } from "./songs-routing.module";
import { SongsComponent } from "./songs.component";
import { SharedArtistsModule } from "app/shared-artists/shared-artists.module";
import { UserIntroListComponent } from "./song/user-intro-list/user-intro-list.component";
import { UserIntroCellComponent } from "./song/user-intro-list/user-intro-cell/user-intro-cell.component";
import { GenreToTagInputOptionPipe } from "./pipes/genre-to-tag-input-option.pipe";
import { UserIntroToIntroViewContentPipe } from "./pipes/user-intro-to-intro-view-content.pipe";
import { FindGenreByNameService } from "./services/find-genre-by-name.service";
import { AddNewGenreService } from "./services/add-new-genre.service";

@NgModule({
  imports: [
    SongsRoutingModule,
    SharedSongsModule,
    SharedModule,
    SharedArtistsModule,
  ],
  declarations: [
    SongsComponent,
    SongComponent,
    CommentComponent,
    CommentEditComponent,
    EmbeddedVideos,
    MiniAudioPlayerComponent,
    NewEmbeddedVideoComponent,
    RelatedTracksComponent,
    SongAudioUploadComponent,
    SongHeaderComponent,
    SongRelatedWidgetComponent,
    UserIntroListComponent,
    UserIntroCellComponent,
    GenreToTagInputOptionPipe,
    UserIntroToIntroViewContentPipe,
  ],
  providers: [
    NewEmbeddedVideoService,
    SetSongCoverPictureService,
    SetSongProfilePictureService,
    FindGenreByNameService,
    AddNewGenreService,
  ],
})
export class SongsModule {}
