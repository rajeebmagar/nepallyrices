import { SongService } from "../song.service";
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

@Component({
  selector: "nl-song-widget",
  templateUrl: "./song-widget.component.html",
  styleUrls: ["./song-widget.component.css"],
})
export class SongWidgetComponent implements OnInit {
  @Output() hasSongChange = new EventEmitter();

  pagedSongIntros: PagedResponse<SongIntro>;
  songIntros: SongIntro[] = [];
  hasMore = false;
  @Input() widgetTitle: string;
  @Input() set URL(value: string) {
    this.songIntros = []; // clear
    this.getSongIntrosWithUrl(value);
  }
  constructor(
    private songService: SongService,
    private paginationService: PaginationService,
    private audioPlayerService: AudioPlayerService,
    private route: ActivatedRoute,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService
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
