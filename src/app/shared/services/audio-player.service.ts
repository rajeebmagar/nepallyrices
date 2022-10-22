import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { SongAudio } from "../../shared-models/song-audio";
import { SongIntro } from "../../shared-models/song-intro";
import { Song } from "../entities/song";
import { SongAudioPlayList } from "../entities/song-play-list";
import { SongService } from "app/shared-songs/song.service";
import { GoogleAnalyticsEventsService } from "app/shared/services/google-analytics-events.service";

@Injectable()
export class AudioPlayerService {
  private songAudio: SongAudio;
  private audioPlayer = new Audio();
  private songAudioPlayList = new SongAudioPlayList();

  private onAudioSourceChange = new Subject<SongAudio>();
  private onSongAudioQueued = new Subject<SongAudio>();
  private onSongAudioRemovedFromQueue = new Subject<SongAudio>();
  private onAudioPlayBackCompleted = new Subject<SongAudio>();
  private onTimeUpdate = new Subject<HTMLAudioElement>();
  private onBufferProgress = new Subject<number>();
  private onCanPlay = new Subject<HTMLAudioElement>();
  private onEnded = new Subject();
  private onPlayListUpdated = new Subject();
  private onSeeked = new Subject<HTMLAudioElement>();
  private onPlayStateChanged = new Subject<boolean>();
  private onVolumeChanged = new Subject<number>();
  private onLoopPlaylistChanged = new Subject<boolean>();
  private onLoopSongChanged = new Subject<boolean>();
  private onPlayRandomChanged = new Subject<boolean>();

  onTimeUpdate$ = this.onTimeUpdate.asObservable();
  onAudioSourceChange$ = this.onAudioSourceChange.asObservable();
  onCanPlay$ = this.onCanPlay.asObservable();
  onPlayListPlayBackCompleted$ = this.onEnded.asObservable();
  onSeeked$ = this.onSeeked.asObservable();
  onPlayStateChanged$ = this.onPlayStateChanged.asObservable();
  onVolumeChanged$ = this.onVolumeChanged.asObservable();
  onPlayListUpdated$ = this.onPlayListUpdated.asObservable();
  onAudioPlayBackCompleted$ = this.onAudioPlayBackCompleted.asObservable();
  onBufferProgress$ = this.onBufferProgress.asObservable();
  onSongAudioQueued$ = this.onSongAudioQueued.asObservable();
  onSongAudioRemovedFromQueue$ =
    this.onSongAudioRemovedFromQueue.asObservable();
  onLoopPlaylistChanged$ = this.onLoopPlaylistChanged.asObservable();
  onLoopSongChanged$ = this.onLoopSongChanged.asObservable();
  onPlayRandomChanged$ = this.onPlayRandomChanged.asObservable();

  duration: number;
  isPlaying: boolean;
  volume: number;
  loopPlayList: boolean;
  loopSong: boolean;
  playRandom: boolean;
  private defaultVolume: number = 0.25;

