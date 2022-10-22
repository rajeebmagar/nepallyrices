import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SongCollectionComponent } from "./song-collection.component";

const routes: Routes = [{ path: ":name", component: SongCollectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SongCollectionRoutingModule {}
