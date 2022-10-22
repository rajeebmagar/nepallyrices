import { ArtistService } from "app/artists/artist/artist.service";
import { Command } from "./command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { Observable } from "rxjs";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";

export class FollowArtistCommand implements Command<IntroViewContent> {
  showCommand: boolean = true;
  constructor(
    private artistService: ArtistService,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService,
    isFollowedByUser: boolean
  ) {
    this.isExecuted = isFollowedByUser;
  }
  title: string = "Follow";
  executedTitle: string = "Unfollow";
  content: IntroViewContent;
  isExecuted: boolean;

  initialize(): void {
    this.authService.userLoggedInEvent.subscribe((user) => {
      if (user) {
        this.setFollowing();
      }
    });
  }
  setFollowing() {
    this.artistService
      .following(this.content.urlFriendlyId)
      .subscribe((following) => {
        this.isExecuted = following;
      });
  }
  execute(): void {
    if (this.authService.isUserLoggedIn()) {
      if (!this.isExecuted) {
        this.follow();
      } else {
        this.unFollow();
      }
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
  follow() {
    this.artistService.followArtist(this.content.id).subscribe((response) => {
      this.isExecuted = true;
    });
  }
  unFollow() {
    this.artistService.unFollowArtist(this.content.id).subscribe((response) => {
      this.isExecuted = false;
    });
  }
}
