import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FindSingerByNameService } from "./find-singer-by-name.service";
import { SharedServicesModule } from "app/shared-services/shared-services.module";
import { GetArtistPicturesService } from "./get-artist-pictures.service";
import { GetArtistCoverPicturesService } from "./get-artist-cover-pictures.service";

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedServicesModule],
  providers: [
    FindSingerByNameService,
    GetArtistPicturesService,
    GetArtistCoverPicturesService,
  ],
})
export class SharedArtistServicesModule {}
