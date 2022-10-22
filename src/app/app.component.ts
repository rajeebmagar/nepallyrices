import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { KaraokeAudioPlayerService } from "app/shared/services/karaoke-audio-player.service";
import { SongAudio } from "app/shared-models/song-audio";
import { AudioPlayListService } from "./audio-play-list/audio-play-list.service";
import { AddToPlayListService } from "app/add-to-play-list/add-to-play-list.service";
import { SaveAsPlaylistService } from "app/save-as-playlist/save-as-playlist.service";
import { GoogleAnalyticsEventsService } from "app/shared/services/google-analytics-events.service";
import { Image } from "app/shared-models/image";
import { CroppedImage } from "app/shared/entities/cropped-image";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { ImageSelectionRequest } from "app/shared/entities/image-selection-request";
import { ArtistProfile } from "app/shared/entities/artist-profile";
import { SelectedImage } from "app/shared/entities/selected-image";
import { GetArtistPicturesService } from "app/shared-artist-services/get-artist-pictures.service";
import { PictureSelectorComponent } from "app/shared-module/picture-selector/picture-selector.component";
import { DisplayNotificationService } from "app/notifications/display-notification.service";
import { ImageCropperService } from "./shared-module/services/image-cropper.service";
import { ImageSelectorService } from "./shared-module/services/image-selector.service";
import { GetExistingPictureService } from "./shared-services/get-existing-picture.service";
import { UserAccountAccessService } from "./shared-account/user-account-access.service";

@Component({
  selector: "nl-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  notificationPositionX: number;
  getExistingPictureService: GetExistingPictureService;
  imageForCrop: Image;
  cropLength: Number;
  cropHeight: Number;
  cropRatio: Number;

  isHome: boolean = true;
  displayMasterAudioPlayer = false;

  displayKaraoke = false;
  displayUserAccountAccess = false;
  showRegisterTab = false;
  displayAudioPlayList = false;

  displayAddToPlaylist = false;
  displaySaveAsPlaylist = false;

  displayImageCropper = false;
  displayImageSelector = false;
  displayNotifications = false;

  songAudioForKaraoke: SongAudio;
  songAudioForAddtoPlaylist: SongAudio;

  songAudiosForSaveAsPlaylist: SongAudio[];
  @ViewChild(PictureSelectorComponent, { static: true })
  private pictureSelectorComponent: PictureSelectorComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private karaokeAudioPlayerService: KaraokeAudioPlayerService,
    private userAccountAccessService: UserAccountAccessService,
    private audioPlayListService: AudioPlayListService,
    private addToPlayListService: AddToPlayListService,
    private saveAsPlaylistService: SaveAsPlaylistService,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private imageCropperService: ImageCropperService,
    private imageSelectorService: ImageSelectorService,
    private userAuthService: UserAuthService,
    private displayNotificationService: DisplayNotificationService
  ) {}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.googleAnalyticsEventsService.sendPageView(event.urlAfterRedirects);
      } else {
        return;
      }
      this.scrollWindowToTop();
    });
    this.karaokeAudioPlayerService.requestToShowKaraokeAudioPlayer$.subscribe(
      (songAudio) => {
        this.showKaraoke(songAudio);
      }
    );

    this.addToPlayListService.requestToShowAddToPlaylist$.subscribe(
      (songAudio) => {
        this.songAudioForAddtoPlaylist = songAudio;
        this.displayAddToPlaylist = true;
      }
    );
    this.saveAsPlaylistService.requestToShowSaveAsPlaylist$.subscribe(
      (songAudios) => {
        this.songAudiosForSaveAsPlaylist = songAudios;
        this.displaySaveAsPlaylist = true;
      }
    );
    this.userAccountAccessService.onShowLogin$.subscribe(() => {
      this.displayUserAccountAccess = true;
      this.showRegisterTab = false;
    });

    this.userAccountAccessService.onShowRegister$.subscribe(() => {
      this.displayUserAccountAccess = true;
      this.showRegisterTab = true;
    });

    this.audioPlayListService.requestToShowAudioPlayList$.subscribe(() => {
      this.displayAudioPlayList = true;
    });

    this.imageCropperService.requestToShowImageCropper$.subscribe(
      (croppingRequest) => {
        this.imageForCrop = croppingRequest.image;
        this.cropHeight = croppingRequest.cropHeight;
        this.cropLength = croppingRequest.cropLength;
        this.cropRatio = croppingRequest.cropRatio;
        this.displayImageCropper = true;
      }
    );

    this.imageSelectorService.requestToShowImageSelector$.subscribe(
      (getExistingPictureService) => {
        this.pictureSelectorComponent.getExistingPictureService =
          getExistingPictureService;
        this.pictureSelectorComponent.loadExistingPictures();
        this.displayImageSelector = true;
      }
    );

    this.displayNotificationService.requestToShowNotifications$.subscribe(
      (positionX) => {
        this.notificationPositionX = positionX;
        this.displayNotifications = true;
      }
    );
  }
  showKaraoke(songAudio: SongAudio): void {
    this.songAudioForKaraoke = songAudio;
    this.displayKaraoke = true;
  }
  imageCropped(croppedImage: CroppedImage): void {
    this.imageCropperService.imageCropped(croppedImage);
  }
  imageSelected(selectedImage: SelectedImage): void {
    this.imageSelectorService.imageSelected(selectedImage);
  }
  scrollWindowToTop(): void {
    window.scrollTo(0, 0);
  }
  karaokeDisplayChanged(karaokeDisplayed: boolean): void {
    this.displayKaraoke = karaokeDisplayed;
    this.karaokeAudioPlayerService.karaokeAudioPlayerDisplayed(
      karaokeDisplayed
    );
  }
  onActivate(component: any): void {
    if (component.isHome) {
      this.isHome = true;
    } else this.isHome = false;
  }
}
