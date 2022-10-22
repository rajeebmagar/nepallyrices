import { Injectable } from "@angular/core";
import { Func } from "app/shared/data-strucutres/func";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { Command } from "app/shared/commands/command";

import { PlayListService } from "app/add-to-play-list/play-list.service";
import { CommandExecuteNotificationService } from "app/shared/services/command-execute-notification.service";
import { SongIntroCommandsFactoryService } from "./song-intro-commands-factory.service";
import { RemoveFromPlayListCommand } from "app/shared/commands/remove-from-play-list-command";
@Injectable()
export class PlayListSongCommandsFactoryService
  implements Func<IntroViewContent, Command<IntroViewContent>[]>
{
  constructor(
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService,
    private playListService: PlayListService,
    private commandExecuteNotificationService: CommandExecuteNotificationService
  ) {}

  execute(introViewContent: IntroViewContent): Command<IntroViewContent>[] {
    let commands =
      this.songIntroCommandsFactoryService.execute(introViewContent);

    let removeFromPlayListCommand = new RemoveFromPlayListCommand(
      this.playListService,
      this.commandExecuteNotificationService
    );
    removeFromPlayListCommand.content = introViewContent;
    commands.unshift(removeFromPlayListCommand);
    return commands;
  }
}
