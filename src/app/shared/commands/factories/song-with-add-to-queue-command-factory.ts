import { Func } from "app/shared/data-strucutres/func";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { IntroViewCellQuickCommand } from "app/shared/commands/intro-view-cell-quick-command";
import { AddToPlayingListCommand } from "app/shared/commands/add-to-playing-list-command";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { Injectable } from "@angular/core";
@Injectable()
export class SongWithAddToQueueCommandFactory
  implements Func<IntroViewContent, IntroViewCellQuickCommand>
{
  constructor(private audioPlayerService: AudioPlayerService) {}
  execute(introViewContent: IntroViewContent): IntroViewCellQuickCommand {
    let introViewCellQuickCommand = new IntroViewCellQuickCommand();
    introViewCellQuickCommand.command = new AddToPlayingListCommand(
      this.audioPlayerService
    );
    introViewCellQuickCommand.command.content = introViewContent;
    introViewCellQuickCommand.command.initialize();
    introViewCellQuickCommand.css = "fa fa-plus";
    introViewCellQuickCommand.cssForExecuted = "fa fa-check";
    return introViewCellQuickCommand;
  }
}
