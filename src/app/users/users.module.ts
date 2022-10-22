import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsersRoutingModule } from "./users-routing.module";
import { UserAccountComponent } from "./user-account.component";
import { UserAccountHeaderComponent } from "./user-account-header/user-account-header.component";
import { UserAccountFollowersFollowingComponent } from "./user-account-followers-following/user-account-followers-following.component";
import { UserAccountServicesModule } from "app/user-account-services/user-account-services.module";
import { AngularMaterialModule } from "app/material.module";
import { FormsModule } from "@angular/forms";
import { InlineEditorModule } from "app/shared/modules/inline-editor/inline-editor.module";
import { IdentityModule } from "app/identity/identity.module";
import { SongContributionListComponent } from "./song-contribution-list/song-contribution-list.component";
import { SharedPlaylistsModule } from "app/shared-playlists/shared-playlists.module";
import { SharedSongsModule } from "app/shared-songs/shared-songs.module";
import { SharedModule } from "app/shared-module/shared.module";
import { SharedArtistsModule } from "app/shared-artists/shared-artists.module";
import { SharedUsersModule } from "app/shared-users/shared-users.module";

@NgModule({
  declarations: [
    UserAccountComponent,
    UserAccountHeaderComponent,
    UserAccountFollowersFollowingComponent,
    SongContributionListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    UserAccountServicesModule,
    IdentityModule,
    SharedArtistsModule,
    SharedPlaylistsModule,
    SharedSongsModule,
    SharedUsersModule,
  ],
})
export class UsersModule {}
