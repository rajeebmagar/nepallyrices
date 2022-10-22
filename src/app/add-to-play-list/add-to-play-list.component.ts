import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SongAudio } from "app/shared-models/song-audio";
import { PlayList } from "app/shared/entities/play-list";
import { NewPlayList } from "app/shared/entities/new-play-list";
import { PlayListService } from "app/add-to-play-list/play-list.service";
import { PagedResponse } from "app/shared-models/paged-response";
import { PaginationService } from "app/shared/services/pagination.service";
import { environment } from "environments/environment";
import { AudioPlayList } from "app/shared/entities/audio-play-list";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { MatCheckboxChange } from "@angular/material/checkbox";
@Component({
  selector: "nl-add-to-play-list",
  templateUrl: "./add-to-play-list.component.html",
  styleUrls: ["./add-to-play-list.component.css"],
  providers: [PlayListService],
  animations: [
    trigger("displayAddToPlaylist", [
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
export class AddToPlayListComponent implements OnInit {
  @Input() displayAddToPlaylist: boolean;

  private _songAudio: SongAudio;
  @Input()
  set songAudio(songAudio: SongAudio) {
    if (songAudio) {
      this._songAudio = songAudio;
      this.resetAudioPlaylists();
      this.fetchPlaylistsOfSongAudio();
    }
  }
  get songAudio(): SongAudio {
    return this._songAudio;
  }

  @Output() displayAddToPlaylistChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  addNew = false;
  hasMore = false;
  newPlaylist = new NewPlayList();
  pagedPlaylists: PagedResponse<PlayList>;
  audioPlaylists: AudioPlayList[];
  constructor(
    private playListService: PlayListService,
    private paginationService: PaginationService,
    private authService: UserAuthService
  ) {}

  ngOnInit() {
    if (this.authService.isUserLoggedIn()) {
      this.loadPlaylistsOfUser();
    }
    this.authService.userLoggedInEvent.subscribe((user) => {
      if (user) {
        this.loadPlaylistsOfUser();
      }
    });
  }
  attachSongAudioToNewPlaylist(): void {
    this.newPlaylist.songAudios = [];
    this.newPlaylist.songAudios.push(this.songAudio.id);
  }
  fetchPlaylistsOfSongAudio(): void {
    this.playListService
      .getCurrentUserPlayListsOfSongAudio(this.songAudio)
      .subscribe((playlists) => {
        if (playlists) this.changeAudioPlaylistStateWith(playlists);
      });
  }
  changeAudioPlaylistStateWith(playlists: PlayList[]): void {
    playlists.forEach((playlist) => {
      let audioPlaylist = this.audioPlaylists.filter(
        (apl) => apl.playlist.id == playlist.id
      )[0];
      audioPlaylist.isAudioIncluded = true;
    });
  }
  resetAudioPlaylists(): void {
    if (this.audioPlaylists) {
      this.audioPlaylists.forEach((audioPlaylist) => {
        audioPlaylist.isAudioIncluded = false;
      });
    }
  }
  loadPlaylistsOfUser(): void {
    var getUserPlaylistsAPI = `${environment.API_ENDPOINT}/playlists/private?pageSize=10`;
    this.getPlayListsWithUrl(getUserPlaylistsAPI);
  }

  getPlayListsWithUrl(playListsUrl: string): void {
    this.paginationService
      .getNextPageResponse<PlayList>(playListsUrl)
      .subscribe((pagedResponse) => {
        this.pagedPlaylists = pagedResponse;
        this.addPlaylistsFromPagedResponse();
        this.hasMore = this.paginationService.hasNext(pagedResponse.links);
      });
  }
  addPlaylistsFromPagedResponse(): void {
    let newAudioPlaylists = new Array<AudioPlayList>();
    if (this.audioPlaylists)
      newAudioPlaylists = newAudioPlaylists.concat(this.audioPlaylists);
    for (let playlist of this.pagedPlaylists.items) {
      let audioPlaylist = new AudioPlayList();
      audioPlaylist.playlist = playlist;
      newAudioPlaylists.push(audioPlaylist);
    }
    this.audioPlaylists = newAudioPlaylists;
  }
  getMorePlaylists() {
    let nextPagePlaylistsUrl = this.paginationService.getNextPageUrl(
      this.pagedPlaylists.links
    );
    if (nextPagePlaylistsUrl) {
      this.getPlayListsWithUrl(nextPagePlaylistsUrl);
    }
  }
  playListSelectionChanged(
    checkBox: MatCheckboxChange,
    playlist: PlayList
  ): void {
    if (checkBox.checked) {
      this.addSongAudioToPlaylist(playlist);
    } else {
      this.removeSongAudioFromPlaylist(playlist);
    }
  }
  addSongAudioToPlaylist(playlist: PlayList): void {
    this.playListService
      .addSongAudioToPlaylist(playlist, this.songAudio)
      .subscribe((response) => {});
  }
  removeSongAudioFromPlaylist(playlist: PlayList): void {
    this.playListService
      .removeSongAudioFromPlaylist(playlist, this.songAudio)
      .subscribe((response) => {});
  }
  createNewPlaylist(): void {
    if (this.newPlaylist.title) {
      this.attachSongAudioToNewPlaylist();
      this.playListService
        .createNewPlayList(this.newPlaylist)
        .subscribe((playList) => {
          this.resetNewPlaylist();
          let audioPlayList = new AudioPlayList();
          audioPlayList.playlist = playList;
          audioPlayList.isAudioIncluded = true;
          this.audioPlaylists.push(audioPlayList);
        });
    } else {
      alert("title is required.");
    }
  }
  resetNewPlaylist(): void {
    this.newPlaylist.title = "";
    this.newPlaylist.private = true;
    this.addNew = false;
  }
  close() {
    this.displayAddToPlaylist = false;
    this.displayAddToPlaylistChange.emit(false);
  }
}
