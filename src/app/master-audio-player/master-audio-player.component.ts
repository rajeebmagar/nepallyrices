import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { SongAudio } from "app/shared-models/song-audio";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { KaraokeAudioPlayerService } from "app/shared/services/karaoke-audio-player.service";
import { AudioPlayListService } from "app/audio-play-list/audio-play-list.service";
import { SongService } from "app/shared-songs/song.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { SongLikeEventService } from "app/shared/services/song-like-event.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { Subscription } from "rxjs";

@Component({
  moduleId: module.id,
  selector: "nl-master-audio-player",
  templateUrl: "./master-audio-player.component.html",
  styleUrls: ["./master-audio-player.component.css"],
  animations: [
    trigger("displayMasterAudioPlayer", [
      transition("void => *", [
        style({ transform: "translateY(100%)" }),
        animate(100),
      ]),
      transition("* => void", [
        animate(100, style({ transform: "translateY(100%)" })),
      ]),
    ]),
  ],
})
export class MasterAudioPlayerComponent implements OnInit, OnDestroy {
  isEditable = false;
  isSongLiked = false;
  bufferedTime: number = 0;
  isSliding: boolean = false;
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 0;
  songLoop: boolean = false;
  playListLoop: boolean = false;
  playRandom: boolean = false;
  hasPrevious: boolean = false;
  hasNext: boolean = false;
  hasAudioToPlay: boolean = false;
  lyricKaraokeInDisplay: boolean = false;
  private subscribedToAudioService: boolean;
  private audioSourceChangeSubscription: Subscription;
  private audioPlayerTimeUpdateSubscription: Subscription;
  private audioPlayerCanPlaySubscription: Subscription;
  private audioPlayStateChangeSubscription: Subscription;
  private audioVolumeChangeSubscription: Subscription;
  private lyricKaraokeDisplayChangeSubscription: Subscription;
  private audioPlayListUpdatedSubscription: Subscription;
  private audioEndedSubscription: Subscription;
  private onBufferProgressSubscription: Subscription;
  private onLoopPlaylistChangedSubscription: Subscription;
  private onLoopSongChangedSubscription: Subscription;
  private onPlayRandomChangedSubscription: Subscription;

  constructor(
    private audioPlayerService: AudioPlayerService,
    private karaokeAudioPlayerService: KaraokeAudioPlayerService,
    private audioPlayListService: AudioPlayListService,
    private songService: SongService,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService,
    private songLikeEventService: SongLikeEventService
  ) {}

  private _songAudio: SongAudio;

  get songAudio(): SongAudio {
    return this._songAudio;
  }

  @Input()
  set songAudio(songAudio: SongAudio) {
    this._songAudio = songAudio;
    this.isEditable = this.authService.isEditable(songAudio);
    this.fetchSongLiked();
  }

  initializeAudioControlState() {
    this.currentTime = this.audioPlayerService.getAudioPlayer().currentTime;
    this.duration = this.audioPlayerService.duration;
  }

  ngOnInit(): void {
    this.volume = this.audioPlayerService.volume;
    this.initializeAudioControlState();
    this.subscribeToAudioPlayerService();
    this.songLikeEventService.onSongLiked$.subscribe((songId) => {
      if (songId === this.getSongId()) {
        this.isSongLiked = true;
      }
    });
    this.songLikeEventService.onSongUnLiked$.subscribe((songId) => {
      if (songId === this.getSongId()) {
        this.isSongLiked = false;
      }
    });
  }

  fetchSongLiked(): void {
    if (this.authService.isUserLoggedIn()) {
      this.setSongLikedFromAPI();
    }
    this.authService.userLoggedInEvent.subscribe((user) => {
      if (user) {
        this.setSongLikedFromAPI();
      } else {
        this.setSongLiked(false);
      }
    });
  }

  setSongLikedFromAPI(): void {
    this.songService.isLiked(this.getSongId()).subscribe((liked) => {
      this.setSongLiked(liked);
    });
  }

  likeSong(): void {
    if (!this.authService.isUserLoggedIn()) {
      this.userAccountAccessService.showLogin();
    } else {
      if (this.isSongLiked) {
        this.songService.unLikeSong(this.getSongId()).subscribe((response) => {
          this.setSongLiked(false);
        });
      } else {
        this.songService.likeSong(this.getSongId()).subscribe((response) => {
          this.setSongLiked(true);
        });
      }
    }
  }

  setSongLiked(liked: boolean): void {
    this.isSongLiked = liked;
    this.songLikeEventService.songLiked(liked, this.getSongId());
  }

  getSongId(): number {
    if (this.songAudio)
      return this.songAudio.song
        ? this.songAudio.song.songId
        : this.songAudio.songId;
    else return null;
  }

