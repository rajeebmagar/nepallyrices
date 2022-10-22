import { NgModule } from "@angular/core";
import { SharedArtistsModule } from "app/shared-artists/shared-artists.module";
import { SharedModule } from "app/shared-module/shared.module";
import { SharedSongsModule } from "app/shared-songs/shared-songs.module";
import { SharedUsersModule } from "app/shared-users/shared-users.module";
import { InlineEditorModule } from "app/shared/modules/inline-editor/inline-editor.module";
import { ShareButtonsModule } from "app/shared/modules/share-button.module";
import { ArtistFollowersComponent } from "./artist/artist-followers/artist-followers.component";
import { ArtistHeaderComponent } from "./artist/artist-header/artist-header.component";
import { GetArtistPicturesService } from "../shared-artist-services/get-artist-pictures.service";
import { SetArtistCoverPictureService } from "./artist/artist-header/set-artist-cover-picture.service";
import { SetArtistProfilePictureService } from "./artist/artist-header/set-artist-profile-picture.service";
import { ArtistPopularSongsComponent } from "./artist/artist-popular-songs/artist-popular-songs.component";
import { ArtistSongsComponent } from "./artist/artist-songs/artist-songs.component";
import { ArtistComponent } from "./artist/artist.component";
import { RelatedArtistsWidgetComponent } from "./artist/related-artists-widget/related-artists-widget.component";
import { SocialMediaCssClassPipe } from "./artist/social-medias/pipes/social-media-css-class.pipe";
import { SocialMediaIconCssClassPipe } from "./artist/social-medias/pipes/social-media-icon-css-class.pipe";
import { SocialMediaService } from "./artist/social-medias/social-media.service";
import { SocialMediasComponent } from "./artist/social-medias/social-medias.component";
import { ArtistsRoutingModule } from "./artists-routing.module";
import { ArtistsComponent } from "./artists.component";

@NgModule({
  declarations: [
    ArtistComponent,
    ArtistsComponent,
    ArtistSongsComponent,
    ArtistFollowersComponent,
    ArtistHeaderComponent,
    ArtistPopularSongsComponent,
    RelatedArtistsWidgetComponent,
    SocialMediasComponent,
    SocialMediaCssClassPipe,
    SocialMediaIconCssClassPipe,
  ],
  imports: [
    SharedModule,
    ArtistsRoutingModule,
    SharedArtistsModule,
    SharedUsersModule,
    SharedSongsModule,
  ],
  providers: [
    GetArtistPicturesService,
    SetArtistCoverPictureService,
    SetArtistProfilePictureService,
    SocialMediaService,
    SocialMediaCssClassPipe,
    SocialMediaIconCssClassPipe,
  ],
})
export class ArtistsModule {}
