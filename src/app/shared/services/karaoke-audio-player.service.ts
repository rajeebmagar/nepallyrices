import { Injectable } from "@angular/core";
import { SongAudio } from "app/shared-models/song-audio";
import { Subject } from "rxjs";
@Injectable()
export class KaraokeAudioPlayerService {
  private requestToShowKaraokeAudioPlayer = new Subject<SongAudio>();
  private lyricKaraokeDisplayed = new Subject<boolean>();

  requestToShowKaraokeAudioPlayer$ =
    this.requestToShowKaraokeAudioPlayer.asObservable();
  lyricKaraokeDisplayed$ = this.lyricKaraokeDisplayed.asObservable();
  constructor() {}
  showKaraokeAudioPlayer(songAudio: SongAudio): void {
    this.requestToShowKaraokeAudioPlayer.next(songAudio);
    this.lyricKaraokeDisplayed.next(true);
  }
  karaokeAudioPlayerDisplayed(displayed: boolean): void {
    this.lyricKaraokeDisplayed.next(displayed);
  }
}
