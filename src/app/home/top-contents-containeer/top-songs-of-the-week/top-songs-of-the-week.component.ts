import { Component, OnInit } from "@angular/core";
import { TopSongsOfTheWeekService } from "./top-songs-of-the-week.service";
import { SongIntro } from "app/shared-models/song-intro";
import { Link } from "app/shared/entities/link";
import { PaginationService } from "app/shared/services/pagination.service";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
import { SongAudio } from "app/shared-models/song-audio";
import { PagedResponse } from "app/shared-models/paged-response";
@Component({
  selector: "nl-top-songs-of-the-week",
  templateUrl: "./top-songs-of-the-week.component.html",
  styleUrls: ["./top-songs-of-the-week.component.css"],
  providers: [TopSongsOfTheWeekService, SongWithAddToQueueCommandFactory],
})
export class TopSongsOfTheWeekComponent implements OnInit {
  hasMore: boolean;
  songsOfTheWeek: SongIntro[];
  private paginationLinks: Link[];
  isFetchingMore: any;

  constructor(
    private topSongsOfTheWeekService: TopSongsOfTheWeekService,
    private paginationService: PaginationService,
    private audioPlayerService: AudioPlayerService,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService
  ) {}

  ngOnInit() {
    this.topSongsOfTheWeekService
      .getTopSongsOfTheWeek()
      .subscribe((pagedSongs) => {
        this.processOnPagedSongsReceived(pagedSongs);
      });
  }
  private processOnPagedSongsReceived(pagedSongs: PagedResponse<SongIntro>) {
    this.setPaginationLinks(pagedSongs);
    this.appendSongs(pagedSongs.items);
  }

  private appendSongs(additionalSongs: SongIntro[]) {
    const mergedSongs = this.mergeWithPreviousSongs(additionalSongs);
    this.setSongsOfTheWeek(mergedSongs);
  }

  private mergeWithPreviousSongs(songs: SongIntro[]) {
    if (this.songsOfTheWeek) {
      return [...this.songsOfTheWeek, ...songs];
    }
    return songs;
  }

  private setPaginationLinks(pagedSongs: PagedResponse<SongIntro>) {
    this.paginationLinks = pagedSongs.links;
    this.hasMore = this.paginationService.hasNext(this.paginationLinks);
  }

  setSongsOfTheWeek(songsOfTheWeek: SongIntro[]) {
    this.songsOfTheWeek = songsOfTheWeek;
  }
  getMoreSongs(): void {
    if (this.isFetchingMore) {
      return;
    }
    this.isFetchingMore = true;
    this.paginationService
      .nextPage<SongIntro>(this.paginationLinks)
      .subscribe((pagedSongs) => {
        this.processOnPagedSongsReceived(pagedSongs);
        this.isFetchingMore = false;
      });
  }
  playAll(): void {
    this.audioPlayerService.playAll(this.getSongAudios());
  }
  queueAll(): void {
    this.audioPlayerService.queueAll(this.getSongAudios());
  }
  private getSongAudios(): SongAudio[] {
    return this.songsOfTheWeek
      .filter((songIntro) => {
        return songIntro.audios && songIntro.audios.length > 0;
      })
      .map((songIntro) => {
        return songIntro.audios[0];
      });
  }
}
