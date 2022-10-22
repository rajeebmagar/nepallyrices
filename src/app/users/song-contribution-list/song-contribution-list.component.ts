import { SongService } from "../../shared-songs/song.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { PagedResponse } from "app/shared-models/paged-response";
import { SongIntro } from "app/shared-models/song-intro";
import { PaginationService } from "app/shared/services/pagination.service";
import { environment } from "environments/environment";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { SongAudio } from "app/shared-models/song-audio";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
import { AuthService } from "app/identity/auth.service";

@Component({
  selector: "nl-song-contribution-list",
  templateUrl: "./song-contribution-list.component.html",
  styleUrls: ["./song-contribution-list.component.css"],
})
export class SongContributionListComponent implements OnInit {
  _userName: string;
  @Input() showMore: boolean = true;
  @Output() hasSongChange = new EventEmitter();
  @Input() inProgress: boolean;

  pagedSongIntros: PagedResponse<SongIntro>;
  songIntros: SongIntro[] = [];
  hasMore = false;

  @Input() set userName(value: string) {
    this._userName = value;
    var type = "";
    if (this.inProgress) {
      type = "workinprogress";
    } else {
      type = "contributions";
    }
    this.songIntros = []; // clear
    let songIntrosOfArtistUrl = `${environment.API_ENDPOINT}/songs/${this._userName}/${type}?pageSize=5`;
    this.getSongIntrosWithUrl(songIntrosOfArtistUrl);
  }
  constructor(
    private songService: SongService,
    private paginationService: PaginationService,
    private audioPlayerService: AudioPlayerService,
    private route: ActivatedRoute,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService,
    private authService: AuthService
  ) {}

  ngOnInit() {}
  getSongIntrosWithUrl(songIntroUrl: string): void {
    this.paginationService
      .getNextPageResponse<SongIntro>(songIntroUrl)
      .subscribe((pagedResponse) => {
        this.pagedSongIntros = pagedResponse;
        this.addSongIntrosFromPagedResponse();
        this.hasMore = this.paginationService.hasNext(pagedResponse.links);
        if (this.pagedSongIntros.items.length > 0) {
          this.hasSongChange.emit();
        }
      });
  }
  addSongIntrosFromPagedResponse() {
    let newSongIntros = new Array<SongIntro>();
    newSongIntros = newSongIntros.concat(this.songIntros);
    for (let songIntro of this.pagedSongIntros.items) {
      newSongIntros.push(songIntro);
    }
    this.songIntros = newSongIntros;
  }
  getMoreSongs() {
    let nextPageSongIntroOfArtistUrl = this.paginationService.getNextPageUrl(
      this.pagedSongIntros.links
    );
    if (nextPageSongIntroOfArtistUrl) {
      this.getSongIntrosWithUrl(nextPageSongIntroOfArtistUrl);
    }
  }
  playAll() {
    let songAudios = this.getSongAudios();
    this.audioPlayerService.playAll(songAudios);
  }
  queueAll() {
    let songAudios = this.getSongAudios();
    this.audioPlayerService.queueAll(songAudios);
  }
  private getSongAudios(): SongAudio[] {
    return this.songIntros
      .filter((songIntro) => {
        return songIntro.audios && songIntro.audios.length > 0;
      })
      .map((songIntro) => {
        return songIntro.audios[0];
      });
  }
}
