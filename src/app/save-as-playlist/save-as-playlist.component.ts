import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NewPlayList } from "app/shared/entities/new-play-list";
import { PlayListService } from "app/add-to-play-list/play-list.service";
import { SongAudio } from "app/shared-models/song-audio";
import { animate, style, transition, trigger } from "@angular/animations";
@Component({
  selector: "nl-save-as-playlist",
  templateUrl: "./save-as-playlist.component.html",
  styleUrls: ["./save-as-playlist.component.css"],
  providers: [PlayListService],
  animations: [
    trigger("displaySaveAsPlaylist", [
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
export class SaveAsPlaylistComponent implements OnInit {
  @Output() displaySaveAsPlaylistChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() displaySaveAsPlaylist: boolean;
  private _songAudios: SongAudio[];
  @Input()
  set songAudios(songAudios: SongAudio[]) {
    if (songAudios) {
      this._songAudios = songAudios;
      this.newPlaylist = new NewPlayList();
      this.newPlaylist.songAudios = songAudios.map((sa) => sa.id);
    }
  }
  get songAudios(): SongAudio[] {
    return this._songAudios;
  }

  newPlaylist: NewPlayList;
  constructor(private playListService: PlayListService) {}

  ngOnInit() {}

  createNewPlaylist(): void {
    if (this.newPlaylist.title) {
      this.playListService
        .createNewPlayList(this.newPlaylist)
        .subscribe((playList) => {
          alert("new playlist has been created");
          this.close();
        });
    } else {
      alert("title is required.");
    }
  }

  close() {
    this.displaySaveAsPlaylist = false;
    this.displaySaveAsPlaylistChange.emit(false);
  }
}
