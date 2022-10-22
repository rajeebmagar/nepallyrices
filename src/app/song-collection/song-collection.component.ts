import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, RouterLink } from "@angular/router";
import { PaginationService } from "app/shared/services/pagination.service";
import { environment } from "environments/environment";
import { SongIntro } from "app/shared-models/song-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
import { SongAudio } from "app/shared-models/song-audio";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
@Component({
  selector: "nl-song-collection",
  templateUrl: "./song-collection.component.html",
  styleUrls: ["./song-collection.component.css"],
})
export class SongCollectionComponent implements OnInit {
  pagedSongIntros: PagedResponse<SongIntro>;
  songIntros: SongIntro[];
  hasMore = false;

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService,
    private audioPlayerService: AudioPlayerService
  ) {}
  name: string;
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.name = params["name"];
      const type = this.getQueryType();
      if (type === "genres") {
        this.loadSongsOfGenre();
      } else if (type === "tags") {
        this.loadSongsOfTag();
      }
    });
  }

  private getQueryType() {
    return this.route.parent.snapshot.url[0].path;
  }

  loadSongsOfGenre(): void {
    let genreSongsAPI = `${environment.API_ENDPOINT}/genres/${this.name}/songs?pageSize=5`;
    this.loadSongIntrosWithUrl(genreSongsAPI);
  }

  loadSongsOfTag(): void {
    let tagSongsAPI = `${environment.API_ENDPOINT}/tags/${this.name}/songs?pageSize=5`;
    this.loadSongIntrosWithUrl(tagSongsAPI);
  }

  receivedPossibleDuplicateResponse(
    pagedSongIntros: PagedResponse<SongIntro>
  ): void {
    this.pagedSongIntros = pagedSongIntros;
    this.addSongIntrosFromPagedResponse();
    this.hasMore = this.paginationService.hasNext(pagedSongIntros.links);
  }

  addSongIntrosFromPagedResponse(): void {
    let newSongIntros = new Array<SongIntro>();
    if (this.songIntros) newSongIntros = newSongIntros.concat(this.songIntros);
    for (let songIntro of this.pagedSongIntros.items) {
      newSongIntros.push(songIntro);
    }
    this.songIntros = newSongIntros;
  }

  getMoreSongIntros() {
    var nextSongUrl = this.paginationService.getNextPageUrl(
      this.pagedSongIntros.links
    );
    if (nextSongUrl) {
      this.loadSongIntrosWithUrl(nextSongUrl);
    }
  }
  loadSongIntrosWithUrl(url: string): void {
    this.paginationService
      .getNextPageResponse<SongIntro>(url)
      .subscribe((pagedSongIntros) => {
        this.receivedPossibleDuplicateResponse(pagedSongIntros);
      });
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
