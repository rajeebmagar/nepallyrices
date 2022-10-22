import { environment } from "../../environments/environment";
import { OnDestroy } from "@angular/core/core";
import { UserAccountHeaderComponent } from "./user-account-header/user-account-header.component";
import { UserAccountTabs } from "./user-account-tabs";
import { PlayListService } from "../add-to-play-list/play-list.service";
import { UserProfile } from "../shared/entities/user-profile";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UserAccountFollowersFollowingComponent } from "./user-account-followers-following/user-account-followers-following.component";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { UserAccountService } from "app/user-account-services/user-account.service";

@Component({
  moduleId: module.id,
  selector: "nl-user-account",
  templateUrl: "./user-account.component.html",
  styleUrls: ["./user-account.component.css"],
  providers: [PlayListService],
})
export class UserAccountComponent implements OnInit, OnDestroy {
  userProfile: UserProfile;
  public inProgressSongURL: string;
  public userLikedSongURL: string;
  currentTabIndex = 0;
  overviewTabIndex = UserAccountTabs.overviewTabIndex;
  followingTabIndex = UserAccountTabs.followingTabIndex;
  followersTabIndex = UserAccountTabs.followersTabIndex;
  contributionTabIndex = UserAccountTabs.contributionTabIndex;
  tabIndex = UserAccountTabs;
  public canEdit = false;
  private parametersObservable: any;
  followersActivated = false;
  userName: string;
  @ViewChild(UserAccountHeaderComponent)
  private userAccountHeaderComponent: UserAccountHeaderComponent;

  // @ViewChild(UserAccountFollowersFollowingComponent)
  // private userFollowersComponent: UserAccountFollowersFollowingComponent;
  constructor(
    private route: ActivatedRoute,
    private userAccountService: UserAccountService,
    private authService: UserAuthService
  ) {}
  setFollowersActive(): void {
    this.followersActivated = true;
  }
  ngOnInit() {
    this.route.url.subscribe((segments) => {
      const lastSegment = segments[segments.length - 1];
      const tabPath = lastSegment.path.toLowerCase();
      switch (tabPath) {
        case "contributions": {
          this.currentTabIndex = 3;
          break;
        }
      }
    });
    this.parametersObservable = this.route.params.subscribe((params) => {
      this.canEdit = false;
      this.userName = params["userName"];
      let user = this.authService.getUser();
      this.inProgressSongURL = `${environment.API_ENDPOINT}/songs/${this.userName}/workinprogress?pageSize=5`; //used to show inprogress song widget
      this.userLikedSongURL = `${environment.API_ENDPOINT}/songs/${this.userName}/liked?pageSize=5`; //used to show songs liked by user
      this.userAccountService
        .getUserProfileByName(this.userName)
        .subscribe((profile) => {
          this.canEdit = this.authService.isOwnedByLoggedInUserByName(
            profile.userName
          );
          this.userProfile = profile;
        });
    });
    this.authService.userLoggedInEvent.subscribe((user) => {
      if (this.userProfile) {
        this.canEdit = this.authService.isOwnedByLoggedInUserByName(
          this.userProfile.userName
        );
      }
    });
  }
  tabIndexChanged(tabIndex: number): void {
    this.currentTabIndex = tabIndex;
  }
  showTab(index): void {
    this.userAccountHeaderComponent.setCurrentTabIndex(index);
  }

  // canFollow(): boolean {

  // }

  saveAboutMe(value) {
    this.userProfile.aboutMe = value;
    this.updateProfile();
  }
  saveHomeCountry(value) {
    this.userProfile.address.homeCountry = value;
    this.updateProfile();
  }
  saveProfileUpdate(value, field) {
    if (field) {
      this.userProfile[field] = value;
    }
    this.updateProfile();
  }
  updateProfile() {
    this.userAccountService.updateUserProfile(this.userProfile).subscribe(
      (data) => {},
      (error) => {
        try {
        } catch (err) {}
      }
    );
  }
  ngOnDestroy() {
    if (this.parametersObservable != null) {
      this.parametersObservable.unsubscribe();
    }
  }
  showFollowers() {
    this.currentTabIndex = this.followersTabIndex;
  }
  showFollowing() {
    this.currentTabIndex = this.followingTabIndex;
  }
}
