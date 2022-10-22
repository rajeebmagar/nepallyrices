import { Func } from "app/shared/data-strucutres/func";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { IntroViewCellQuickCommand } from "app/shared/commands/intro-view-cell-quick-command";
import { Injectable } from "@angular/core";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { FollowUserCommand } from "app/shared/commands/follow-user-command";
import { UserAccountService } from "app/user-account-services/user-account.service";

@Injectable()
export class UserWithFollowCommandFactory
  implements Func<IntroViewContent, IntroViewCellQuickCommand>
{
  constructor(
    private userAccountService: UserAccountService,
    private authService: UserAuthService,
    private UserAccountAccessService: UserAccountAccessService
  ) {}
  execute(introViewContent: IntroViewContent): IntroViewCellQuickCommand {
    let introViewCellQuickCommand = new IntroViewCellQuickCommand();
    introViewCellQuickCommand.command = new FollowUserCommand(
      this.userAccountService,
      this.authService,
      this.UserAccountAccessService
    );
    introViewCellQuickCommand.command.content = introViewContent;
    introViewCellQuickCommand.command.initialize();
    introViewCellQuickCommand.css = "fa fa-rss";
    introViewCellQuickCommand.cssForExecuted = "fa fa-check";
    return introViewCellQuickCommand;
  }
}
