import { Command } from "./command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { AudioPlayerService } from "app/shared/services/audio-player.service";

export class RemoveFromPlayingListCommand implements Command<IntroViewContent> {
  showCommand: boolean = true;
  constructor(private audioPlayerService: AudioPlayerService) {}
  content: IntroViewContent;
  title: string = "Remove From Playlist";
  executedTitle: string = "";
  isExecuted: boolean;
  initialize() {}
  execute(): void {
    this.audioPlayerService.removeFromQueue(this.content.songAudio);
  }
}
