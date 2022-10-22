import { Injectable } from "@angular/core";
import { Func } from "app/shared/data-strucutres/func";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { Command } from "app/shared/commands/command";
import { SocialShareCommandsFactoryService } from "app/shared/commands/factories/social-share-commands-factory.service";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { PlayNextSongCommand } from "app/shared/commands/play-next-song-command";
import { AddToPlayListCommand } from "app/shared/commands/add-to-play-list-command";
import { AddToPlayListService } from "app/add-to-play-list/add-to-play-list.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
@Injectable()
export class SongIntroCommandsFactoryService
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

    let playNextSongCommand = new PlayNextSongCommand(this.audioPlayerService);
    playNextSongCommand.content = introViewContent;
    optionCommands.unshift(playNextSongCommand);

    return optionCommands;
  }
}
