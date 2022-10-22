import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PlaylistsRoutingModule } from "./playlists-routing.module";
import { PublicPlayListComponent } from "./public-play-list/public-play-list.component";
import { PlayListViewCellComponent } from "./public-play-list/play-list-view-cell/play-list-view-cell.component";
import { PlayListDetailComponent } from "./play-list-detail/play-list-detail.component";
import { SharedModelsModule } from "app/shared-models/shared-models.module";
import { SharedModule } from "app/shared-module/shared.module";
import { SharedPlaylistsModule } from "app/shared-playlists/shared-playlists.module";
import { PlayListDetailHeaderComponent } from "./play-list-detail/play-list-detail-header/play-list-detail-header.component";
import { SharedSongsModule } from "app/shared-songs/shared-songs.module";
import { SharedArtistsModule } from "app/shared-artists/shared-artists.module";

@NgModule({
  declarations: [
    PublicPlayListComponent,
    PlayListViewCellComponent,
    PlayListDetailComponent,
    PlayListDetailHeaderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedPlaylistsModule,
    SharedSongsModule,
    SharedArtistsModule,
    PlaylistsRoutingModule,
  ],
})
export class PlaylistsModule {}
