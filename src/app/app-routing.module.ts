import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RegistrationConfirmationComponent } from "./account/user-account-access/registration-confirmation/registration-confirmation.component";
import { ExternalLoginComponent } from "./account/external-login/external-login.component";
import { HomeComponent } from "./home/home.component";
import { RegistrationSuccessfulComponent } from "./account/registration-successful/registration-successful.component";
import { ResetPasswordComponent } from "./account/reset-password/reset-password.component";
import { AccountActivatedComponent } from "./account/account-activated/account-activated.component";
import { SongCollectionComponent } from "./song-collection/song-collection.component";
import { CanActivateGaurd } from "app/shared/gaurds/can-activate-gaurd";
import { AdminOnlyGaurd } from "app/shared/gaurds/admin-only-gaurd";
import { NepalyricsSharingComponent } from "app/nepalyrics-sharing/nepalyrics-sharing.component";
import { ConnectExternalLoginComponent } from "app/connect-external-login/connect-external-login.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  {
    path: "contribute",
    loadChildren: () =>
      import("./contribute/contribute.module").then((m) => m.ContributeModule),
  },
  {
    path: "nlsharings",
    component: NepalyricsSharingComponent,
    canActivate: [AdminOnlyGaurd],
  },
  {
    path: "connectexternalaccount",
    component: ConnectExternalLoginComponent,
    canActivate: [CanActivateGaurd],
  },
  {
    path: "songs",
    loadChildren: () =>
      import("./songs/songs.module").then((m) => m.SongsModule),
  },
  {
    path: "artists",
    loadChildren: () =>
      import("./artists/artists.module").then((m) => m.ArtistsModule),
  },
  {
    path: "playlists",
    loadChildren: () =>
      import("./playlists/playlists.module").then((m) => m.PlaylistsModule),
  },
  {
    path: "search",
    loadChildren: () =>
      import("./search/search.module").then((m) => m.SearchModule),
  },
  {
    path: "account",
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "genres",
    loadChildren: () =>
      import("./song-collection/song-collection.module").then(
        (m) => m.SongCollectionModule
      ),
  },
  {
    path: "tags",
    loadChildren: () =>
      import("./song-collection/song-collection.module").then(
        (m) => m.SongCollectionModule
      ),
  },
  {
    path: "pages",
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
  },
  {
    path: ":userName",
    loadChildren: () =>
      import("./users/users.module").then((m) => m.UsersModule),
  },
  //redirects to home page is path is not valid
  { path: "**", redirectTo: "" },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
