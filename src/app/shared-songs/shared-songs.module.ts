import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenresToAnchorsPipe } from "./genres-to-anchors.pipe";
import { SongWidgetComponent } from "./song-widget/song-widget.component";
import { SharedModule } from "app/shared-module/shared.module";
import { SongIntroToIntroViewContentPipe } from "./song-intro-to-intro-view-content.pipe";
import { SongArtistsComponent } from "./song-artists/song-artists.component";
import { SharedModelsModule } from "app/shared-models/shared-models.module";
import { SharedArtistsModule } from "app/shared-artists/shared-artists.module";
import { SongService } from "./song.service";
import { TopSongsOfTheDayComponent } from "./top-songs-of-the-day/top-songs-of-the-day.component";
import { TopSongsOfTheDayService } from "./top-songs-of-the-day/top-songs-of-the-day.service";
import { ShareSongComponent } from "./share-song/share-song.component";

@NgModule({
  declarations: [
    GenresToAnchorsPipe,
    SongWidgetComponent,
    SongIntroToIntroViewContentPipe,
    SongArtistsComponent,
    TopSongsOfTheDayComponent,
    ShareSongComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedModelsModule,
    SharedArtistsModule,
  ],
  providers: [
    GenresToAnchorsPipe,
    SongIntroToIntroViewContentPipe,
    SongService,
    TopSongsOfTheDayService,
  ],
  exports: [
    GenresToAnchorsPipe,
    SongWidgetComponent,
    SongIntroToIntroViewContentPipe,
    SongArtistsComponent,
    TopSongsOfTheDayComponent,
    ShareSongComponent,
  ],
})
export class SharedSongsModule {}
