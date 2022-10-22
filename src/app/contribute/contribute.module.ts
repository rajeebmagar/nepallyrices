import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared-module/shared.module";
import { SharedPlaylistsModule } from "app/shared-playlists/shared-playlists.module";
import { SharedSongsModule } from "app/shared-songs/shared-songs.module";
import { AddNewSongService } from "./add-new-song.service";
import { CanLeaveContribute } from "./can-leave-contribute";
import { ContributeRoutingModule } from "./contribute-routing.module";
import { ContributeComponent } from "./contribute.component";
import { FindPossibleDuplicateSongsService } from "./find-possible-duplicate-songs.service";

@NgModule({
  declarations: [ContributeComponent],
  imports: [
    SharedModule,
    SharedSongsModule,
    SharedPlaylistsModule,
    ContributeRoutingModule,
  ],
  exports: [],
  providers: [
    FindPossibleDuplicateSongsService,
    AddNewSongService,
    CanLeaveContribute,
  ],
})
export class ContributeModule {}
