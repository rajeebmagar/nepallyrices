import { Component, OnInit } from "@angular/core";
import { ArtistsService } from "app/shared-artists/artists.service";
import { PaginationService } from "app/shared/services/pagination.service";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { Link } from "app/shared/entities/link";
import { NepaliAlphabet } from "app/shared/helpers/nepali-alphabet";
import { ArtistWithFollowCommandFactory } from "app/shared/commands/factories/artist-with-follow-command-factory";
import { SocialShareCommandsFactoryService } from "app/shared/commands/factories/social-share-commands-factory.service";

@Component({
  selector: "nl-artists",
  templateUrl: "./artists.component.html",
  styleUrls: ["./artists.component.css"],
})
export class ArtistsComponent implements OnInit {
  sliderInitialized: boolean;

  constructor(
    private artistsService: ArtistsService,
    private paginationService: PaginationService,
    private artistWithFollowCommandFactory: ArtistWithFollowCommandFactory,
    private socialShareCommandsFactoryService: SocialShareCommandsFactoryService
  ) {}
  artists: ArtistIntro[];
  private paginationLinks: Link[];
  hasMore: boolean;
  isRequesting = true;
  displayMessage: string;
  query: string = "अ";
  alphabetsVowels = NepaliAlphabet.Vowels;
  alphabetsConsonants = NepaliAlphabet.Consonants;
  ngOnInit(): void {
    this.isRequesting = true;
    this.search(this.query); //default search
  }
  setArtists(artists: ArtistIntro[]) {
    this.artists = artists;
  }
  getMoreArtists(): void {
    this.paginationService.nextPage(this.paginationLinks).subscribe((val) => {
      if (val != undefined) {
        let newArtists = new Array<ArtistIntro>();
        newArtists = newArtists.concat(this.artists); //copy previous data

        var items = val.items;
        this.paginationLinks = val.links;
        this.hasMore = this.paginationService.hasNext(this.paginationLinks);

        for (var i = 0; i < items.length; i++) {
          let newArtist = <ArtistIntro>items[i];
          newArtists.push(newArtist);
        }
        this.setArtists(newArtists);
      }
    });
  }
  search(query: string) {
    this.query = query;
    this.artistsService.search(this.query).subscribe((response) => {
      var itemMap = response;
      this.artists = itemMap["items"];
      this.paginationLinks = itemMap["links"];
      this.hasMore = this.paginationService.hasNext(this.paginationLinks);
      this.isRequesting = false; //hide spinner
      this.sliderInitialized = true;
    });
  }
}
