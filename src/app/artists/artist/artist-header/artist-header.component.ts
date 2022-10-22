import {
  Component,
  OnInit,
  Input,
  Output,
  Inject,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { ArtistProfile } from "app/shared/entities/artist-profile";
import { SetArtistCoverPictureService } from "app/artists/artist/artist-header/set-artist-cover-picture.service";
import { SetArtistProfilePictureService } from "app/artists/artist/artist-header/set-artist-profile-picture.service";
import { Image } from "app/shared-models/image";
import { ArtistTabs } from "../artist-tabs";
import { ArtistService } from "app/artists/artist/artist.service";
import { FileUploadService } from "app/shared-module/services/file-upload.service";
import { environment } from "environments/environment";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { CoverPhotoHelper } from "app/shared/helpers/cover-photo-helper";
import { ProfilePhotoHelper } from "app/shared/helpers/profile-photo-helper";
import { GetArtistPicturesService } from "app/shared-artist-services/get-artist-pictures.service";
import { GoogleAnalyticsReportService } from "app/shared/services/google-analytics-report.service";
import { switchMap } from "rxjs/operators";
import { AuthService } from "app/identity/auth.service";
import { ImageSelectorService } from "app/shared-module/services/image-selector.service";
import { GetArtistCoverPicturesService } from "app/shared-artist-services/get-artist-cover-pictures.service";
@Component({
  selector: "nl-artist-header",
  templateUrl: "./artist-header.component.html",
  styleUrls: ["./artist-header.component.css"],
})
export class ArtistHeaderComponent implements OnInit {
  pageViewsCount: string;
  coverPictureUpdateInProgress: boolean;
  profilePictureUpdateInProgress: boolean;
  existingPictureEntityIds: string[];
  private _artistProfile: ArtistProfile;

  @Input() set artistProfile(artistProfile: ArtistProfile) {
    this._artistProfile = artistProfile;
    this.existingPictureEntityIds = [artistProfile.artistProfileId];
    this.resetState();
    this.coverPhotoPositionY = this.coverPhotoHelper.getYOffset(
      this.artistProfile.coverPhotoPositionY
    );
    this.currentCoverPhotoPositionY = this.coverPhotoPositionY;
    this.setPageViewCount(artistProfile.urlFriendlyName);
  }
  get artistProfile(): ArtistProfile {
    return this._artistProfile;
  }
  @Input() isEditable: boolean;
  @Output() tabSelected = new EventEmitter<number>();
  @Output() followersChanged = new EventEmitter();

  following = false;
  currentTabIndex: number = 0;
  overviewTabIndex = ArtistTabs.overviewTabIndex;
  songsTabIndex = ArtistTabs.songsTabIndex;
  relatedArtistTabIndex = ArtistTabs.relatedArtistTabIndex;
  biographyTabIndex = ArtistTabs.biographyTabIndex;
  followersTabIndex = ArtistTabs.followersTabIndex;

  uploadedProfilePicture: Image;

  uploadedCoverPicture: Image;

  //image drag
  dragging = false;
  referenceY = 0;
  initialPositionY = 0;

  editingCoverPicture = false;
  coverPhotoPositionY = 0;
  currentCoverPhotoPositionY = 0;

  profileCropRatio = 0;
  profileCropWidth = 0;
  profileCropHeight = 0;

  coverCropRatio = 0;
  coverCropWidth = 0;
  coverCropHeight = 0;

  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private fileUploadService: FileUploadService,
    private ref: ChangeDetectorRef,
    private setArtistCoverPictureService: SetArtistCoverPictureService,
    private setArtistProfilePictureService: SetArtistProfilePictureService,
    private getArtistPicturesService: GetArtistPicturesService,
    private getArtistCoverPicturesService: GetArtistCoverPicturesService,
    public imageSelectorService: ImageSelectorService,
    private authService: AuthService,
    private userAuthService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService,
    public snackBar: MatSnackBar,
    private dailog: MatDialog,
    private coverPhotoHelper: CoverPhotoHelper,
    private profilePhotoHelper: ProfilePhotoHelper,
    private googleAnalyticsReportService: GoogleAnalyticsReportService
  ) {}

  setPageViewCount(urlFriendlyName: string): void {
    this.googleAnalyticsReportService
      .getArtistPageViewCount(urlFriendlyName)
      .subscribe((pageViewsCount) => {
        this.pageViewsCount = pageViewsCount;
      });
  }
  mouseDown(event: MouseEvent): void {
    this.dragging = true;
    this.referenceY = event.y;
    this.initialPositionY = this.currentCoverPhotoPositionY;
  }
  mouseUp(event: MouseEvent): void {
    this.dragging = false;
  }
  mouseMove(event: MouseEvent): void {
    if (this.dragging && this.editingCoverPicture) {
      let changeY = event.y - this.referenceY;
      this.currentCoverPhotoPositionY = changeY + this.initialPositionY;
      this.artistProfile.coverPhotoPositionY = changeY + this.initialPositionY;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }
  savingCoverPicture(saving: boolean) {
    this.editingCoverPicture = saving;
  }
  ngOnInit() {
    this.profileCropHeight = this.profilePhotoHelper.IMAGE_HEIGHT;
    this.profileCropWidth = this.profilePhotoHelper.IMAGE_WIDTH;
    this.profileCropRatio = this.profilePhotoHelper.getCropRatio();

    this.coverCropHeight = this.coverPhotoHelper.IMAGE_HEIGHT;
    this.coverCropWidth = this.coverPhotoHelper.IMAGE_WIDTH;
    this.coverCropRatio = this.coverPhotoHelper.getCropRatio();

    //cache
    if (this.userAuthService.isUserLoggedIn()) {
      this.route.params
        .pipe(
          switchMap((params: Params) =>
            this.artistService.following(params["urlFriendlyName"])
          )
        )
        .subscribe((following) => {
          this.following = following;
        });
    }
  }

  setCurrentTabIndex(tabIndex: number): void {
    this.currentTabIndex = tabIndex;
    this.tabSelected.next(tabIndex);
  }
  toggleFollowArtist() {
    if (this.following) this.unFollowArtist();
    else this.followArtist();
  }
  updateArtistName() {
    this.artistService
      .updateArtistName(
        this.artistProfile.artistProfileId,
        this.artistProfile.fullName
      )
      .subscribe((response) => {
        this.snackBar.open("artist name saved successfully.", "", {
          duration: 2000,
        });
      });
  }
  followArtist() {
    if (this.userAuthService.isUserLoggedIn()) {
      this.artistService
        .followArtist(this.artistProfile.artistProfileId)
        .subscribe((response) => {
          this.following = true;
          this.artistProfile.followersCount++;
          this.followersChanged.next();
        });
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
  unFollowArtist() {
    this.artistService
      .unFollowArtist(this.artistProfile.artistProfileId)
      .subscribe((response) => {
        this.following = false;
        this.artistProfile.followersCount--;
        this.followersChanged.next();
      });
  }

  profilePictureUploaded(profilePicture: Image) {
    //this.uploadedProfilePicture = profilePicture;
    //show cropper tool
    this.uploadedProfilePicture = profilePicture;
  }

  profilePictureSaved(saved: boolean) {
    if (saved) {
      this.artistProfile.profilePicture = this.uploadedProfilePicture;
    }
    this.uploadedProfilePicture = null;
  }

  coverPictureUploaded(coverPicture: Image) {
    this.uploadedCoverPicture = coverPicture;

    //initialize
    this.artistProfile.coverPhotoPositionY = 0;
  }
  repositionedSaved(repositioned: boolean) {
    if (!repositioned) {
      this.artistProfile.coverPhotoPositionY = this.coverPhotoPositionY;
    }
  }
  coverPictureSaved(saved: boolean) {
    if (saved) {
      this.artistProfile.coverPhoto = this.uploadedCoverPicture;
    } else {
      //reset to original position on cancel.
      this.artistProfile.coverPhotoPositionY = this.coverPhotoPositionY;
    }
    this.uploadedCoverPicture = null;
  }
  resetState(): void {
    this.uploadedCoverPicture = null;
    this.uploadedProfilePicture = null;

    this.editingCoverPicture = false;
    this.dragging = false;
  }
  profilePictureWorkInProgress(workInProgress: boolean): void {
    this.profilePictureUpdateInProgress = workInProgress;
  }
  coverPictureWorkInProgress(workInProgress: boolean): void {
    this.coverPictureUpdateInProgress = workInProgress;
  }
}
