import { Injectable } from "@angular/core";
import { Func } from "app/shared/data-strucutres/func";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { Command } from "app/shared/commands/command";
import { RemoveFromPlayingListCommand } from "app/shared/commands/remove-from-playing-list-command";
import { AddToPlayListCommand } from "app/shared/commands/add-to-play-list-command";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { SocialShareCommandsFactoryService } from "app/shared/commands/factories/social-share-commands-factory.service";
import { AddToPlayListService } from "app/add-to-play-list/add-to-play-list.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
@Injectable()
export class SongPlayListCommandsFactoryService
  implements Func<IntroViewContent, Command<IntroViewContent>[]>
{
  constructor(
    private socialShareCommandsFactoryService: SocialShareCommandsFactoryService,
    private audioPlayerService: AudioPlayerService,
    private addToPlayListService: AddToPlayListService,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService
  ) {}

  execute(introViewContent: IntroViewContent): Command<IntroViewContent>[] {
    let optionCommands: Command<IntroViewContent>[] =
      this.socialShareCommandsFactoryService.execute(introViewContent);

    let addToPlayListCommand = new AddToPlayListCommand(
      this.addToPlayListService,
      this.authService,
      this.userAccountAccessService
    );
    addToPlayListCommand.content = introViewContent;
    optionCommands.unshift(addToPlayListCommand);

    let removeFromPlayingListCommand = new RemoveFromPlayingListCommand(
      this.audioPlayerService
    );
    removeFromPlayingListCommand.content = introViewContent;
    optionCommands.unshift(removeFromPlayingListCommand); //adds to front
    return optionCommands;
  }
}
