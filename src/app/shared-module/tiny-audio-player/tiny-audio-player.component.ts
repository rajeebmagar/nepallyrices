import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
} from "@angular/core";
import { SongAudio } from "app/shared-models/song-audio";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { Subscription } from "rxjs";
@Component({
  selector: "nl-tiny-audio-player",
  templateUrl: "./tiny-audio-player.component.html",
  styleUrls: ["./tiny-audio-player.component.css"],
})
export class TinyAudioPlayerComponent implements OnInit, OnDestroy {
  @Input() songAudio: SongAudio;
  @Output() playStateChange = new EventEmitter<boolean>();
  isPlaying = false;
  subscribedToAudioPlayerService = false;
  private audioPlayBackCompletedSubscription: Subscription;
  private onPlayStateChangedSubscription: Subscription;

  constructor(private audioPlayerService: AudioPlayerService) {}

  ngOnInit() {
    this.setInitialPlayState();
    this.subscribeToAudioPlayerEvents();
  }
  setInitialPlayState() {
    if (
      this.audioPlayerService.isCurrentAudioEquals(this.songAudio) &&
      this.audioPlayerService.isPlaying
    ) {
      this.setPlayingState(true);
    }
  }
  togglePlay(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isPlaying) {
      this.play();
    } else {
      this.pause();
    }
  }
  play(): void {
    this.audioPlayerService.play(this.songAudio);
  }
  pause(): void {
    this.audioPlayerService.pause();
  }
  subscribeToAudioPlayerEvents(): void {
    this.audioPlayBackCompletedSubscription =
      this.audioPlayerService.onAudioPlayBackCompleted$.subscribe(
        (songAudio) => {
          if (this.songAudio.id == songAudio.id) {
            this.setPlayingState(false);
          }
        }
      );
    this.onPlayStateChangedSubscription =
      this.audioPlayerService.onPlayStateChanged$.subscribe((isPlaying) => {
        if (this.audioPlayerService.isCurrentAudioEquals(this.songAudio)) {
          this.setPlayingState(isPlaying);
        } else {
          this.setPlayingState(false);
        }
      });
  }
  setPlayingState(isPlaying: boolean): void {
    this.isPlaying = isPlaying;
    this.playStateChange.next(isPlaying);
    //this.triggerAngularChangeEvent();
  }
  ngOnDestroy() {
    this.unSubscribeToAudioPlayerEvents();
  }
  unSubscribeToAudioPlayerEvents(): void {
    if (this.audioPlayBackCompletedSubscription)
      this.audioPlayBackCompletedSubscription.unsubscribe();
    if (this.onPlayStateChangedSubscription)
      this.onPlayStateChangedSubscription.unsubscribe();
  }
}
