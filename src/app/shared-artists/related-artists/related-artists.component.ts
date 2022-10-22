import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { ArtistService } from "app/artists/artist/artist.service";
import { environment } from "environments/environment";
import { PaginationService } from "app/shared/services/pagination.service";
import { UserProfile } from "app/shared/entities/user-profile";
@Component({
  selector: "nl-related-artists",
  templateUrl: "./related-artists.component.html",
  styleUrls: ["./related-artists.component.css"],
})
export class RelatedArtistsComponent implements OnInit {
  relatedArtistDisplayed: boolean;

  pagedRelatedArtistIntros: PagedResponse<ArtistIntro>;
  relatedArtistIntros: ArtistIntro[];
  hasMore = false;
  @Input() type = "related-artist";
  @Input() userProfile: UserProfile;
  @Input() set relatedArtistsActivated(relatedArtistsActivated: boolean) {
    if (relatedArtistsActivated && !this.pagedRelatedArtistIntros) {
      this.loadRelatedArtist(this.type);
    }
  }

  @Output() hasRelatedArtist = new EventEmitter<boolean>();
  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {}
  loadRelatedArtist(_type: string): void {
    this.route.params.subscribe((params: Params) => {
      this.relatedArtistIntros = []; //clear
      let url = "";
      switch (this.type) {
        case "related-artist":
          url = `${environment.API_ENDPOINT}/artists/${params["urlFriendlyName"]}/related?pageSize=8`;
          break;
        case "artist-following":
          url = `${environment.API_ENDPOINT}/users/${params["userName"]}/following/artists?pageSize=8`;
          break;
        default:
          url = `${environment.API_ENDPOINT}/artists/${params["urlFriendlyName"]}/related?pageSize=8`;
          break;
      }
      this.getRelatedArtistIntrosWithUrl(url);
    });
  }
  getRelatedArtistIntrosWithUrl(relatedArtistsUrl: string): void {
    this.paginationService
      .getNextPageResponse<ArtistIntro>(relatedArtistsUrl)
      .subscribe((pagedRelatedArtistIntros) => {
        this.pagedRelatedArtistIntros = pagedRelatedArtistIntros;
        this.addArtistIntrosFromPagedResponse();
        this.hasMore = this.paginationService.hasNext(
          pagedRelatedArtistIntros.links
        );
        this.hasRelatedArtist.emit(pagedRelatedArtistIntros.totalCount > 0);
        this.relatedArtistDisplayed = true;
      });
  }
  addArtistIntrosFromPagedResponse() {
    let artistIntros = new Array<ArtistIntro>();
    artistIntros = artistIntros.concat(this.relatedArtistIntros);
    for (let artistIntro of this.pagedRelatedArtistIntros.items) {
      artistIntros.push(artistIntro);
    }
    this.relatedArtistIntros = artistIntros;
  }
  getMoreArtists() {
    let nextPageRelatedArtistsUrl = this.paginationService.getNextPageUrl(
      this.pagedRelatedArtistIntros.links
    );
    if (nextPageRelatedArtistsUrl) {
      this.getRelatedArtistIntrosWithUrl(nextPageRelatedArtistsUrl);
    }
  }
  followArtist(relatedArtist): void {
    alert("follow artist");
  }
  followersChanged($event): void {
    if ($event.isRemoved) {
      var index = this.relatedArtistIntros.indexOf($event.relatedArtist, 0);
      if (index > -1) {
        this.relatedArtistIntros.splice(index, 1);
      }
      // this.loadRelatedArtist(this.type);
    }
  }
}
