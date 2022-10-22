import { Component, OnInit } from "@angular/core";
import { TopSingersOfTheDayService } from "./top-singers-of-the-day.service";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { ArtistWithFollowCommandFactory } from "app/shared/commands/factories/artist-with-follow-command-factory";
import { SocialShareCommandsFactoryService } from "app/shared/commands/factories/social-share-commands-factory.service";
import { ArtistService } from "app/artists/artist/artist.service";
import {
  ArtistBatchMetaDataInfo,
  ArtistMetaDataInfo,
} from "app/shared/entities/artist-batch-meta-data-info";
import { UserAuthService } from "app/identity/user-auth-service.service";
@Component({
  selector: "nl-top-singers-of-the-day",
  templateUrl: "./top-singers-of-the-day.component.html",
  styleUrls: ["./top-singers-of-the-day.component.css"],
})
export class TopSingersOfTheDayComponent implements OnInit {
  sliderName: string = "top-singers-of-the-day";
  singers: ArtistIntro[];
  constructor(
    private topSingersOfTheDayService: TopSingersOfTheDayService,
    public artistWithFollowCommandFactory: ArtistWithFollowCommandFactory,
    public socialShareCommandsFactoryService: SocialShareCommandsFactoryService,
    private artistService: ArtistService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit() {
    this.fetchTopSingersOfTheDay();
    this.subscribeToUserLoggedInEvent();
  }

  private subscribeToUserLoggedInEvent() {
    this.userAuthService.userLoggedInEvent.subscribe((_) => {
      if (this.userAuthService.isUserLoggedIn()) {
        this.refreshIsFollowingInformationOfSingers(this.singers);
      } else {
        this.resetIsFollowingInformation();
      }
    });
  }
  private resetIsFollowingInformation() {
    const clonedSingers = [...this.singers];
    clonedSingers.forEach((updatedSinger) => {
      updatedSinger.isFollowing = false;
    });
    this.singers = clonedSingers;
  }

  private fetchTopSingersOfTheDay() {
    this.topSingersOfTheDayService
      .getTopSingersOfTheDay()
      .subscribe((pagedTopSingesrOfTheDay) => {
        const singers = pagedTopSingesrOfTheDay.items;
        if (this.userAuthService.isUserLoggedIn()) {
          this.refreshIsFollowingInformationOfSingers(singers);
        } else {
          this.singers = singers;
        }
      });
  }

  private refreshIsFollowingInformationOfSingers(singers: ArtistIntro[]) {
    this.artistService
      .getMetaDataInBatchForArtists(singers.map((singer) => singer.artistId))
      .subscribe((artistBatchMetaDataInfos) => {
        this.updateSingersMetaData(singers, artistBatchMetaDataInfos);
      });
  }

  private updateSingersMetaData(
    singers: ArtistIntro[],
    artistBatchMetaDataInfos: ArtistBatchMetaDataInfo[]
  ) {
    const artistToMetaDataMap = new Map<string, ArtistMetaDataInfo>(
      artistBatchMetaDataInfos.map((info) => [info.artistId, info.metaData])
    );
    const updatedSingers = [...singers];
    singers.forEach((updatedSinger) => {
      updatedSinger.isFollowing = artistToMetaDataMap.get(
        updatedSinger.artistId
      ).isFollowedByUser;
    });
    this.singers = updatedSingers;
  }
}
