import { Injectable } from "@angular/core";
import { SongAudio } from "app/shared-models/song-audio";
import { Subject } from "rxjs/internal/Subject";

@Injectable()
export class SaveAsPlaylistService {
  private requestToShowSaveAsPlaylist = new Subject<SongAudio[]>();
  private onSaveAsPlaylistDisplayed = new Subject<boolean>();

  requestToShowSaveAsPlaylist$ =
    this.requestToShowSaveAsPlaylist.asObservable();

  constructor() {}

  showSaveAsPlaylist(songAudios: SongAudio[]): void {
    this.requestToShowSaveAsPlaylist.next(songAudios);
    this.onSaveAsPlaylistDisplayed.next(true);
  }

  saveAsPlaylistDisplayed(displayed: boolean): void {
    this.onSaveAsPlaylistDisplayed.next(displayed);
  }
}
