import { Component, OnInit } from "@angular/core";
import { PlayList } from "app/shared/entities/play-list";
import { PagedResponse } from "app/shared-models/paged-response";
import { PaginationService } from "app/shared/services/pagination.service";
import { environment } from "environments/environment";

@Component({
  selector: "nl-public-play-list",
  templateUrl: "./public-play-list.component.html",
  styleUrls: ["./public-play-list.component.css"],
})
export class PublicPlayListComponent implements OnInit {
  pagedPlaylists: PagedResponse<PlayList>;
  playlists: PlayList[];
  hasMore = false;

  constructor(private paginationService: PaginationService) {}

  ngOnInit() {
    this.loadPublicPlaylists();
  }

  loadPublicPlaylists(): void {
    var getPublicPlaylistsAPI = `${environment.API_ENDPOINT}/playlists/public?pageSize=10`;
    this.getPlayListsWithUrl(getPublicPlaylistsAPI);
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
    let newPlaylists = new Array<PlayList>();
    if (this.playlists) newPlaylists = newPlaylists.concat(this.playlists);
    for (let playlist of this.pagedPlaylists.items) {
      newPlaylists.push(playlist);
    }
    this.playlists = newPlaylists;
  }
  getMorePlaylists() {
    let nextPagePlaylistsUrl = this.paginationService.getNextPageUrl(
      this.pagedPlaylists.links
    );
    if (nextPagePlaylistsUrl) {
      this.getPlayListsWithUrl(nextPagePlaylistsUrl);
    }
  }
}
