import { UserProfile } from "../../shared/entities/user-profile";
import { Component, OnInit, Input } from "@angular/core";
import { UserIntro } from "app/shared-models/user-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { PaginationService } from "app/shared/services/pagination.service";
import { environment } from "environments/environment";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { Subscription } from "rxjs";
import { UserFollowChangeEventService } from "app/user-account-services/user-follow-change-event.service";

@Component({
  selector: "nl-user-account-followers-following",
  templateUrl: "./user-account-followers-following.component.html",
  styleUrls: ["./user-account-followers-following.component.css"],
})
export class UserAccountFollowersFollowingComponent implements OnInit {
  followersDisplayed: boolean;

  _userProfile: UserProfile;

  @Input() set followersActivated(followersActivated: boolean) {
    if (followersActivated && !this.pagedFollowers) {
      this.loadUserFollowers(this.type);
    }
  }

  @Input()
  public type: string;
  @Input()
  set userProfile(userProfile: UserProfile) {
    this._userProfile = userProfile;
  }
  get userProfile(): UserProfile {
    return this._userProfile;
  }

  hasMore = false;
  pagedFollowers: PagedResponse<UserIntro>;
  followers: UserIntro[];
  private apiUrl: string;
  private onFollowingUserAddedSubscription: Subscription;
  private onFollowingUserRemovedSubscription: Subscription;
  constructor(
    private paginationService: PaginationService,
    private userFollowChangeEventService: UserFollowChangeEventService,
    private authService: UserAuthService
  ) {}

  ngOnInit() {
    this.onFollowingUserAddedSubscription = this.userFollowChangeEventService
      .onFollowingUserAdded()
      .subscribe((userIntro) => {
        //this.loadUserFollowers(this.type);
        this.addUser(userIntro);
      });
    this.onFollowingUserRemovedSubscription = this.userFollowChangeEventService
      .onFollowingUserRemoved()
      .subscribe((userIntro) => {
        //this.loadUserFollowers(this.type);
        this.removeUser(userIntro);
      });
  }
  removeUser(userIntro: UserIntro): void {
    if (
      (this.userProfile.userName == this.authService.getUser().userName &&
        this.type == "userFollowing") ||
      (this.authService.getUser().userName == userIntro.userName &&
        this.type == "followers")
    ) {
      var index = -1;
      this.followers.filter((user, k) => {
        if (user.userName === userIntro.userName) {
          index = k;
        }
      });
      if (index > -1) {
        this.followers.splice(index, 1);
      }
    } else if (
      this.authService.getUser().userName != userIntro.userName &&
      this.type == "followers"
    ) {
      //update following/follow flag
      var user = this.followers.filter((user, k) => {
        user.userName === userIntro.userName;
      });
    }
  }
  addUser(userIntro: UserIntro): void {
    if (
      (this.userProfile.userName == this.authService.getUser().userName &&
        this.type == "userFollowing") ||
      (this.authService.getUser().userName == userIntro.userName &&
        this.type == "followers")
    ) {
      this.followers.push(userIntro);
    }
  }
  resetFollowers(): void {
    this.followers = [];
    this.pagedFollowers = null;
  }

  loadUserFollowers(_type: string): void {
    this.type = _type;
    this.resetFollowers();
    switch (_type) {
      case "followers":
        this.apiUrl = `${environment.API_ENDPOINT}/users/${this.userProfile.userProfileId}/followers?pageSize=8`;
        break;
      case "userFollowing":
        this.apiUrl = `${environment.API_ENDPOINT}/users/${this.userProfile.userProfileId}/following/users?pageSize=8`;
        break;
      case "artistFollowing":
        this.apiUrl = `${environment.API_ENDPOINT}/users/${this.userProfile.userProfileId}/following/artists?pageSize=8`;
        break;
    }

    this.loadUserFollowersWithUrl(this.apiUrl);
  }
  loadUserFollowersWithUrl(userFollowersAPI: string): void {
    this.paginationService
      .getNextPageResponse<UserIntro>(userFollowersAPI)
      .subscribe((pagedFollowers) => {
        this.pagedFollowers = pagedFollowers;
        this.addFollowersFromPagedResponse();
        this.hasMore = this.paginationService.hasNext(pagedFollowers.links);
        this.followersDisplayed = true;
      });
  }
  addFollowersFromPagedResponse(): void {
    let newFollowers = new Array<UserIntro>();
    if (this.followers) newFollowers = newFollowers.concat(this.followers);
    for (let follower of this.pagedFollowers.items) {
      newFollowers.push(follower);
    }
    this.followers = null;
    this.followers = newFollowers;
  }
  getMoreFollowers() {
    let nextPageFollowersUrl = this.paginationService.getNextPageUrl(
      this.pagedFollowers.links
    );
    if (nextPageFollowersUrl) {
      this.loadUserFollowersWithUrl(nextPageFollowersUrl);
    }
  }
}