  constructor(
    private songService: SongService,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService
  ) {
    this.isPlaying = false;
    this.volume = this.defaultVolume;
    this.audioPlayer.volume = this.volume;

    this.audioPlayer.ontimeupdate = () => {
      this.onTimeUpdate.next(this.audioPlayer);
    };
    this.audioPlayer.oncanplay = () => {
      this.duration = this.audioPlayer.duration;
      this.onCanPlay.next(this.audioPlayer);
    };
    this.audioPlayer.onended = () => {
      this.playBackCompleted();
    };
    this.audioPlayer.onseeked = () => {
      this.onSeeked.next(this.audioPlayer);
    };
    this.audioPlayer.onvolumechange = () => {
      this.volume = this.audioPlayer.volume;
      this.onVolumeChanged.next(this.audioPlayer.volume);
    };
    this.audioPlayer.onloadeddata = () => {
      this.notifySubscriberOnBufferProgress();
    };
    this.audioPlayer.onerror = () => {
      console.log("on error");
    };
    this.audioPlayer.onprogress = () => {
      this.notifySubscriberOnBufferProgress();
    };
  }
  notifySubscriberOnBufferProgress(): void {
    if (this.audioPlayer.buffered.length > 0) {
      var bufferedEnd = this.audioPlayer.buffered.end(
        this.audioPlayer.buffered.length - 1
      );
      this.onBufferProgress.next(bufferedEnd);
    }
  }
  playBackCompleted(): void {
    this.googleAnalyticsEventsService.emitEvent(
      "audio",
      "playback completed",
      this.getSongUrlFriendlyTitle()
    );
    if (this.loopSong) {
      this.replaySong();
    } else {
      this.notifySubscribersForAudioPlaybackCompleted();
      if (this.playRandom) {
        this.random();
      } else {
        if (this.hasNext()) this.next();
        else if (this.loopPlayList) {
          this.replayPlayList();
        } else {
          this.songAudioPlayList.clear();
          this.onPlayListUpdated.next();
          this.songAudio = null;
          this.notifySubscribersForPlaybackCompleted();
        }
      }
    }
  }
  notifySubscribersForAudioPlaybackCompleted(): void {
    this.onAudioPlayBackCompleted.next(this.songAudio);
  }
  replaySong(): void {
    this.googleAnalyticsEventsService.emitEvent(
      "audio",
      "replay",
      this.getSongUrlFriendlyTitle(),
      this.songAudio.id
    );
    this.startPlaying();
    this.onPlayListUpdated.next();
  }
  getSongUrlFriendlyTitle(): string {
    return this.songAudio.song
      ? this.songAudio.song.urlFriendlyTitle
      : this.songAudio.songIntro.urlFriendlyTitle;
  }
  replayPlayList(): void {
    this.songAudioPlayList.rewind();
    let audio = this.songAudioPlayList.getCurrent();
    this.play(audio);
    this.onPlayListUpdated.next();
  }
  notifySubscribersForPlaybackCompleted(): void {
    this.onEnded.next();
  }
  //toggle play
  play(songAudio: SongAudio): void {
    //if it is not currently playing audio change audio source
    if (this.songAudio == null || this.songAudio.id != songAudio.id) {
      this.setSongAudio(songAudio);

      //this.songAudioPlayList.clear(); user mostly press play button than +
      this.songAudioPlayList.addToQueue(songAudio);
      this.songAudioPlayList.setCurrentPlaying(songAudio);
      this.onPlayListUpdated.next();
      this.onSongAudioQueued.next(songAudio);
    }

    this.startPlaying();
  }

