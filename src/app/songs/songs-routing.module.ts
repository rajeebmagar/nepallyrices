import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SongComponent } from "app/songs/song/song.component";
import { SongsComponent } from "./songs.component";

const routes: Routes = [
  { path: "", component: SongsComponent },
  { path: ":urlFriendlyTitle", component: SongComponent },
  { path: ":urlFriendlyTitle/lyrical", component: SongComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SongsRoutingModule {}
