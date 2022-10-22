import { Command } from "./command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { PlayListService } from "app/add-to-play-list/play-list.service";
import { CommandExecuteNotificationService } from "app/shared/services/command-execute-notification.service";
export class RemoveFromPlayListCommand implements Command<IntroViewContent> {
  showCommand: boolean = true;
  content: IntroViewContent;
  title: string = "Remove From Playlist";
  executedTitle: string = "";
  isExecuted: boolean;

  constructor(
    private playListService: PlayListService,
    private commandExecuteNotificationService: CommandExecuteNotificationService
  ) {}
  initialize() {}
  execute(): void {
    this.playListService
      .removeSongAudioFromPlaylistWithId(
        this.content.parentId,
        this.content.songAudio.id
      )
      .subscribe((response) => {
        this.commandExecuteNotificationService.executed(this.content);
      });
  }
}
