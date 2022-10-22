import { UserIntro } from "../../shared-models/user-intro";
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  AfterContentInit,
  ChangeDetectorRef,
} from "@angular/core";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { ArtistService } from "app/artists/artist/artist.service";
import { UserProfile } from "app/shared/entities/user-profile";
import { Subscription } from "rxjs";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { UserAccountService } from "app/user-account-services/user-account.service";
import { UserFollowChangeEventService } from "app/user-account-services/user-follow-change-event.service";

@Component({
  selector: "nl-user-account-follower",
  templateUrl: "./user-account-follower.component.html",
  styleUrls: ["./user-account-follower.component.css"],
})
export class UserAccountFollowerComponent implements OnInit {
  _userProfile: UserProfile;
  thumbnailImageSize: any;

  @Input()
  relatedUser: UserIntro;

  @Input() set followersDisplayed(followersDisplayed: boolean) {
    this.thumbnailImageSize = this.thumbnailImage.nativeElement.offsetWidth;
  }

  @Input() set userProfile(userProfile: UserProfile) {
    this._userProfile = userProfile;
  }
  get userProfile(): UserProfile {
    return this._userProfile;
  }
  following = false;
  canFollow: boolean;

  @ViewChild("thumbnailImage", { static: true })
  thumbnailImage: ElementRef;

  private onFollowingUserAddedSubscription: Subscription;
  private onFollowingUserRemovedSubscription: Subscription;
  constructor(
    private authService: UserAuthService,
    private userAccountService: UserAccountService,
    private userAccountAccessService: UserAccountAccessService,
    private userFollowChangeEventService: UserFollowChangeEventService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.authService.isUserLoggedIn()) {
      this.fetchIsFollowing();
    }
    this.authService.userLoggedInEvent.subscribe((user) => {
      if (user) {
        this.fetchIsFollowing();
      } else {
        this.following = false;
      }
    });

    this.onFollowingUserAddedSubscription = this.userFollowChangeEventService
      .onFollowingUserAdded()
      .subscribe((userIntro) => {
        if (userIntro.userName == this.relatedUser.userName)
          this.following = true;
        //this.fetchIsFollowing();
      });
    this.onFollowingUserRemovedSubscription = this.userFollowChangeEventService
      .onFollowingUserRemoved()
      .subscribe((userIntro) => {
        if (userIntro.userName == this.relatedUser.userName)
          this.following = false;
      });
  }

  fetchIsFollowing(): void {
    this.canFollow = !this.authService.isOwnedByLoggedInUserByName(
      this.relatedUser.userName
    );
    if (this.canFollow) {
      this.userAccountService
        .following(this.relatedUser.id)
        .subscribe((following) => {
          this.following = following;
        });
    }
  }
  changeFollowing(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (this.authService.isUserLoggedIn()) {
      if (this.following) {
        this.unFollow();
      } else {
        this.follow();
      }
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
  follow(): void {
    if (this.authService.isUserLoggedIn()) {
      this.userAccountService
        .followUser(this.relatedUser.id)
        .subscribe((response) => {
          this.following = true;
          if (
            this.userProfile.userName == this.authService.getUser().userName
          ) {
            this.userProfile.followingCount++;
            this.userFollowChangeEventService.followingUserAdded(
              this.relatedUser
            );
          }
        });
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
  unFollow(): void {
    this.userAccountService
      .unFollowUser(this.relatedUser.id)
      .subscribe((response) => {
        this.following = false;
        if (this.userProfile.userName == this.authService.getUser().userName) {
          this.userProfile.followingCount--;
          this.userFollowChangeEventService.followingUserRemoved(
            this.relatedUser
          );
        }
      });
  }
}
