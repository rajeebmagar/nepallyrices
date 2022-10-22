import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlayListWidgetComponent } from "./play-list-widget/play-list-widget.component";
import { RouterModule } from "@angular/router";
import { SharedSongsModule } from "app/shared-songs/shared-songs.module";
import { PlayListToIntroViewContentPipe } from "./play-list-to-intro-view-content.pipe";
import { SharedModule } from "app/shared-module/shared.module";

@NgModule({
  declarations: [PlayListWidgetComponent, PlayListToIntroViewContentPipe],
  imports: [CommonModule, RouterModule, SharedSongsModule, SharedModule],
  exports: [PlayListWidgetComponent, PlayListToIntroViewContentPipe],
  providers: [PlayListToIntroViewContentPipe],
})
export class SharedPlaylistsModule {}