  startPlaying(): void {
    this.audioPlayer.play();
    this.isPlaying = true;
    this.publishAudioPlayStateChangeEvent();
    this.googleAnalyticsEventsService.emitEvent(
      "audio",
      "play",
      this.getSongUrlFriendlyTitle(),
      this.songAudio.id
    );
  }
  queueAll(songAudios: SongAudio[]): void {
    for (let songAudio of songAudios) {
      this.addToQueue(songAudio);
    }
  }
  playAll(songAudios: SongAudio[]): void {
    this.clear();
    for (let songAudio of songAudios) {
      this.addToQueue(songAudio);
    }
  }
  clear(): void {
    this.pause();
    this.stop();
    this.songAudioPlayList.clear();
    this.notifySubscribersForPlaybackCompleted();
  }
  clearExcept(songAudio: SongAudio): void {
    this.songAudioPlayList.clearExcept(songAudio);
  }
  removeFromQueue(songAudio: SongAudio): void {
    if (this.isCurrentAudioEquals(songAudio)) {
      this.next();
    }
    this.songAudioPlayList.removeFromQueue(songAudio);
    this.onPlayListUpdated.next();
    this.onSongAudioRemovedFromQueue.next(songAudio);
  }
  getSongIntroList(): SongIntro[] {
    return this.songAudioPlayList.getAll().map((songAudio) => {
      if (songAudio.songIntro) return songAudio.songIntro;
      else if (songAudio.song) return this.mapToSongIntro(songAudio.song);
    });
  }
  mapToSongIntro(song: Song): SongIntro {
    let songIntro = new SongIntro();
    songIntro.title = song.title;
    songIntro.audios = song.audios;
    songIntro.description = song.description;
    songIntro.embeddedVideos = song.embeddedVideos;
    songIntro.genres = song.genres;
    songIntro.id = song.songId;
    songIntro.image = song.profilePicture;
    songIntro.lyric = song.lyric;
    songIntro.lyricExcerpt = song.lyricExcerpt;
    songIntro.lyricists = song.lyricists;
    songIntro.lyricsCollected = song.lyricsCollected;
    songIntro.musicians = song.musicians;
    songIntro.singers = song.singers;
    songIntro.urlFriendlyTitle = song.urlFriendlyTitle;
    return songIntro;
  }
  addToQueue(songAudio: SongAudio): void {
    if (this.isEmptyPlayList()) {
      this.play(songAudio);
    } else {
      this.songAudioPlayList.addToQueue(songAudio);

      this.onSongAudioQueued.next(songAudio);
      this.onPlayListUpdated.next();
    }
  }
  addToQueueToPlayNext(songAudio: SongAudio): void {
    if (this.isEmptyPlayList()) {
      this.play(songAudio);
    } else {
      this.songAudioPlayList.addToQueueToPlayNext(songAudio);

      this.onPlayListUpdated.next();
      this.onSongAudioQueued.next(songAudio);
    }
  }
  hasNext(): boolean {
    //random is a loop with random play index
    return this.playRandom || this.songAudioPlayList.hasNext();
  }
  next(): void {
    let nextAudio: SongAudio;
    if (this.playRandom) this.random();
    else if (this.hasNext()) {
      nextAudio = this.songAudioPlayList.getNext();
      this.navigateToSongAudio(nextAudio);
    }
  }
  random(): void {
    let nextAudio = this.songAudioPlayList.getRandom();
    this.navigateToSongAudio(nextAudio);
  }
  isEmptyPlayList(): boolean {
    return this.songAudioPlayList.isEmpty();
  }
  isInQueue(songAudio: SongAudio): boolean {
    return this.songAudioPlayList.isInQueue(songAudio);
  }
  hasPrevious(): boolean {
    //random is a loop with random play index
    return this.playRandom || this.songAudioPlayList.hasPrevious();
  }
  previous(): void {
    if (this.hasPrevious()) {
      let previousAudio = this.songAudioPlayList.getPrevious();
      this.navigateToSongAudio(previousAudio);
    }
  }
  navigateToSongAudio(songAudio: SongAudio): void {
    this.setSongAudio(songAudio);
    this.startPlaying();
    this.onPlayListUpdated.next();
  }
  playSongAudioListItem(songAudio: SongAudio): void {
    if (this.songAudio == null || this.songAudio.id != songAudio.id) {
      this.setSongAudio(songAudio);
      this.songAudioPlayList.setCurrentPlaying(songAudio);
      this.onPlayListUpdated.next();
    }
    this.startPlaying();
  }
  setSongLoop(loop: boolean): void {
    this.loopSong = loop;
    this.onLoopSongChanged.next(this.loopSong);
  }
  setSongListLoop(loop: boolean): void {
    this.loopPlayList = loop;
    this.onLoopPlaylistChanged.next(this.loopPlayList);
  }
  setPlayRandom(playRandom: boolean): void {
    this.playRandom = playRandom;
    this.onPlayRandomChanged.next(this.playRandom);
  }
  stop(): void {
    this.isPlaying = false;
    this.duration = 0;
  }
  publishAudioPlayStateChangeEvent() {
    this.onPlayStateChanged.next(this.isPlaying);
  }
  setSongAudio(songAudio: SongAudio): void {
    this.songAudio = songAudio;
    this.audioPlayer.src = this.songAudio.mediaUrl;
    if (this.songAudio.song) {
      this.publishAudioSourceChangeEvent();
    } else {
      this.songService
        .getSongById(this.songAudio.songIntro.id)
        .subscribe((song) => {
          this.songAudio.song = song;
          this.publishAudioSourceChangeEvent();
        });
    }
  }
  publishAudioSourceChangeEvent(): void {
    this.onAudioSourceChange.next(this.songAudio);
  }
  pause() {
    this.audioPlayer.pause();
    this.isPlaying = false;
    this.publishAudioPlayStateChangeEvent();
  }
  seekTo(time: number): void {
    if (this.songAudio) this.audioPlayer.currentTime = time;
  }
  changeVolumeTo(volume: number): void {
    this.audioPlayer.volume = volume;
  }
  isCurrentAudioEquals(songAudio: SongAudio) {
    if (this.songAudio != null) return this.songAudio.id == songAudio.id;
    return false;
  }
  getAudioPlayer(): HTMLAudioElement {
    return this.audioPlayer;
  }
}
