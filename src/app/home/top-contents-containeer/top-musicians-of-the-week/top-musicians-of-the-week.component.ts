import { Component, OnInit } from "@angular/core";
import { TopMusiciansOfTheWeekService } from "./top-musicians-of-the-week.service";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { Link } from "app/shared/entities/link";
import { PaginationService } from "app/shared/services/pagination.service";
import { ArtistService } from "app/artists/artist/artist.service";
import { ArtistWithFollowCommandFactory } from "app/shared/commands/factories/artist-with-follow-command-factory";
import { SocialShareCommandsFactoryService } from "app/shared/commands/factories/social-share-commands-factory.service";
import {
  ArtistBatchMetaDataInfo,
  ArtistMetaDataInfo,
} from "app/shared/entities/artist-batch-meta-data-info";
import { PagedResponse } from "app/shared-models/paged-response";
import { UserAuthService } from "app/identity/user-auth-service.service";
@Component({
  selector: "nl-top-musicians-of-the-week",
  templateUrl: "./top-musicians-of-the-week.component.html",
  styleUrls: ["./top-musicians-of-the-week.component.css"],
  providers: [
    TopMusiciansOfTheWeekService,
    ArtistService,
    ArtistWithFollowCommandFactory,
  ],
})
export class TopMusiciansOfTheWeekComponent implements OnInit {
  hasMore: boolean;
  musiciansOfTheWeek: ArtistIntro[];
  private paginationLinks: Link[];
  isFetchingMore: any;
  constructor(
    private topMusicianssOfTheWeekService: TopMusiciansOfTheWeekService,
    private paginationService: PaginationService,
    private artistService: ArtistService,
    private userAuthService: UserAuthService,
    private artistWithFollowCommandFactory: ArtistWithFollowCommandFactory,
    private socialShareCommandsFactoryService: SocialShareCommandsFactoryService
  ) {}

  ngOnInit() {
    this.fetchTopMusiciansOfTheWeek();
    this.subscribeToUserLoggedInEvent();
  }
  private fetchTopMusiciansOfTheWeek() {
    this.topMusicianssOfTheWeekService
      .getTopMusiciansOfTheWeek()
      .subscribe((pagedMusicians) => {
        this.processOnPagedMusiciansReceived(pagedMusicians);
      });
  }

  private subscribeToUserLoggedInEvent() {
    this.userAuthService.userLoggedInEvent.subscribe((user) => {
      if (this.userAuthService.isUserLoggedIn()) {
        this.processOnUserLoggedIn();
      } else {
        this.processOnUserLoggedOut();
      }
    });
  }

  processOnUserLoggedIn() {
    let newMusiciansOfTheWeek = this.cloneMusiciansOfTheWeek();
    this.artistService
      .getMetaDataInBatchForArtists(
        newMusiciansOfTheWeek.map((lyricist) => lyricist.artistId)
      )
      .subscribe((artistBatchMetaDataInfos) => {
        newMusiciansOfTheWeek = this.updateIsFollowingInformationOfMusicians(
          newMusiciansOfTheWeek,
          artistBatchMetaDataInfos
        );
        this.setMusiciansOfTheWeek(newMusiciansOfTheWeek);
      });
  }
  cloneMusiciansOfTheWeek() {
    return [...this.musiciansOfTheWeek];
  }
  processOnUserLoggedOut() {
    let newMusiciansOfTheWeek = this.cloneMusiciansOfTheWeek();
    newMusiciansOfTheWeek = this.setIsFollowingFalseFor(newMusiciansOfTheWeek);
    this.setMusiciansOfTheWeek(newMusiciansOfTheWeek);
  }
  private setIsFollowingFalseFor(musicians: ArtistIntro[]) {
    musicians.forEach((musician) => {
      musician.isFollowing = false;
    });
    return musicians;
  }

  private processOnPagedMusiciansReceived(
    pagedMusicians: PagedResponse<ArtistIntro>
  ) {
    this.setPaginationLinks(pagedMusicians.links);
    if (this.userAuthService.isUserLoggedIn()) {
      this.refreshIsFollowingInformationOfMusicians(pagedMusicians.items);
    } else {
      this.appendMusicians(pagedMusicians.items);
    }
  }
  private setPaginationLinks(links: Link[]) {
    this.paginationLinks = links;
    this.hasMore = this.paginationService.hasNext(links);
  }
  private refreshIsFollowingInformationOfMusicians(musicians: ArtistIntro[]) {
    this.artistService
      .getMetaDataInBatchForArtists(
        musicians.map((lyricist) => lyricist.artistId)
      )
      .subscribe((artistBatchMetaDataInfos) => {
        musicians = this.updateIsFollowingInformationOfMusicians(
          musicians,
          artistBatchMetaDataInfos
        );
        this.appendMusicians(musicians);
      });
  }
  private updateIsFollowingInformationOfMusicians(
    musicians: ArtistIntro[],
    artistsMetaDataInfo: ArtistBatchMetaDataInfo[]
  ) {
    const artistToMetaDataMap = new Map<string, ArtistMetaDataInfo>(
      artistsMetaDataInfo.map((info) => [info.artistId, info.metaData])
    );
    musicians.forEach((musician) => {
      musician.isFollowing = artistToMetaDataMap.get(
        musician.artistId
      ).isFollowedByUser;
    });
    return musicians;
  }
  private appendMusicians(additionalLyricists: ArtistIntro[]) {
    const mergedLyricists =
      this.mergeWithPreviousMusicians(additionalLyricists);
    this.setMusiciansOfTheWeek(mergedLyricists);
  }
  private mergeWithPreviousMusicians(musicians: ArtistIntro[]) {
    if (this.musiciansOfTheWeek) {
      return [...this.musiciansOfTheWeek, ...musicians];
    }
    return musicians;
  }
  setMusiciansOfTheWeek(musiciansOfTheWeek: ArtistIntro[]) {
    this.musiciansOfTheWeek = musiciansOfTheWeek;
  }
  getMoreMusicians(): void {
    if (this.isFetchingMore) {
      return;
    }
    this.isFetchingMore = true;
    this.paginationService
      .nextPage<ArtistIntro>(this.paginationLinks)
      .subscribe((pagedMusicians) => {
        this.processOnPagedMusiciansReceived(pagedMusicians);
        this.isFetchingMore = false;
      });
  }
}
