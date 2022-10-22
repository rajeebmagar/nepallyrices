import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search.component";

const routes: Routes = [
  { path: ":searchQuery", component: SearchComponent },
  { path: ":searchQuery/:searchType", component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
})
export class SearchRoutingModule {}
