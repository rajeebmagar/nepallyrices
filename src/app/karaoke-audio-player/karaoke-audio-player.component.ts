import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  AfterContentInit,
  HostListener,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SongAudio } from "app/shared-models/song-audio";
import { Song } from "app/shared/entities/song";
import { LyricKaraokeLine } from "app/shared/entities/lyric-karaoke-line";
import { LyricKaraoke } from "app/shared/entities/lyric-karaoke";
import { LyricKaraokeLineService } from "./lyric-karaoke-line.service";
import { LyricKaraokeService } from "./lyric-karaoke.service";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";
import { AudioPlayListService } from "app/audio-play-list/audio-play-list.service";
import { SongService } from "app/shared-songs/song.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { SongLikeEventService } from "app/shared/services/song-like-event.service";
import { GoogleAnalyticsEventsService } from "app/shared/services/google-analytics-events.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { Image } from "app/shared-models/image";
import { GoogleAnalyticsReportService } from "app/shared/services/google-analytics-report.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { distinctUntilChanged } from "rxjs/operators";
import { GetArtistCoverPicturesService } from "app/shared-artist-services/get-artist-cover-pictures.service";
@Component({
  selector: "nl-karaoke-audio-player",
  templateUrl: "./karaoke-audio-player.component.html",
  providers: [LyricKaraokeLineService, LyricKaraokeService],
  styleUrls: ["./karaoke-audio-player.component.css"],
  animations: [
    trigger("displayKaraoke", [
      transition("void => *", [
        style({ transform: "translateY(-100%)" }),
        animate(100),
      ]),
      transition("* => void", [
        animate(100, style({ transform: "translateY(-100%)" })),
      ]),
    ]),
  ],
})
export class KaraokeAudioPlayerComponent
  implements OnInit, OnDestroy, AfterViewChecked, AfterContentInit
{
  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e) {
    this.setMouseMovingForAWhile();
  }

  @HostListener("document:touchmove", ["$event"])
  onTouchMove(e) {
    this.setMouseMovingForAWhile();
  }

  setMouseMovingForAWhile() {
    this.mouseMoving = true;
    setTimeout(() => {
      this.mouseMoving = false;
    }, 3000);
  }

  mouseMoving: boolean;
  _displayKaraoke: boolean;
  karaokePlayCount: string;

  @Input() set displayKaraoke(displayKaraoke: boolean) {
    this._displayKaraoke = displayKaraoke;
  }
  get displayKaraoke(): boolean {
    return this._displayKaraoke;
  }
  @Output() displayKaraokeChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Input()
  isLyricSynchronizing: boolean;

  private _songAudio: SongAudio;
  @Input()
  set songAudio(songAudio: SongAudio) {
    this._songAudio = songAudio;
    this.isEditable = this.authService.isEditable(songAudio);
    if (songAudio.song && songAudio.song.coverPhoto) {
      this.currentCoverImage = songAudio.song.coverPhoto;
      this.currentCoverImageIndex = -1;
    }
    this.fetchSongCoverPictures(songAudio);
    this.setKaraokePlayCounts(this.getSongUrlFriendlyTitle());
  }

  get songAudio(): SongAudio {
    return this._songAudio;
  }

  @Output()
  onSongPlayed = new EventEmitter<boolean>();

  isEditable = false;
  isSongLiked = false;
  lyricKaraoke: LyricKaraoke;
  lyricContaineer: HTMLElement;
  isPlaying: boolean = false;
  isIdle: boolean = true;
  activeLineInitialized: boolean = false;
  currentCoverImage: Image;
  currentCoverImageTime = 0;
  currentCoverImageIndex = -1;
  coverPictures: Image[];

  activeLineIndex: number = 0;
  activeLineId: string = "";

  bufferedTime: number = 0;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 0;
  coverPictureChangeCounter = 0;

  songLoop: boolean = false;
  playListLoop: boolean = false;
  playRandom: boolean = false;
  hasPrevious: boolean = false;
  hasNext: boolean = false;
  isSliding: boolean = false;

  private subscribedToAudioEvents: boolean;

  private audioSourceChangeSubscription: Subscription;
  private audioPlayerTimeUpdateSubscription: Subscription;
  private audioPlayerCanPlaySubscription: Subscription;
  private audioPlayerEndedSubscription: Subscription;
  private audioPlayerSeekedSubscription: Subscription;
  private audioPlayStateChangeSubscription: Subscription;
  private audioVolumeChangeSubscription: Subscription;
  private audioPlayListUpdatedSubscription: Subscription;
  private onBufferProgressSubscription: Subscription;

  pathGradient: string;
  pathMask: string;

  constructor(
    public snackBar: MatSnackBar,
    private lyricKaraokeService: LyricKaraokeService,
    private lyricKaraokeLineService: LyricKaraokeLineService,
    private audioPlayerService: AudioPlayerService,
    private location: Location,
    private audioPlayListService: AudioPlayListService,
    private songService: SongService,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService,
    private songLikeEventService: SongLikeEventService,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private getArtistCoverPicturesService: GetArtistCoverPicturesService,
    private googleAnalyticsReportService: GoogleAnalyticsReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pathGradient = `url(${this.location.path()}#lyricsContainerGradient)`;
    this.pathMask = `url(${this.location.path()}#lyricsContainerMask)`;
  }
  setKaraokePlayCounts(songUrlFriendlyTitle: string): void {
    this.googleAnalyticsReportService
      .getSongKaraokeViewCount(songUrlFriendlyTitle)
      .subscribe((count) => {
        this.karaokePlayCount = count;
      });
  }
  fetchSongCoverPictures(songAudio: SongAudio): void {
    if (songAudio.song) {
      let artistIds = [];
      if (songAudio.song.singers)
        artistIds = artistIds.concat(
          songAudio.song.singers.map((s) => s.artistId)
        );
      if (songAudio.song.coverSingers)
        artistIds = artistIds.concat(
          songAudio.song.coverSingers.map((s) => s.artistId)
        );
      if (songAudio.song.musicians)
        artistIds = artistIds.concat(
          songAudio.song.musicians.map((s) => s.artistId)
        );
      if (songAudio.song.lyricists)
        artistIds = artistIds.concat(
          songAudio.song.lyricists.map((s) => s.artistId)
        );

      this.getArtistCoverPicturesService.entityIds = artistIds;
      this.getArtistCoverPicturesService.get().subscribe((pagedImages) => {
        this.coverPictures = pagedImages.items;
        if (this.currentCoverImage && this.currentCoverImage.imageUrl) {
          this.coverPictures.push(this.currentCoverImage);
        }
      });
    }
  }
  showAudioPlayList(): void {
    this.audioPlayListService.showAudioPlayList();
  }
  setVolumeControlVariable(): void {
    this.volume = this.audioPlayerService.volume;
  }
  setAudioControlVariables(): void {
    this.isPlaying = this.audioPlayerService.isPlaying;
    this.duration = this.audioPlayerService.duration;
    this.currentTime = this.audioPlayerService.getAudioPlayer().currentTime;
  }
  isAudioSourceSetToCurrent(): boolean {
    return this.audioPlayerService.isCurrentAudioEquals(this.songAudio);
  }
  isSongAudioPlaying(): boolean {
    return (
      this.audioPlayerService.isPlaying && this.isAudioSourceSetToCurrent()
    );
  }
  ngAfterContentInit() {}
  ngOnInit(): void {
    console.log(this.route.snapshot.url.toString());
    this.router.events.subscribe((response) => {
      this.close(); //close popup when route params is changed
    });

    this.subscribeSongLikeEvents();
    this.fetchSongLiked();
    this.initializeAudioControlState();

    this.setVolumeControlVariable();

    if (this.isAudioSourceSetToCurrent()) this.setAudioControlVariables();

    if (this.isSongAudioPlaying()) {
      this.isIdle = false;
      this.subscribeToAudioPlayerService();
    }

    if (this.isLyricSynchronizing) {
      this.synchronizeKaraoke();
    } else {
      this.loadLyricKaraokeOfCurrentSong();
    }
    this.logKaraokeEventToGoogleAnalytics();
  }

  logKaraokeEventToGoogleAnalytics(): void {
    this.googleAnalyticsEventsService.emitEvent(
      "karaoke",
      "display",
      this.getSongUrlFriendlyTitle(),
      this.getSongId()
    );
  }
  subscribeSongLikeEvents() {
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
  loadLyricKaraokeOfCurrentSong() {
    if (this.songAudio.lyricKaraoke) {
      this.setLyricKaroke(this.songAudio.lyricKaraoke);
      this.highlightAndScrollWithCurrentPlayTime();
    } else {
      this.requestGetLyricKaraokeOfSongAudioAndSubscribe();
    }
  }
  initializeAudioControlState(): void {
    this.songLoop = this.audioPlayerService.loopSong;
    this.playListLoop = this.audioPlayerService.loopPlayList;
    this.playRandom = this.audioPlayerService.playRandom;
    this.updateNavigationStates();
  }
  requestGetLyricKaraokeOfSongAudioAndSubscribe() {
    this.lyricKaraokeService
      .getKaraokeByAudioId(this.songAudio.id)
      .subscribe((lyricKaraoke) => {
        this.onLyricKaraokeResponseArrived(lyricKaraoke);
      });
  }
  onLyricKaraokeResponseArrived(lyricKaraoke: LyricKaraoke): void {
    this.songAudio.lyricKaraoke = lyricKaraoke;
    this.setLyricKaroke(lyricKaraoke);
    this.highlightAndScrollWithCurrentPlayTime();
  }
  highlightAndScrollWithCurrentPlayTime() {
    this.setActiveLineWithCurrentPlayTime();
    if (this.lyricContaineer) this.scrollLyricContaineerToActiveLine();
  }
  createKarokeLinesFromSongLyricByLineSplit(): LyricKaraokeLine[] {
    let lyricKaraokeLines: LyricKaraokeLine[] = [];
    for (let line of this.songAudio.song.lyric.split("\n")) {
      if (line.trim().length > 0) {
        let lyricKaraokeLine = new LyricKaraokeLine();
        lyricKaraokeLine.lyricLine = line;
        lyricKaraokeLine.time = -1;
        lyricKaraokeLines.push(lyricKaraokeLine);
      }
    }
    return lyricKaraokeLines;
  }
  addNewLyricKaraokeOfSongAudioAndSubscribe(
    lyricKaraokeLines: LyricKaraokeLine[]
  ) {
    this.audioPlayerService.clearExcept(this.songAudio);
    this.lyricKaraokeService
      .addKaraokeOfAudioIdWithLines(this.songAudio.id, lyricKaraokeLines)
      .subscribe((newLyricKaroke) => {
        this.onNewLyricKarokeCreated(newLyricKaroke);
      });
  }
  onNewLyricKarokeCreated(newLyricKaroke: LyricKaraoke) {
    this.setLyricKaroke(newLyricKaroke); //for lyric sync
  }
  setLyricKaroke(lyricKaroke: LyricKaraoke) {
    this.lyricKaraoke = lyricKaroke;
  }
  synchronizeKaraoke(): void {
    this.isLyricSynchronizing = true;
    this.addNewLyricKaraokeOfSongAudioAndSubscribe(
      this.createKarokeLinesFromSongLyricByLineSplit()
    );
  }
  reSynchronizeKaraoke(): void {
    this.isLyricSynchronizing = true;
    this.addNewLyricKaraokeOfSongAudioAndSubscribe(
      this.lyricKaraoke.lyricKaraokeLines
    );
  }
  ngAfterViewChecked(): void {
    if (this.lyricContaineer == null)
      //as ngAfterViewChecked is called multiple times
      this.lyricContaineer = document.getElementById("lyric-container");
    this.scrollToActiveLineIfLineIsInDom();
  }
  scrollToActiveLineIfLineIsInDom(): void {
    var innerListItem = document.getElementById(this.activeLineId);
    if (innerListItem && !this.activeLineInitialized) {
      this.activeLineInitialized = true;
      this.scrollLyricContaineerToActiveLine();
    }
  }
  initializeAudioControls(): void {
    this.lyricContaineer = document.getElementById("lyric-container");
  }
  onKaraokeLineSelected(lyricKaraokeLine: LyricKaraokeLine): void {
    if (this.isSongAudioPlaying()) {
      if (this.isLyricSynchronizing) {
        this.onKaraokeLineSelectedWhileSyncInProcess(lyricKaraokeLine);
      } else {
        this.onKaraokeLineSelectedWhileListening(lyricKaraokeLine);
      }
    }
  }
  onKaraokeLineSelectedWhileSyncInProcess(
    lyricKaraokeLine: LyricKaraokeLine
  ): void {
    //update lyric line time with audio player time
    lyricKaraokeLine.time =
      this.audioPlayerService.getAudioPlayer().currentTime;
    this.setActiveLineId(lyricKaraokeLine.lyricKaraokeLineId);
    this.scrollLyricContaineerToActiveLine(); //lyric containeer will already be initialized as user clicked on initialized containeer
    this.lyricKaraokeLineService.updateKaraokeLine(lyricKaraokeLine);
  }
  onKaraokeLineSelectedWhileListening(
    lyricKaraokeLine: LyricKaraokeLine
  ): void {
    this.setActiveLineId(lyricKaraokeLine.lyricKaraokeLineId);
    this.setActiveLineIndexForActiveLine(lyricKaraokeLine);
    this.scrollLyricContaineerToActiveLine(); //lyric containeer will already be initialized as user clicked on initialized containeer
    this.audioPlayerService.seekTo(lyricKaraokeLine.time); //will get an event back from audio service onTimeUpdate which will update seek control position.
  }
  setActiveLineIndexForActiveLine(lyricKaraokeLine: LyricKaraokeLine): void {
    this.activeLineIndex =
      this.lyricKaraoke.lyricKaraokeLines.indexOf(lyricKaraokeLine);
  }
  removeLine(lyricKaraokeLine: LyricKaraokeLine): void {
    if (confirm("Are you sure you want to remove this line?")) {
      const index = this.lyricKaraoke.lyricKaraokeLines.indexOf(
        lyricKaraokeLine,
        0
      );
      if (index > -1) {
        this.lyricKaraoke.lyricKaraokeLines.splice(index, 1);
        this.lyricKaraokeLineService.removeKaraokeLine(lyricKaraokeLine);
      }
    }
  }
  publishKaraoke(): void {
    if (
      this.lyricKaraoke.lyricKaraokeLines.filter((kl) => kl.time == -1).length >
      0
    ) {
      alert("Some of lyric line are not synchronized yet. Time = -1");
    } else {
      this.lyricKaraokeService
        .publishLyricKaraoke(this.lyricKaraoke.lyricKaraokeId)
        .subscribe((response: any) => {
          alert("lyric karaoke published");
          this.songAudio.lyricKaraoke = this.lyricKaraoke;
          this.isLyricSynchronizing = false;
        });
    }
  }
  showMessage(message: string) {
    this.snackBar.open(message, "Ok", {
      duration: 2000,
    });
  }
  setActiveLineWithCurrentPlayTime(): void {
    const karaokeLines = this.lyricKaraoke.lyricKaraokeLines.filter(
      (kl) => kl.time <= this.currentTime
    );
    if (karaokeLines.length > 0) {
      this.setActiveLineIndex(karaokeLines.length - 1);
      this.setActiveLineWithIndex();
    } else {
      this.resetActiveLineState();
      this.resetLyricContraineerScrollPosition();
    }
  }
  setActiveLineId(activeLineId: string): void {
    this.activeLineId = activeLineId;
  }
  setActiveLineIndex(activeLineIndex: number): void {
    this.activeLineIndex = activeLineIndex;
  }
  setActiveLineWithIndex(): void {
    if (this.activeLineIndex < this.lyricKaraoke.lyricKaraokeLines.length) {
      const indexedKaraokeLine =
        this.lyricKaraoke.lyricKaraokeLines[this.activeLineIndex];
      if (indexedKaraokeLine.time <= this.currentTime) {
        this.setActiveLineId(indexedKaraokeLine.lyricKaraokeLineId);
        this.setActiveLineIndex(this.activeLineIndex + 1);
      }
    }
  }
  setCurrentTime(currentTime: number) {
    this.currentTime = currentTime;
  }
  onAudioTimeUpdated(audioPlayer: HTMLAudioElement): void {
    this.setCurrentTime(audioPlayer.currentTime);
    if (!this.isLyricSynchronizing) {
      if (this.lyricKaraoke) {
        const activeLineIndex = this.activeLineIndex;
        this.setActiveLineWithIndex();
        if (this.lyricContaineer && activeLineIndex != this.activeLineIndex) {
          //if line index hasn't changed no need to scroll
          this.scrollLyricContaineerToActiveLine();
        }
      }
    }
  }
  scrollLyricContaineerToActiveLine(): void {
    if (this.activeLineId != null && this.activeLineId != "") {
      const innerListItem = document.getElementById(this.activeLineId);
      if (innerListItem) {
        const scrollPositon =
          innerListItem.offsetTop -
          this.lyricContaineer.clientHeight / 2 +
          innerListItem.clientHeight / 2;
        this.lyricContaineer.scrollTo({
          top: scrollPositon,
          behavior: "smooth",
        });
      }
    }
  }
  resetLyricContraineerScrollPosition(): void {
    if (!this.isLyricSynchronizing && this.lyricContaineer)
      this.lyricContaineer.scrollTop = 0;
  }
  resetKaraokePlayer(): void {
    this.audioPlayerService.stop();
    this.resetActiveLineState();
    this.resetAudioPlayer();
    this.resetLyricContraineerScrollPosition();
  }
  resetAudioPlayer(): void {
    this.isPlaying = false;
    this.resetAudioPlayerTime();
  }
  resetAudioPlayerTime() {
    this.currentTime = 0;
    this.duration = 0;
    this.bufferedTime = 0;
  }
  resetActiveLineState(): void {
    this.activeLineIndex = 0;
    this.activeLineId = "";
  }
  onPlayStateChanged(): void {
    if (this.isPlaying) this.pause();
    else this.play();
  }
  pause(): void {
    this.audioPlayerService.pause();
    this.onSongPlayed.emit(false);
    this.isPlaying = false;
    this.isIdle = false;
  }
  play(): void {
    this.audioPlayerService.play(this.songAudio);
    this.subscribeToAudioPlayerService();
    this.onSongPlayed.emit(true);
    this.isPlaying = true;
    this.updateNavigationStates();
    this.isIdle = false;
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
  onAudioSourceChanged(songAudio: SongAudio) {
    this.songAudio = songAudio;
    this.resetActiveLineState();
    this.resetAudioPlayerTime();
    this.resetLyricContraineerScrollPosition();
    this.updateNavigationStates();
    this.loadLyricKaraokeOfCurrentSong();
    this.duration = this.audioPlayerService.duration;
    this.logKaraokeEventToGoogleAnalytics();
  }
  subscribeToAudioPlayerService(): void {
    if (!this.subscribedToAudioEvents) {
      this.audioSourceChangeSubscription =
        this.audioPlayerService.onAudioSourceChange$.subscribe(
          (newSongAudio) => {
            console.log("audio source changed");
            if (!this.isLyricSynchronizing) {
              if (newSongAudio.hasKaraoke) {
                this.onAudioSourceChanged(newSongAudio);
              } else if (this.audioPlayerService.hasNext()) {
                this.playNext();
              } else {
                this.close();
              }
            }
          }
        );

      this.audioPlayerTimeUpdateSubscription =
        this.audioPlayerService.onTimeUpdate$.subscribe((audioPlayer) => {
          this.changeCoverPicture(audioPlayer.currentTime);

          if (!this.isSliding) this.onAudioTimeUpdated(audioPlayer);
        });

      this.audioPlayerCanPlaySubscription =
        this.audioPlayerService.onCanPlay$.subscribe((audioPlayer) => {
          this.duration = audioPlayer.duration;
        });

      this.audioPlayerEndedSubscription =
        this.audioPlayerService.onPlayListPlayBackCompleted$.subscribe(() => {
          this.resetKaraokePlayer();
          if (!this.isLyricSynchronizing) {
            this.close();
          }
        });

      this.audioPlayerSeekedSubscription =
        this.audioPlayerService.onSeeked$.subscribe((audioPlayer) => {
          this.onAudioTimeUpdated(audioPlayer);
        });

      this.audioPlayStateChangeSubscription =
        this.audioPlayerService.onPlayStateChanged$.subscribe((isPlaying) => {
          this.isPlaying = isPlaying;
        });

      this.audioPlayListUpdatedSubscription =
        this.audioPlayerService.onPlayListUpdated$.subscribe(() => {
          this.resetActiveLineState();
          this.resetLyricContraineerScrollPosition();
          this.updateNavigationStates();
        });
      this.onBufferProgressSubscription =
        this.audioPlayerService.onBufferProgress$.subscribe((bufferedTime) => {
          this.bufferedTime = bufferedTime;
        });
      this.audioVolumeChangeSubscription =
        this.audioPlayerService.onVolumeChanged$.subscribe((volume) => {
          this.volume = volume;
        });
      this.subscribedToAudioEvents = true;
    }
  }
  changeCoverPicture(audioPlayerCurrentTime: number): void {
    if (this.coverPictures) {
      if (audioPlayerCurrentTime - this.currentCoverImageTime >= 30) {
        this.currentCoverImageTime = audioPlayerCurrentTime;
        if (this.currentCoverImageIndex >= this.coverPictures.length - 1)
          this.currentCoverImageIndex = -1;
        this.currentCoverImage =
          this.coverPictures[++this.currentCoverImageIndex];
      }
    }
  }
  ngOnDestroy(): void {
    this.unSubscribeToAudioPlayerService();
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
    if (this.audioPlayListUpdatedSubscription)
      this.audioPlayListUpdatedSubscription.unsubscribe();
    if (this.onBufferProgressSubscription) {
      this.onBufferProgressSubscription.unsubscribe();
    }
  }
  setPlayingState(): string {
    return this.isPlaying ? "playing" : "paused";
  }
  sliding(isSliding: boolean): void {
    this.isSliding = isSliding;
  }
  seekAudioPlayerTo(seekToTime: number): void {
    this.sliding(false);
    this.audioPlayerService.seekTo(seekToTime);
    this.currentTime = seekToTime;
    if (!this.isLyricSynchronizing && this.lyricKaraoke) {
      this.highlightAndScrollWithCurrentPlayTime();
    }
  }

  changeVolume(event: any): void {
    this.audioPlayerService.changeVolumeTo(Number(event.target.value));
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
    return this.songAudio.song
      ? this.songAudio.song.songId
      : this.songAudio.songId;
  }
  getSongUrlFriendlyTitle(): string {
    return this.songAudio.song
      ? this.songAudio.song.urlFriendlyTitle
      : this.songAudio.songIntro.urlFriendlyTitle;
  }
  close() {
    if (this.isLyricSynchronizing) {
      if (
        confirm(
          "You are in the middle of lyric synchronization. Do you want to leave without completing it?"
        )
      ) {
        this.displayKaraoke = false;
        this.displayKaraokeChange.emit(this.displayKaraoke);
      }
    } else {
      this.displayKaraoke = false;
      this.displayKaraokeChange.emit(this.displayKaraoke);
    }
  }
}
