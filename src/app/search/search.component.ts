import { SocialShareCommandsFactoryService } from "../shared/commands/factories/social-share-commands-factory.service";
import { ArtistWithFollowCommandFactory } from "../shared/commands/factories/artist-with-follow-command-factory";
import { PagedResponse } from "../shared-models/paged-response";
import { AudioPlayerService } from "../shared/services/audio-player.service";
import { SongAudio } from "../shared-models/song-audio";
import { SongIntroCommandsFactoryService } from "../shared/commands/factories/song-intro-commands-factory.service";
import { SongWithAddToQueueCommandFactory } from "../shared/commands/factories/song-with-add-to-queue-command-factory";
import { Link } from "../shared/entities/link";
import { ArtistIntro } from "../shared-models/artist-intro";
import { SongIntro } from "../shared-models/song-intro";
import { PaginationService } from "../shared/services/pagination.service";
import { ActivatedRoute, Params, RouterLink } from "@angular/router";
import { Subscription } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { SearchService } from "./search.service";

@Component({
  selector: "nl-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
  providers: [SearchService],
})
export class SearchComponent implements OnInit {
  private query: string;
  private pageSize: number = 10;
  public songIntros = new Array<SongIntro>();
  pagedSongIntros: PagedResponse<SongIntro>;
  public artistIntros = Array<ArtistIntro>();
  pagedArtistIntros: PagedResponse<ArtistIntro>;
  private paginationLinks = new Map<string, Link[]>();
  private hasMore = new Map<string, boolean>();
  private hasMoreSong = false;
  private hasMoreArtist = false;
  private isArtistSearch = false;
  public isRequesting = true;
  private displayMessage: string;
  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService,
    private artistWithFollowCommandFactory: ArtistWithFollowCommandFactory,
    private socialShareCommandsFactoryService: SocialShareCommandsFactoryService,

    private audioPlayerService: AudioPlayerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      var searchType = "all";
      this.query = params["searchQuery"].trim();
      if (this.query) {
        if (params["searchType"] == "artist") {
          this.isArtistSearch = true;
          this.displayMessage = params["searchType"];
          searchType = params["searchType"];
        } else {
          this.displayMessage = this.query;
        }
        this.searchService
          .search(this.query + "?pageSize=" + this.pageSize, searchType)
          .subscribe((response) => {
            if (response.artists != undefined) {
              this.pagedArtistIntros = response.artists;
              this.artistIntros = new Array<ArtistIntro>();
              this.addArtistIntrosFromPagedResponse();
              this.hasMoreArtist = this.paginationService.hasNext(
                this.pagedArtistIntros.links
              );
            }
            if (!this.isArtistSearch) {
              if (response.songs !== undefined) {
                this.pagedSongIntros = response.songs;
                this.songIntros = new Array<SongIntro>();
                this.addSongIntrosFromPagedResponse();
                this.hasMoreSong = this.paginationService.hasNext(
                  this.pagedSongIntros.links
                );
              }
            }

            this.isRequesting = false; // hide spinner
          });
      } else {
        this.isRequesting = false; // hide spinner
      }
    });
  }
  getMoreSongs() {
    let nextPageSongIntroOfArtistUrl = this.paginationService.getNextPageUrl(
      this.pagedSongIntros.links
    );
    if (nextPageSongIntroOfArtistUrl) {
      this.getSongIntrosWithUrl(nextPageSongIntroOfArtistUrl);
    }
  }
  getSongIntrosWithUrl(songIntroUrl: string): void {
    this.paginationService
      .getNextPageResponse<SongIntro>(songIntroUrl)
      .subscribe((pagedResponse) => {
        this.pagedSongIntros = pagedResponse;
        this.addSongIntrosFromPagedResponse();
        this.hasMoreSong = this.paginationService.hasNext(
          this.pagedSongIntros.links
        );
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
  getMoreArtists() {
    let nextPageArtistIntroOfArtistUrl = this.paginationService.getNextPageUrl(
      this.pagedArtistIntros.links
    );
    if (nextPageArtistIntroOfArtistUrl) {
      this.getArtistIntrosWithUrl(nextPageArtistIntroOfArtistUrl);
    }
  }
  getArtistIntrosWithUrl(artistIntroUrl: string): void {
    this.paginationService
      .getNextPageResponse<ArtistIntro>(artistIntroUrl)
      .subscribe((pagedResponse) => {
        this.pagedArtistIntros = pagedResponse;
        this.addArtistIntrosFromPagedResponse();
        this.hasMoreArtist = this.paginationService.hasNext(
          this.pagedArtistIntros.links
        );
      });
  }
  addArtistIntrosFromPagedResponse() {
    let newArtistIntros = new Array<ArtistIntro>();
    newArtistIntros = newArtistIntros.concat(this.artistIntros);
    for (let artistIntro of this.pagedArtistIntros.items) {
      newArtistIntros.push(artistIntro);
    }
    this.artistIntros = newArtistIntros;
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
