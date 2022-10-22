import { Command } from "./command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { AddToPlayListService } from "app/add-to-play-list/add-to-play-list.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
export class AddToPlayListCommand implements Command<IntroViewContent> {
  showCommand: boolean = true;

  constructor(
    private addToPlayListService: AddToPlayListService,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService
  ) {}

  content: IntroViewContent;
  title: string = "Add To Playlist";
  executedTitle: string = "";
  isExecuted: boolean;
  initialize() {}
  execute(): void {
    if (this.authService.isUserLoggedIn()) {
      this.addToPlayListService.showAddToPlaylist(this.content.songAudio);
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
}
