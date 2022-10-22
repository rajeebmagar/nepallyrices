import { UserIntro } from "../../shared-models/user-intro";
import { UserAccountTabs } from "../user-account-tabs";
import { UserProfile } from "../../shared/entities/user-profile";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Image } from "app/shared-models/image";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { CoverPhotoHelper } from "app/shared/helpers/cover-photo-helper";
import { ProfilePhotoHelper } from "app/shared/helpers/profile-photo-helper";
import { SetUserAccountProfilePictureService } from "app/user-account-services/set-user-account-profile-picture.service";
import { SetUserAccountCoverPictureService } from "app/user-account-services/set-user-account-cover-picture.service";
import { UserAccountService } from "app/user-account-services/user-account.service";
import { UserFollowChangeEventService } from "app/user-account-services/user-follow-change-event.service";
import { GetUserCoverPicturesService } from "app/user-account-services/get-user-cover-pictures.service";
import { GetUserProfilePicturesService } from "app/user-account-services/get-user-profile-pictures.service";
import { ImageSelectorService } from "app/shared-module/services/image-selector.service";

@Component({
  selector: "nl-user-account-header",
  templateUrl: "./user-account-header.component.html",
  styleUrls: ["./user-account-header.component.css"],
})
export class UserAccountHeaderComponent implements OnInit {
  coverPictureUpdateInProgress: boolean;
  profilePictureUpdateInProgress: boolean;
  existingPictureEntityIds: string[];
  private _userProfile: UserProfile;
  @Input() set userProfile(userProfile: UserProfile) {
    this._userProfile = userProfile;
    this.existingPictureEntityIds = [userProfile.userProfileId];
    this.resetState();
    this.profileUpdated();
    this.coverPhotoPositionY = this.coverPhotoHelper.getYOffset(
      this.userProfile.coverPhotoPositionY
    );
    this.currentCoverPhotoPositionY = this.coverPhotoPositionY;
  }
  get userProfile(): UserProfile {
    return this._userProfile;
  }
  private _canEdit: boolean;
  @Input() set canEdit(canEdit: boolean) {
    this.canFollow = !canEdit;
    this._canEdit = canEdit;
  }
  get canEdit(): boolean {
    return this._canEdit;
  }
  @Output() tabSelected = new EventEmitter<number>();
  following = false;
  isEditor = false;
  canMakeEditor = false;
  canFollow: boolean;
  currentTabIndex: number = 0;
  overviewTabIndex = UserAccountTabs.overviewTabIndex;
  followingTabIndex = UserAccountTabs.followingTabIndex;
  followersTabIndex = UserAccountTabs.followersTabIndex;
  contributionTabIndex = UserAccountTabs.contributionTabIndex;
  uploadedCoverPicture: Image;
  uploadedProfilePicture: Image;

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
    private route: ActivatedRoute,
    private setUserAccountProfilePictureService: SetUserAccountProfilePictureService,
    private setUserAccountCoverPictureService: SetUserAccountCoverPictureService,
    private userAccountService: UserAccountService,
    private authService: UserAuthService,
    private userFollowChangeEventService: UserFollowChangeEventService,
    private coverPhotoHelper: CoverPhotoHelper,
    private profilePhotoHelper: ProfilePhotoHelper,
    private getUserCoverPicturesService: GetUserCoverPicturesService,
    private getUserProfilePicturesService: GetUserProfilePicturesService,
    private imageSelectorService: ImageSelectorService
  ) {}
  ngOnInit() {
    this.profileCropHeight = this.profilePhotoHelper.IMAGE_HEIGHT;
    this.profileCropWidth = this.profilePhotoHelper.IMAGE_WIDTH;
    this.profileCropRatio = this.profilePhotoHelper.getCropRatio();

    this.coverCropHeight = this.coverPhotoHelper.IMAGE_HEIGHT;
    this.coverCropWidth = this.coverPhotoHelper.IMAGE_WIDTH;
    this.coverCropRatio = this.coverPhotoHelper.getCropRatio();
  }
  profileUpdated() {
    this.userAccountService
      .following(this.userProfile.userProfileId)
      .subscribe((following) => {
        this.following = following;
        //this.canMakeEditor = this.authService.isSuperAdmin() && this.authService.getUser().userName!=this.userProfile.userName;
        this.fetchIsEditor();
      });
  }
  fetchIsEditor() {
    this.userAccountService
      .isEditor(this.userProfile.userName)
      .subscribe((editor) => {
        this.isEditor = editor;
      });
  }
  setCurrentTabIndex(tabIndex: number): void {
    this.currentTabIndex = tabIndex;
    this.tabSelected.next(tabIndex);
  }
  coverPictureUploaded(coverPicture: Image) {
    this.uploadedCoverPicture = coverPicture;
    //initialize
    this.userProfile.coverPhotoPositionY = 0;
  }
  coverPictureSaved(saved: boolean) {
    if (saved) {
      this.userProfile.coverPhoto = this.uploadedCoverPicture;
    } else {
      //reset to original position on cancel.
      this.userProfile.coverPhotoPositionY = this.coverPhotoPositionY;
    }
    this.uploadedCoverPicture = null;
  }
  profilePictureUploaded(coverPicture: Image) {
    this.uploadedProfilePicture = coverPicture;
  }
  profilePictureSaved(saved: boolean) {
    if (saved) {
      this.userProfile.profilePicture = this.uploadedProfilePicture;
    }
    this.uploadedProfilePicture = null;
  }
  toggleFollowUser() {
    if (this.following) this.unFollowUser();
    else this.followUser();
  }
  toggleEditorRole() {
    if (this.isEditor) {
      this.removeAsEditor();
    } else {
      this.assignAsEditor();
    }
  }
  followUser() {
    this.userAccountService
      .followUser(this.userProfile.userProfileId)
      .subscribe((response) => {
        this.following = true;
        this.userProfile.followersCount++;
        this.getUserIntro().then((user) => {
          this.userFollowChangeEventService.followingUserAdded(user);
        });
      });
  }
  unFollowUser() {
    this.userAccountService
      .unFollowUser(this.userProfile.userProfileId)
      .subscribe((response) => {
        this.following = false;
        this.userProfile.followersCount--;
        this.getUserIntro().then((user) => {
          this.userFollowChangeEventService.followingUserRemoved(user);
        });
      });
  }
  assignAsEditor() {
    this.userAccountService
      .assignAsEditor(this.userProfile.userName)
      .subscribe((response) => {
        this.isEditor = true;
      });
  }
  removeAsEditor() {
    this.userAccountService
      .removeAsEditor(this.userProfile.userName)
      .subscribe((response) => {
        this.isEditor = false;
      });
  }
  getUserIntro(): any {
    var user = this.authService.getUser();
    return new Promise((resolve) => {
      this.userAccountService
        .getUserProfileByName(user.userName)
        .subscribe((profile) => {
          var usr = {
            id: profile.userProfileId,
            userName: profile.userName,
            fullName: profile.fullName,
            profilePicture: profile.profilePicture,
          };
          resolve(usr);
        });
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
      this.userProfile.coverPhotoPositionY = changeY + this.initialPositionY;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }
  savingCoverPicture(saving: boolean) {
    this.editingCoverPicture = saving;
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
