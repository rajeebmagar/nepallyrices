import { Injectable } from "@angular/core";
import { SongAudio } from "app/shared-models/song-audio";
import { Subject } from "rxjs";
@Injectable()
export class AddToPlayListService {
  private requestToShowAddToPlaylist = new Subject<SongAudio>();

  private addToPlaylistDisplayed = new Subject<boolean>();

  requestToShowAddToPlaylist$ = this.requestToShowAddToPlaylist.asObservable();
  lyricKaraokeDisplayed$ = this.addToPlaylistDisplayed.asObservable();
  constructor() {}
  showAddToPlaylist(songAudio: SongAudio): void {
    this.requestToShowAddToPlaylist.next(songAudio);
    this.addToPlaylistDisplayed.next(true);
  }

  AddToPlaylistDisplayed(displayed: boolean): void {
    this.addToPlaylistDisplayed.next(displayed);
  }
}
