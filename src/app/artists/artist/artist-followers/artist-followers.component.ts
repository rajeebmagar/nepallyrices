import { Component, OnInit, Input } from "@angular/core";
import { ArtistService } from "../artist.service";
import { UserIntro } from "app/shared-models/user-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { PaginationService } from "app/shared/services/pagination.service";
import { environment } from "environments/environment";
@Component({
  selector: "nl-artist-followers",
  templateUrl: "./artist-followers.component.html",
  styleUrls: ["./artist-followers.component.css"],
})
export class ArtistFollowersComponent implements OnInit {
  artistFollowersDisplayed: boolean;

  _artistId: string;
  @Input()
  set artistId(artistId: string) {
    this._artistId = artistId;
  }
  get artistId(): string {
    return this._artistId;
  }

  @Input() set artistFollowersActivated(artistFollowersActivated: boolean) {
    if (artistFollowersActivated) {
      this.loadArtistFollowers();
    }
  }

  hasMore = false;
  pagedFollowers: PagedResponse<UserIntro>;
  followers: UserIntro[];
  constructor(private paginationService: PaginationService) {}

  ngOnInit() {}
  resetFollowers(): void {
    this.followers = [];
    this.pagedFollowers = null;
  }
  loadArtistFollowers(): void {
    this.resetFollowers();
    let artistFollowersAPI = `${environment.API_ENDPOINT}/artists/${this._artistId}/followers?pageSize=8`;
    this.loadArtistFollowersWithUrl(artistFollowersAPI);
  }
  loadArtistFollowersWithUrl(artistFollowersAPI: string): void {
    this.paginationService
      .getNextPageResponse<UserIntro>(artistFollowersAPI)
      .subscribe((pagedFollowers) => {
        this.pagedFollowers = pagedFollowers;
        this.addFollowersFromPagedResponse();
        this.hasMore = this.paginationService.hasNext(pagedFollowers.links);
        this.artistFollowersDisplayed = true;
      });
  }
  addFollowersFromPagedResponse(): void {
    let newFollowers = new Array<UserIntro>();
    if (this.followers) newFollowers = newFollowers.concat(this.followers);
    for (let follower of this.pagedFollowers.items) {
      newFollowers.push(follower);
    }
    this.followers = newFollowers;
  }
  getMoreFollowers() {
    let nextPageFollowersUrl = this.paginationService.getNextPageUrl(
      this.pagedFollowers.links
    );
    if (nextPageFollowersUrl) {
      this.loadArtistFollowersWithUrl(nextPageFollowersUrl);
    }
  }
}
