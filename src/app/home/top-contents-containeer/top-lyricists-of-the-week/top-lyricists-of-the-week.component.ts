import { Component, OnInit } from "@angular/core";
import { TopLyricistsOfTheWeekService } from "./top-lyricists-of-the-week.service";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { Link } from "app/shared/entities/link";
import { PaginationService } from "app/shared/services/pagination.service";
import { ArtistIntroToIntroViewContentPipe } from "app/shared-module/pipes/artist-intro-to-intro-view-content.pipe";
import { ArtistService } from "app/artists/artist/artist.service";
import { ArtistWithFollowCommandFactory } from "app/shared/commands/factories/artist-with-follow-command-factory";
import { SocialShareCommandsFactoryService } from "app/shared/commands/factories/social-share-commands-factory.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { PagedResponse } from "app/shared-models/paged-response";
import {
  ArtistBatchMetaDataInfo,
  ArtistMetaDataInfo,
} from "app/shared/entities/artist-batch-meta-data-info";
@Component({
  selector: "nl-top-lyricists-of-the-week",
  templateUrl: "./top-lyricists-of-the-week.component.html",
  styleUrls: ["./top-lyricists-of-the-week.component.css"],
  providers: [
    TopLyricistsOfTheWeekService,
    ArtistService,
    ArtistWithFollowCommandFactory,
  ],
})
export class TopLyricistsOfTheWeekComponent implements OnInit {
  hasMore: boolean;
  lyricistsOfTheWeek: ArtistIntro[];
  private paginationLinks: Link[];
  isFetchingMore: boolean;
  constructor(
    private topLyricistsOfTheWeekService: TopLyricistsOfTheWeekService,
    private paginationService: PaginationService,
    private artistIntroToIntroViewContent: ArtistIntroToIntroViewContentPipe,
    private artistService: ArtistService,
    private artistWithFollowCommandFactory: ArtistWithFollowCommandFactory,
    private socialShareCommandsFactoryService: SocialShareCommandsFactoryService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit() {
    this.fetchTopLyricistsOfTheWeek();

    this.subscribeToUserLoggedInEvent();
  }
  private fetchTopLyricistsOfTheWeek() {
    this.topLyricistsOfTheWeekService
      .getTopLyricistsOfTheWeek()
      .subscribe((pagedLyricists) => {
        this.processOnPagedLyricistReceived(pagedLyricists);
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
    let newLyricistsOfTheWeek = this.cloneLyricistsOfTheWeek();
    this.artistService
      .getMetaDataInBatchForArtists(
        newLyricistsOfTheWeek.map((lyricist) => lyricist.artistId)
      )
      .subscribe((artistBatchMetaDataInfos) => {
        newLyricistsOfTheWeek = this.updateIsFollowingInformationOfLyricists(
          newLyricistsOfTheWeek,
          artistBatchMetaDataInfos
        );
        this.setLyricistsOfTheWeek(newLyricistsOfTheWeek);
      });
  }
  cloneLyricistsOfTheWeek() {
    return [...this.lyricistsOfTheWeek];
  }
  processOnUserLoggedOut() {
    let newLyricistsOfTheWeek = this.cloneLyricistsOfTheWeek();
    newLyricistsOfTheWeek = this.setIsFollowingFalseFor(newLyricistsOfTheWeek);
    this.setLyricistsOfTheWeek(newLyricistsOfTheWeek);
  }
  private setIsFollowingFalseFor(lyricists: ArtistIntro[]) {
    lyricists.forEach((lyricist) => {
      lyricist.isFollowing = false;
    });
    return lyricists;
  }
  getMoreLyricist(): void {
    if (this.isFetchingMore) {
      return;
    }
    this.isFetchingMore = true;
    this.paginationService
      .nextPage<ArtistIntro>(this.paginationLinks)
      .subscribe((pagedLyricists) => {
        this.processOnPagedLyricistReceived(pagedLyricists);
        this.isFetchingMore = false;
      });
  }

  private processOnPagedLyricistReceived(
    pagedLyricists: PagedResponse<ArtistIntro>
  ) {
    this.setPaginationLinks(pagedLyricists.links);
    if (this.userAuthService.isUserLoggedIn()) {
      this.refreshIsFollowingInformationOfLyricists(pagedLyricists.items);
    } else {
      this.appendLyricists(pagedLyricists.items);
    }
  }

  private setPaginationLinks(links: Link[]) {
    this.paginationLinks = links;
    this.hasMore = this.paginationService.hasNext(links);
  }

  private refreshIsFollowingInformationOfLyricists(lyricists: ArtistIntro[]) {
    this.artistService
      .getMetaDataInBatchForArtists(
        lyricists.map((lyricist) => lyricist.artistId)
      )
      .subscribe((artistBatchMetaDataInfos) => {
        lyricists = this.updateIsFollowingInformationOfLyricists(
          lyricists,
          artistBatchMetaDataInfos
        );
        this.appendLyricists(lyricists);
      });
  }

  private updateIsFollowingInformationOfLyricists(
    lyricists: ArtistIntro[],
    artistsMetaDataInfo: ArtistBatchMetaDataInfo[]
  ) {
    const artistToMetaDataMap = new Map<string, ArtistMetaDataInfo>(
      artistsMetaDataInfo.map((info) => [info.artistId, info.metaData])
    );
    lyricists.forEach((lyricist) => {
      lyricist.isFollowing = artistToMetaDataMap.get(
        lyricist.artistId
      ).isFollowedByUser;
    });
    return lyricists;
  }

  private appendLyricists(additionalLyricists: ArtistIntro[]) {
    const mergedLyricists =
      this.mergeWithPreviousLyricists(additionalLyricists);
    this.setLyricistsOfTheWeek(mergedLyricists);
  }

  private mergeWithPreviousLyricists(lyricists: ArtistIntro[]) {
    if (this.lyricistsOfTheWeek) {
      return [...this.lyricistsOfTheWeek, ...lyricists];
    }
    return lyricists;
  }

  private setLyricistsOfTheWeek(lyricistsOfTheWeek: ArtistIntro[]) {
    this.lyricistsOfTheWeek = lyricistsOfTheWeek;
  }
}
