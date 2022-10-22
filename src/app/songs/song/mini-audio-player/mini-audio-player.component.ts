import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { SongAudio } from "app/shared-models/song-audio";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { Subscription } from "rxjs";
import { KaraokeAudioPlayerService } from "app/shared/services/karaoke-audio-player.service";
import { AddToPlayListCommand } from "app/shared/commands/add-to-play-list-command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { AddToPlayListService } from "app/add-to-play-list/add-to-play-list.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
@Component({
  selector: "nl-mini-audio-player",
  templateUrl: "./mini-audio-player.component.html",
  styleUrls: ["./mini-audio-player.component.css"],
})
export class MiniAudioPlayerComponent implements OnInit, OnDestroy {
  private _songAudio: SongAudio;
  @Input() set songAudio(songAudio: SongAudio) {
    this._songAudio = songAudio;
    this.isEditable = this.authService.isEditable(songAudio);
  }
  get songAudio(): SongAudio {
    return this._songAudio;
  }
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  bufferedTime: number = 0;
  isInQueue: boolean = false;
  isSliding: boolean = false;
  isEditable: boolean = false;
  private subscribedToAudioPlayerService: boolean;

  private audioSourceChangeSubscription: Subscription;
  private audioPlayerTimeUpdateSubscription: Subscription;
  private audioPlayerCanPlaySubscription: Subscription;
  private audioPlayStateChangeSubscription: Subscription;
  private audioPlayBackCompletedSubscription: Subscription;
  private onPlayListUpdatedSubscription: Subscription;
  private onBufferProgressSubscription: Subscription;

  constructor(
    private audioPlayerService: AudioPlayerService,
    private karaokeAudioPlayerService: KaraokeAudioPlayerService,
    private addToPlayListService: AddToPlayListService,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService
  ) {}

  ngOnInit(): void {
    this.updateIsInQueue();
    this.subscribeForAudioSourceChangeEvent();
    if (this.audioPlayerService.isCurrentAudioEquals(this.songAudio)) {
      this.onAudioPlaying();
    }
  }
  addToPlayList(): void {
    if (this.authService.isUserLoggedIn()) {
      this.addToPlayListService.showAddToPlaylist(this.songAudio);
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
  sliding(isSliding: boolean): void {
    this.isSliding = isSliding;
  }
  getPercentByDuration(value: number): number {
    if (this.duration > 0) return (value / this.duration) * 100;
    return 0;
  }
  updateIsInQueue(): void {
    this.isInQueue = this.audioPlayerService.isInQueue(this.songAudio);
  }
  subscribeForAudioSourceChangeEvent() {
    this.audioSourceChangeSubscription =
      this.audioPlayerService.onAudioSourceChange$.subscribe((newSongAudio) => {
        if (newSongAudio.id != this.songAudio.id) {
          this.resetPlayerControls();
        } else {
          this.onAudioPlaying();
        }
      });
    this.onPlayListUpdatedSubscription =
      this.audioPlayerService.onPlayListUpdated$.subscribe(() => {
        this.updateIsInQueue();
      });
  }
  onAudioPlaying(): void {
    this.isPlaying = this.audioPlayerService.isPlaying;
    this.currentTime = this.audioPlayerService.getAudioPlayer().currentTime;
    this.duration = this.audioPlayerService.duration;
    this.subscribeToAudioPlayerService();
  }

  showKaraokePlayer(): void {
    this.karaokeAudioPlayerService.showKaraokeAudioPlayer(this.songAudio);
  }
  isAudioSourceSetToCurrent() {
    return this.audioPlayerService.isCurrentAudioEquals(this.songAudio);
  }
  onPlayStateChanged(): void {
    if (this.isPlaying) this.pause();
    else this.play();
  }
  pause(): void {
    this.isPlaying = false;
    this.audioPlayerService.pause();
  }
  play(): void {
    this.isPlaying = true;
    this.audioPlayerService.play(this.songAudio);
    this.subscribeToAudioPlayerService();
  }
  addToQueue(): void {
    if (this.audioPlayerService.isEmptyPlayList()) {
      this.play();
    } else {
      this.audioPlayerService.addToQueue(this.songAudio);
    }
  }
  seekAudioPlayerTo(seekTime: number): void {
    this.sliding(false);
    this.audioPlayerService.seekTo(seekTime);
  }
  subscribeToAudioPlayerService(): void {
    if (!this.subscribedToAudioPlayerService) {
      this.audioPlayerTimeUpdateSubscription =
        this.audioPlayerService.onTimeUpdate$.subscribe((audioPlayer) => {
          if (!this.isSliding) this.currentTime = audioPlayer.currentTime;
        });

      this.audioPlayerCanPlaySubscription =
        this.audioPlayerService.onCanPlay$.subscribe((audioPlayer) => {
          this.duration = audioPlayer.duration;
        });

      this.audioPlayStateChangeSubscription =
        this.audioPlayerService.onPlayStateChanged$.subscribe((isPlaying) => {
          this.isPlaying = isPlaying;
        });
      this.audioPlayBackCompletedSubscription =
        this.audioPlayerService.onAudioPlayBackCompleted$.subscribe(
          (songAudio) => {
            if (songAudio.id == this.songAudio.id) {
              this.resetPlayerControls();
            }
          }
        );

      this.onBufferProgressSubscription =
        this.audioPlayerService.onBufferProgress$.subscribe((bufferedTime) => {
          this.bufferedTime = bufferedTime;
        });
      this.subscribedToAudioPlayerService = true;
    }
  }
  resetPlayerControls(): void {
    this.isPlaying = false;
    this.currentTime = 0;
    this.unSubscribeToAudioPlayerService();
  }
  ngOnDestroy(): void {
    this.unSubscribeToAudioPlayerService();
    if (this.audioSourceChangeSubscription != null)
      this.audioSourceChangeSubscription.unsubscribe();
    if (this.onPlayListUpdatedSubscription != null)
      this.onPlayListUpdatedSubscription.unsubscribe();
  }
  unSubscribeToAudioPlayerService(): void {
    this.subscribedToAudioPlayerService = false;
    if (this.audioPlayerTimeUpdateSubscription != null)
      this.audioPlayerTimeUpdateSubscription.unsubscribe();
    if (this.audioPlayerCanPlaySubscription != null)
      this.audioPlayerCanPlaySubscription.unsubscribe();
    if (this.audioPlayStateChangeSubscription)
      this.audioPlayStateChangeSubscription.unsubscribe();
    if (this.audioPlayBackCompletedSubscription)
      this.audioPlayBackCompletedSubscription.unsubscribe();
    if (this.onBufferProgressSubscription)
      this.onBufferProgressSubscription.unsubscribe();
  }
}
