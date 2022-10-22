import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared-module/shared.module";
import { SharedPlaylistsModule } from "app/shared-playlists/shared-playlists.module";
import { SharedSongsModule } from "app/shared-songs/shared-songs.module";
import { SongCollectionRoutingModule } from "./song-collection-routing.module";
import { SongCollectionComponent } from "./song-collection.component";

@NgModule({
  declarations: [SongCollectionComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedSongsModule,
    SharedPlaylistsModule,
    SongCollectionRoutingModule,
  ],
})
export class SongCollectionModule {}
