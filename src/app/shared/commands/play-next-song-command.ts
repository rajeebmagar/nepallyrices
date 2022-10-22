import { Command } from "./command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { AudioPlayerService } from "app/shared/services/audio-player.service";

export class PlayNextSongCommand implements Command<IntroViewContent> {
  showCommand: boolean = true;
  constructor(private audioPlayerService: AudioPlayerService) {
    this.audioPlayerService.onAudioPlayBackCompleted$.subscribe((songAudio) => {
      if (songAudio.id == this.content.songAudio.id) {
        this.initialize();
      }
    });
    this.audioPlayerService.onPlayListPlayBackCompleted$.subscribe(() => {
      this.initialize();
    });
    this.audioPlayerService.onSongAudioQueued$.subscribe((songAudio) => {
      if (songAudio.id == this.content.songAudio.id) {
        this.initialize();
      }
    });
    this.audioPlayerService.onSongAudioRemovedFromQueue$.subscribe(
      (songAudio) => {
        if (songAudio.id == this.content.songAudio.id) {
          this.initialize();
        }
      }
    );
  }
  content: IntroViewContent;
  title: string = "Play Next";
  executedTitle: string = "";
  isExecuted: boolean;
  initialize() {
    this.isExecuted = this.audioPlayerService.isInQueue(this.content.songAudio);
  }
  execute(): void {
    this.audioPlayerService.addToQueueToPlayNext(this.content.songAudio);
    this.initialize();
  }
}
