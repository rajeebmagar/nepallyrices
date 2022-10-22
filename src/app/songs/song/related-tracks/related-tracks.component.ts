import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SongIntro } from "app/shared-models/song-intro";
import { SongComponent } from "../song.component";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { ActivatedRoute, Params } from "@angular/router";
import { PaginationService } from "app/shared/services/pagination.service";
import { PagedResponse } from "app/shared-models/paged-response";
import { SongAudio } from "app/shared-models/song-audio";

@Component({
  moduleId: module.id,
  selector: "nl-related-tracks",
  templateUrl: "related-tracks.html",
  styleUrls: ["related-tracks.css"],
})
export class RelatedTracksComponent {
  @Input() showMore: boolean = true;
  _pagedSongIntros: PagedResponse<SongIntro>;
  @Input()
  set pagedSongIntros(pagedSongIntros: PagedResponse<SongIntro>) {
    this._pagedSongIntros = pagedSongIntros;
    this.songIntros = pagedSongIntros.items;
    this.hasMore = this.paginationService.hasNext(pagedSongIntros.links);
  }
  get pagedSongIntros(): PagedResponse<SongIntro> {
    return this._pagedSongIntros;
  }
  songIntros: SongIntro[] = [];
  hasMore = false;
  constructor(
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService,
    private paginationService: PaginationService,
    private audioPlayerService: AudioPlayerService,
    private route: ActivatedRoute
  ) {}

  getMoreSongs(): void {
    let nextPageSongIntroOfArtistUrl = this.paginationService.getNextPageUrl(
      this.pagedSongIntros.links
    );
    if (nextPageSongIntroOfArtistUrl) {
      this.getSongIntrosWithUrl(nextPageSongIntroOfArtistUrl);
    }
  }
  playAll(): void {
    let songAudios = this.getSongAudios();
    this.audioPlayerService.playAll(songAudios);
  }
  queueAll(): void {
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
  getSongIntrosWithUrl(songIntroUrl: string): void {
    this.paginationService
      .getNextPageResponse<SongIntro>(songIntroUrl)
      .subscribe((pagedResponse) => {
        this._pagedSongIntros = pagedResponse;
        this.addSongIntrosFromPagedResponse();
        this.hasMore = this.paginationService.hasNext(pagedResponse.links);
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
}
