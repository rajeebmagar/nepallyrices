import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { FooterComponent } from "./footer/footer.component";
import { FooterBannerComponent } from "./footer-banner/footer-banner.component";

import { HomeComponent } from "./home/home.component";
import { HomeNavigationBarComponent } from "./home/home-navigation-bar/home-navigation-bar.component";
import { HomeAccountNavigationComponent } from "./home/home-navigation-bar/home-account-navigation/home-account-navigation.component";
import { HomeSearchComponent } from "./home/home-search/home-search.component";
import { HomeNepalyricsAdComponent } from "./home/home-nepalyrics-ad/home-nepalyrics-ad.component";
import { TopContentsContaineerComponent } from "./home/top-contents-containeer/top-contents-containeer.component";
import { TopLyricistsOfTheWeekComponent } from "./home/top-contents-containeer/top-lyricists-of-the-week/top-lyricists-of-the-week.component";
import { TopMusiciansOfTheWeekComponent } from "./home/top-contents-containeer/top-musicians-of-the-week/top-musicians-of-the-week.component";
import { TopSongsOfTheWeekComponent } from "./home/top-contents-containeer/top-songs-of-the-week/top-songs-of-the-week.component";
import { PaginationService } from "./shared/services/pagination.service";
import { NavigationBarComponent } from "./navigation-bar/navigation-bar.component";
import { SearchFormComponent } from "./search-form/search-form.component";
import { IntroListCommon } from "./shared/intro-list-common/intro-list-commom";

import { AudioPlayerService } from "./shared/services/audio-player.service";
import { ModelStatePipe } from "./shared/pipes/model-state.pipe";
import { MasterAudioPlayerComponent } from "./master-audio-player/master-audio-player.component";
import { KaraokeAudioPlayerComponent } from "./karaoke-audio-player/karaoke-audio-player.component";
import { KaraokeAudioPlayerService } from "./shared/services/karaoke-audio-player.service";
import { MapValuesPipe } from "./shared/pipes/map-values.pipe";
import { MapValuePipe } from "./shared/pipes/map-value.pipe";

import { ShareButtonsModule } from "./shared/modules/share-button.module";
import { AudioPlayListComponent } from "./audio-play-list/audio-play-list.component";
import { AudioPlayListService } from "./audio-play-list/audio-play-list.service";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongWithLikeCommandFactory } from "app/shared/commands/factories/song-with-like-command-factory";
import { ArtistWithFollowCommandFactory } from "app/shared/commands/factories/artist-with-follow-command-factory";

import { SocialShareCommandsFactoryService } from "app/shared/commands/factories/social-share-commands-factory.service";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
import { SongPlayListCommandsFactoryService } from "app/shared/commands/factories/song-play-list-commands-factory.service";
import { FacebookShareCommand } from "app/shared/commands/facebook-share-command";
import { TwitterShareCommand } from "app/shared/commands/twitter-share-command";
import { GooglePlusShareCommand } from "app/shared/commands/google-plus-share-command";

import { UrlHelper } from "app/shared/url-helper";
import { AddToPlayListComponent } from "./add-to-play-list/add-to-play-list.component";
import { AddToPlayListService } from "app/add-to-play-list/add-to-play-list.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TagInputModule } from "ngx-chips";
import { ConfirmDialogComponent } from "./shared/confirm-dialog/confirm-dialog.component";
import { InlineEditorModule } from "./shared/modules/inline-editor/inline-editor.module";
import { PlayListService } from "app/add-to-play-list/play-list.service";
import { CanActivateGaurd } from "app/shared/gaurds/can-activate-gaurd";
import { AdminOnlyGaurd } from "app/shared/gaurds/admin-only-gaurd";
import { SongLikeEventService } from "app/shared/services/song-like-event.service";
import { SaveAsPlaylistComponent } from "./save-as-playlist/save-as-playlist.component";
import { SaveAsPlaylistService } from "app/save-as-playlist/save-as-playlist.service";
import { CommandExecuteNotificationService } from "app/shared/services/command-execute-notification.service";
import { GoogleAnalyticsEventsService } from "app/shared/services/google-analytics-events.service";
import { NepalyricsSharingComponent } from "./nepalyrics-sharing/nepalyrics-sharing.component";
import { Autofocus } from "app/shared/directives/autofocus";
import { FacebookPagesComponent } from "./shared/nepalyrics-sharing/facebook-pages/facebook-pages.component";
import { SocialMediaTagsService } from "app/shared/services/social-media-tags.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { TokenRefreshService } from "app/shared/token-refresh.service";
import { CoverPhotoHelper } from "app/shared/helpers/cover-photo-helper";
import { ProfilePhotoHelper } from "app/shared/helpers/profile-photo-helper";
import { ConnectExternalLoginComponent } from "./connect-external-login/connect-external-login.component";
import { GoogleAnalyticsReportService } from "app/shared/services/google-analytics-report.service";
import { UserWithFollowCommandFactory } from "app/shared/commands/factories/user-with-follow-command-factory";
import { NotificationsComponent } from "./notifications/notifications.component";
import { NotificationCellComponent } from "./notifications/notification-cell/notification-cell.component";
import { NotificationsService } from "app/notifications/notifications.service";
import { NotificationToUrlPipe } from "./shared/pipes/notification-to-url.pipe";
import { NotificationToTitlePipe } from "./shared/pipes/notification-to-title.pipe";
import { DateToTimeAgoPipe } from "./shared/pipes/date-to-time-ago.pipe";
import { DisplayNotificationService } from "app/notifications/display-notification.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NewArtistDialogComponent } from "./shared/new-artist-dialog/new-artist-dialog.component";
import { httpInterceptorProviders } from "./shared/http-interceptors";

