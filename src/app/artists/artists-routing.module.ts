import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArtistComponent } from "./artist/artist.component";
import { ArtistsComponent } from "./artists.component";

const routes: Routes = [
  { path: "", component: ArtistsComponent },
  { path: ":urlFriendlyName", component: ArtistComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
})
export class ArtistsRoutingModule {}
