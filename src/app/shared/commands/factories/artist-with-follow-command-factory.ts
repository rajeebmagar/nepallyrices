import { Func } from "app/shared/data-strucutres/func";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { IntroViewCellQuickCommand } from "app/shared/commands/intro-view-cell-quick-command";
import { FollowArtistCommand } from "app/shared/commands/follow-artist-command";
import { ArtistService } from "app/artists/artist/artist.service";
import { Injectable } from "@angular/core";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";

@Injectable()
export class ArtistWithFollowCommandFactory
  implements Func<IntroViewContent, IntroViewCellQuickCommand>
{
  constructor(
    private artistService: ArtistService,
    private authService: UserAuthService,
    private UserAccountAccessService: UserAccountAccessService
  ) {}
  execute(introViewContent: IntroViewContent): IntroViewCellQuickCommand {
    let introViewCellQuickCommand = new IntroViewCellQuickCommand();
    introViewCellQuickCommand.command = new FollowArtistCommand(
      this.artistService,
      this.authService,
      this.UserAccountAccessService,
      introViewContent.artist.isFollowing
    );
    introViewCellQuickCommand.command.content = introViewContent;
    introViewCellQuickCommand.command.initialize();
    introViewCellQuickCommand.css = "fa fa-rss";
    introViewCellQuickCommand.cssForExecuted = "fa fa-check";
    return introViewCellQuickCommand;
  }
}
