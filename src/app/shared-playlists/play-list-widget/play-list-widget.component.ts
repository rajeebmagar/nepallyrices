import { environment } from "../../../environments/environment";
import { PagedResponse } from "../../shared-models/paged-response";
import { PaginationService } from "../../shared/services/pagination.service";
import { SocialShareCommandsFactoryService } from "../../shared/commands/factories/social-share-commands-factory.service";
import { PlayListService } from "../../add-to-play-list/play-list.service";
import { PlayList } from "../../shared/entities/play-list";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "nl-play-list-widget",
  templateUrl: "./play-list-widget.component.html",
  styleUrls: ["./play-list-widget.component.css"],
})
export class PlayListWidgetComponent implements OnInit {
  @Input() playListType = "private"; // public,private
  @Input() enablePagination: boolean;
  playlists: PlayList[];
  showMore = true;
  hasMore = false;
  pagedPlayLists: PagedResponse<PlayList>;
  constructor(
    private playListService: PlayListService,
    private paginationService: PaginationService,
    private socialShareCommandsFactoryService: SocialShareCommandsFactoryService
  ) {}

  ngOnInit() {
    this.playlists = []; // clear
    if (this.enablePagination) {
      const playListUrl = `${environment.API_ENDPOINT}/playlists/${this.playListType}?pageSize=5`;
      this.getPlayListWithUrl(playListUrl);
    } else {
      if (this.playListType == "private") {
        this.playListService
          .getPrivatePlayLists()
          .subscribe((pagedPlayLists) => {
            this.playlists = pagedPlayLists.items;
          });
      } else {
        this.playListService
          .getPublicPlayLists()
          .subscribe((pagedPlayLists) => {
            this.playlists = pagedPlayLists.items;
          });
      }
    }
  }
  // play list with pagination
  getPlayListWithUrl(playListUrl: string): void {
    this.paginationService
      .getNextPageResponse<PlayList>(playListUrl)
      .subscribe((pagedResponse) => {
        this.pagedPlayLists = pagedResponse;
        this.addPlayListFromPagedResponse();
        this.hasMore = this.paginationService.hasNext(pagedResponse.links);
      });
  }
  addPlayListFromPagedResponse() {
    let newSongIntros = new Array<PlayList>();
    newSongIntros = newSongIntros.concat(this.playlists);
    for (let playList of this.pagedPlayLists.items) {
      newSongIntros.push(playList);
    }
    this.playlists = newSongIntros;
  }
  getMoreSongs() {
    let nextPagePlayListUrl = this.paginationService.getNextPageUrl(
      this.pagedPlayLists.links
    );
    if (nextPagePlayListUrl) {
      this.getPlayListWithUrl(nextPagePlayListUrl);
    }
  }
}
