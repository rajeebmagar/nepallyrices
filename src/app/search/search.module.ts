import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared-module/shared.module";
import { SharedSongsModule } from "app/shared-songs/shared-songs.module";
import { SearchRoutingModule } from "./search-routing.module";
import { SearchComponent } from "./search.component";
import { SearchService } from "./search.service";

@NgModule({
  declarations: [SearchComponent],
  imports: [SharedModule, SharedSongsModule, SearchRoutingModule],
  exports: [],
  providers: [SearchService],
})
export class SearchModule {}
