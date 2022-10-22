import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { ArtistService } from "app/artists/artist/artist.service";
import { ArtistWithFollowCommandFactory } from "app/shared/commands/factories/artist-with-follow-command-factory";
import { SocialShareCommandsFactoryService } from "app/shared/commands/factories/social-share-commands-factory.service";
import { switchMap } from "rxjs/operators";
@Component({
  selector: "nl-related-artists-widget",
  templateUrl: "./related-artists-widget.component.html",
  styleUrls: ["./related-artists-widget.component.css"],
})
export class RelatedArtistsWidgetComponent implements OnInit {
  @Output() showAll = new EventEmitter();
  @Output() hasRelatedArtist = new EventEmitter<boolean>();
  relatedArtists: ArtistIntro[];
  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private artistWithFollowCommandFactory: ArtistWithFollowCommandFactory,
    private socialShareCommandsFactoryService: SocialShareCommandsFactoryService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) =>
          this.artistService.getRelatedArtists(params["urlFriendlyName"], 5)
        )
      )
      .subscribe((pagedArtistIntros) => {
        this.relatedArtists = pagedArtistIntros.items;
        this.hasRelatedArtist.emit(pagedArtistIntros.totalCount > 0);
      });
  }

  requestToShowAll(): void {
    this.showAll.emit();
  }
}
