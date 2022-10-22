import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RelatedArtistComponent } from "./related-artists/related-artist/related-artist.component";
import { RouterModule } from "@angular/router";
import { RelatedArtistsComponent } from "./related-artists/related-artists.component";
import { ArtistService } from "app/artists/artist/artist.service";
import { ArtistsService } from "./artists.service";
import { SharedModelsModule } from "app/shared-models/shared-models.module";
import { ArtistRolesToAnchorsPipe } from "./pipes/artist-roles-to-anchors.pipe";
import { ArtistRoleToTagInputOptionPipe } from "./pipes/artist-role-to-tag-input-option.pipe";

@NgModule({
  declarations: [
    RelatedArtistComponent,
    RelatedArtistsComponent,
    ArtistRolesToAnchorsPipe,
    ArtistRoleToTagInputOptionPipe,
  ],
  imports: [CommonModule, RouterModule, SharedModelsModule],
  exports: [
    RelatedArtistComponent,
    RelatedArtistsComponent,
    ArtistRolesToAnchorsPipe,
    ArtistRoleToTagInputOptionPipe,
  ],
  providers: [
    ArtistService,
    ArtistsService,
    ArtistRolesToAnchorsPipe,
    ArtistRoleToTagInputOptionPipe,
  ],
})
export class SharedArtistsModule {}
