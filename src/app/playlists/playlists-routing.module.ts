import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlayListDetailComponent } from "./play-list-detail/play-list-detail.component";
import { PublicPlayListComponent } from "./public-play-list/public-play-list.component";

const routes: Routes = [
  { path: "", component: PublicPlayListComponent },
  { path: ":id", component: PlayListDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistsRoutingModule {}