import { ShareSongComponent } from "./shared-songs/share-song/share-song.component";
import { UrlParamHelper } from "./shared/helpers/url-param-helper";
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared-module/shared.module";
import { UserAccountServicesModule } from "./user-account-services/user-account-services.module";
import { IdentityModule } from "./identity/identity.module";
import { SharedPlaylistsModule } from "./shared-playlists/shared-playlists.module";
import { SharedSongsModule } from "./shared-songs/shared-songs.module";
import { SharedUsersModule } from "./shared-users/shared-users.module";
import { SharedArtistsModule } from "./shared-artists/shared-artists.module";
import { SharedModelsModule } from "./shared-models/shared-models.module";
import { SharedSongServicesModule } from "./shared-song-services/shared-song-services.module";
import { SharedArtistServicesModule } from "./shared-artist-services/shared-artist-services.module";
import { SharedServicesModule } from "./shared-services/shared-services.module";
import { SharedAccountModule } from "./shared-account/shared-account.module";
import { UserAccountAccessService } from "./shared-account/user-account-access.service";
import { ImageCropperService } from "./shared-module/services/image-cropper.service";
import { ImageSelectorService } from "./shared-module/services/image-selector.service";
import { FileUploadService } from "./shared-module/services/file-upload.service";

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    FooterBannerComponent,
    HomeComponent,
    HomeNavigationBarComponent,
    HomeAccountNavigationComponent,
    HomeSearchComponent,
    HomeNepalyricsAdComponent,
    TopContentsContaineerComponent,
    TopLyricistsOfTheWeekComponent,
    TopMusiciansOfTheWeekComponent,
    TopSongsOfTheWeekComponent,
    NavigationBarComponent,
    SearchFormComponent,
    IntroListCommon,
    ModelStatePipe,
    MasterAudioPlayerComponent,
    KaraokeAudioPlayerComponent,
    MapValuesPipe,
    MapValuePipe,
    AudioPlayListComponent,
    AddToPlayListComponent,
    ConfirmDialogComponent,
    SaveAsPlaylistComponent,
    NepalyricsSharingComponent,
    Autofocus,
    FacebookPagesComponent,
    ConnectExternalLoginComponent,
    NotificationsComponent,
    NotificationCellComponent,
    NotificationToUrlPipe,
    NotificationToTitlePipe,
    DateToTimeAgoPipe,
    NewArtistDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TagInputModule,
    InlineEditorModule,
    ShareButtonsModule.forRoot(),
    SharedModule,
    UserAccountServicesModule,
    SharedUsersModule,
    IdentityModule,
    SharedPlaylistsModule,
    SharedSongsModule,
    SharedUsersModule,
    SharedArtistsModule,
    SharedModelsModule,
    SharedSongServicesModule,
    SharedArtistServicesModule,
    SharedServicesModule,
    SharedAccountModule,
  ],
  providers: [
    PaginationService,
    AudioPlayerService,
    KaraokeAudioPlayerService,
    SongLikeEventService,
    AudioPlayListService,
    SongWithAddToQueueCommandFactory,
    SongWithLikeCommandFactory,
    UserWithFollowCommandFactory,
    ArtistWithFollowCommandFactory,
    FacebookShareCommand,
    UrlHelper,
    GooglePlusShareCommand,
    TwitterShareCommand,
    SocialShareCommandsFactoryService,
    SongIntroCommandsFactoryService,
    SongPlayListCommandsFactoryService,
    AddToPlayListService,
    PlayListService,
    SaveAsPlaylistService,
    CommandExecuteNotificationService,
    GoogleAnalyticsEventsService,
    SocialMediaTagsService,
    UserAuthService,
    TokenRefreshService,
    CoverPhotoHelper,
    ProfilePhotoHelper,
    GoogleAnalyticsReportService,
    NotificationsService,
    DisplayNotificationService,
    HttpClientModule,
    httpInterceptorProviders,
    NotificationToUrlPipe,
    CanActivateGaurd,
    AdminOnlyGaurd,
    UrlParamHelper,
    UserAccountAccessService,
    ImageCropperService,
    ImageSelectorService,
    FileUploadService,
  ],
  bootstrap: [AppComponent],
  exports: [TagInputModule, BrowserAnimationsModule],
  entryComponents: [NewArtistDialogComponent, ConfirmDialogComponent],
})
export class AppModule {}