  onSongPlayedInChild(played: boolean): void {
    if (played) this.play();
    else this.pause();
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
    this.updateNavigationStates();
  }

  updateNavigationStates(): void {
    this.hasNext = this.audioPlayerService.hasNext();
    this.hasPrevious = this.audioPlayerService.hasPrevious();
  }

  playNext(): void {
    this.audioPlayerService.next();
    this.updateNavigationStates();
  }

  playPrevious(): void {
    this.audioPlayerService.previous();
    this.updateNavigationStates();
  }

  showAudioPlayList(): void {
    this.audioPlayListService.showAudioPlayList();
  }

  toggleLoopSong(): void {
    this.songLoop = !this.songLoop;
    this.audioPlayerService.setSongLoop(this.songLoop);
  }

  toggleLoopPlayList(): void {
    this.playListLoop = !this.playListLoop;
    this.audioPlayerService.setSongListLoop(this.playListLoop);
  }

  togglePlayRandom(): void {
    this.playRandom = !this.playRandom;
    this.audioPlayerService.setPlayRandom(this.playRandom);
  }

  sliding(isSliding: boolean): void {
    this.isSliding = isSliding;
  }

  seekAudioPlayerTo(seekToTime: number): void {
    this.sliding(false);
    this.currentTime = seekToTime;
    this.audioPlayerService.seekTo(seekToTime);
  }

  changeVolume(event: any): void {
    this.audioPlayerService.changeVolumeTo(Number(event.target.value));
  }

  subscribeToAudioPlayerService(): void {
    if (!this.subscribedToAudioService) {
      this.audioSourceChangeSubscription =
        this.audioPlayerService.onAudioSourceChange$.subscribe(
          (newSongAudio) => {
            this.songAudio = newSongAudio;
            this.hasAudioToPlay = true;
            this.initializeAudioControlState();
            this.updateNavigationStates();
          }
        );

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

      this.audioVolumeChangeSubscription =
        this.audioPlayerService.onVolumeChanged$.subscribe((volume) => {
          this.volume = volume;
        });

      this.lyricKaraokeDisplayChangeSubscription =
        this.karaokeAudioPlayerService.lyricKaraokeDisplayed$.subscribe(
          (displayed) => {
            this.setLyricKaraokeDisplay(displayed);
          }
        );

      this.audioPlayListUpdatedSubscription =
        this.audioPlayerService.onPlayListUpdated$.subscribe(() => {
          this.updateNavigationStates();
        });
      this.onBufferProgressSubscription =
        this.audioPlayerService.onBufferProgress$.subscribe((bufferedTime) => {
          this.bufferedTime = bufferedTime;
        });
      this.audioEndedSubscription =
        this.audioPlayerService.onPlayListPlayBackCompleted$.subscribe(() => {
          this.hasAudioToPlay = false;
        });

      this.onLoopPlaylistChangedSubscription =
        this.audioPlayerService.onLoopPlaylistChanged$.subscribe(
          (loopPlaylist) => {
            this.playListLoop = loopPlaylist;
          }
        );
      this.onLoopSongChangedSubscription =
        this.audioPlayerService.onLoopSongChanged$.subscribe((loopSong) => {
          this.songLoop = loopSong;
        });

      this.onPlayRandomChangedSubscription =
        this.audioPlayerService.onPlayRandomChanged$.subscribe((playRandom) => {
          this.playRandom = playRandom;
        });
      this.subscribedToAudioService = true;
    }
  }

  showKaraokePlayer() {
    this.karaokeAudioPlayerService.showKaraokeAudioPlayer(this.songAudio);
  }

  setLyricKaraokeDisplay(displayed: boolean): void {
    this.lyricKaraokeInDisplay = displayed;
  }

  ngOnDestroy(): void {
    //this.unSubscribeToAudioPlayerService();
  }

  unSubscribeToAudioPlayerService(): void {
    if (this.audioSourceChangeSubscription != null)
      this.audioSourceChangeSubscription.unsubscribe();
    if (this.audioPlayerTimeUpdateSubscription != null)
      this.audioPlayerTimeUpdateSubscription.unsubscribe();
    if (this.audioPlayerCanPlaySubscription != null)
      this.audioPlayerCanPlaySubscription.unsubscribe();
    if (this.audioPlayStateChangeSubscription)
      this.audioPlayStateChangeSubscription.unsubscribe();
    if (this.audioVolumeChangeSubscription)
      this.audioVolumeChangeSubscription.unsubscribe();
    if (this.lyricKaraokeDisplayChangeSubscription)
      this.lyricKaraokeDisplayChangeSubscription.unsubscribe();
    if (this.audioPlayListUpdatedSubscription)
      this.audioPlayListUpdatedSubscription.unsubscribe();
    if (this.audioEndedSubscription) this.audioEndedSubscription.unsubscribe();
  }
}
