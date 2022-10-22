import { Injectable } from "@angular/core";
import { Func } from "app/shared/data-strucutres/func";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { Command } from "app/shared/commands/command";
import { FacebookShareCommand } from "app/shared/commands/facebook-share-command";
import { TwitterShareCommand } from "app/shared/commands/twitter-share-command";
import { GooglePlusShareCommand } from "app/shared/commands/google-plus-share-command";

import { ShareButtonsService } from "app/shared/modules/service/share-buttons.service";
import { WindowService } from "app/shared/modules/service/window.service";
import { UrlHelper } from "app/shared/url-helper";
@Injectable()
export class SocialShareCommandsFactoryService
  implements Func<IntroViewContent, Command<IntroViewContent>[]>
{
  constructor(
    private sbService: ShareButtonsService,
    private windowService: WindowService,
    private urlHelper: UrlHelper
  ) {}

  execute(introViewContent: IntroViewContent): Command<IntroViewContent>[] {
    let optionCommands: Command<IntroViewContent>[] = [];

    let facebookShareCommand = new FacebookShareCommand(
      this.sbService,
      this.windowService,
      this.urlHelper
    );
    facebookShareCommand.content = introViewContent;

    let twitterShareCommand = new TwitterShareCommand(
      this.sbService,
      this.windowService,
      this.urlHelper
    );
    twitterShareCommand.content = introViewContent;

    let googlePlusShareCommand = new GooglePlusShareCommand(
      this.sbService,
      this.windowService,
      this.urlHelper
    );
    googlePlusShareCommand.content = introViewContent;

    optionCommands.push(facebookShareCommand);
    optionCommands.push(twitterShareCommand);
    optionCommands.push(googlePlusShareCommand);

    return optionCommands;
  }
}
