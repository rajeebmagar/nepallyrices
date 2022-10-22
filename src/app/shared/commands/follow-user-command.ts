import { Command } from "./command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { Observable } from "rxjs";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { UserAccountService } from "app/user-account-services/user-account.service";

export class FollowUserCommand implements Command<IntroViewContent> {
  showCommand: boolean = true;
  constructor(
    private userAccountService: UserAccountService,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService
  ) {}
  title: string = "Follow";
  executedTitle: string = "Unfollow";
  content: IntroViewContent;
  isExecuted: boolean;

  initialize(): void {
    // TODO: get user from auth service]

    if (this.authService.isUserLoggedIn()) {
      let user = this.authService.getUser();
      if (user && user.userName === this.content.urlFriendlyId) {
        this.showCommand = false;
      }
      this.setFollowing();
    }
    this.authService.userLoggedInEvent.subscribe((user) => {
      if (user) {
        this.setFollowing();
      } else {
        this.isExecuted = false;
      }
    });
  }
  setFollowing() {
    this.userAccountService
      .following(this.content.id)
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
    this.userAccountService
      .followUser(this.content.id)
      .subscribe((response) => {
        this.isExecuted = true;
      });
  }
  unFollow() {
    this.userAccountService
      .unFollowUser(this.content.id)
      .subscribe((response) => {
        this.isExecuted = false;
      });
  }
}
