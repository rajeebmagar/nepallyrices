import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { ArtistService } from "../artist.service";
import { PagedResponse } from "app/shared-models/paged-response";
import { SongIntro } from "app/shared-models/song-intro";
import { PaginationService } from "app/shared/services/pagination.service";
import { environment } from "environments/environment";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { SongAudio } from "app/shared-models/song-audio";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
@Component({
  selector: "nl-artist-songs",
  templateUrl: "./artist-songs.component.html",
  styleUrls: ["./artist-songs.component.css"],
})
export class ArtistSongsComponent implements OnInit {
  @Input() showMore: boolean = true;
  @Input() showCount = true;
  @Output() hasSongChange = new EventEmitter();

  pagedSongIntros: PagedResponse<SongIntro>;
  songIntros: SongIntro[] = [];
  hasMore = false;
  @Input() title: string;
  @Input() titleSpan: string;
  constructor(
    private artistService: ArtistService,
    private paginationService: PaginationService,
    private audioPlayerService: AudioPlayerService,
    private route: ActivatedRoute,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.songIntros = []; //clear
      let songIntrosOfArtistUrl = `${environment.API_ENDPOINT}/artists/${params["urlFriendlyName"]}/songs?pageSize=5`;
      this.getSongIntrosWithUrl(songIntrosOfArtistUrl);
    });
  }
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
