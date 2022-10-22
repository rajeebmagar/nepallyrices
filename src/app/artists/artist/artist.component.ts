import { ShareArgs } from "../../shared/modules/helpers/share-buttons.class";
import { appsetting } from "../../../app-settings/app-setting";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { ArtistProfile } from "app/shared/entities/artist-profile";
import { ArtistTabs } from "./artist-tabs";
import { ArtistHeaderComponent } from "./artist-header/artist-header.component";
import { ArtistFollowersComponent } from "./artist-followers/artist-followers.component";
import { SocialMediaTagsService } from "app/shared/services/social-media-tags.service";
import { SocialMediaTags } from "app/shared/entities/social-media-tags";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { switchMap } from "rxjs/operators";
import { AuthService } from "app/identity/auth.service";
import { ArtistService } from "./artist.service";
import { ImageDefaultUrlPipe } from "app/shared-module/pipes/image-default-url.pipe";
import { TruncatePipe } from "app/shared-module/pipes/truncate.pipe";
@Component({
  selector: "nl-artist",
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.css"],
})
export class ArtistComponent implements OnInit {
  @ViewChild(ArtistHeaderComponent)
  private artistHeaderComponent: ArtistHeaderComponent;

  @ViewChild(ArtistFollowersComponent)
  private artistFollowersComponent: ArtistFollowersComponent;
  hasRelatedArtist = true;
  wikipediaExtractBiography = false;
  currentTabIndex: number = 0;
  overviewTabIndex = ArtistTabs.overviewTabIndex;
  songsTabIndex = ArtistTabs.songsTabIndex;
  relatedArtistTabIndex = ArtistTabs.relatedArtistTabIndex;
  biographyTabIndex = ArtistTabs.biographyTabIndex;
  followersTabIndex = ArtistTabs.followersTabIndex;

  artistProfile: ArtistProfile;
  shareArgs: ShareArgs;

  defaultImageUrl: string = `${appsetting.DEFAULT_ARTIST_IMAGE}`;
  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userAuthService: UserAuthService,
    private socialMediaTagsService: SocialMediaTagsService
  ) {}
  isEditable: boolean;
  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) =>
          this.artistService.getArtistProfile(params["urlFriendlyName"])
        )
      )
      .subscribe((artistProfile) => {
        this.artistProfile = artistProfile;
        this.setShareArgs();
        this.setIsWikipediaExtract();
        this.setIsEditable();
        this.setMetaTags();
      });

    this.userAuthService.userLoggedInEvent.subscribe((user) => {
      this.setIsEditable();
    });
  }
  setShareArgs(): void {
    var image = new ImageDefaultUrlPipe().transform(
      (this.artistProfile.coverPhoto &&
        this.artistProfile.coverPhoto.imageUrl) ||
        "",
      this.defaultImageUrl
    ); //fallback for image
    var title = this.artistProfile.fullName;
    var tags = `${appsetting.DEFAULT_SHARING_TAG}`;
    var description =
      this.artistProfile.fullName +
      "..." +
      new TruncatePipe().transform(this.artistProfile.overview, ["100"]);
    this.shareArgs = new ShareArgs("", title, description, image, tags);
  }
  setMetaTags(): void {
    this.socialMediaTagsService.addTags(this.getSocialMediaTags());
  }
  getSocialMediaTags(): SocialMediaTags {
    let socialMediaTags = new SocialMediaTags();
    socialMediaTags.type = "Nepali Artist";
    socialMediaTags.title = this.artistProfile.fullName;
    if (this.artistProfile.overview) {
      socialMediaTags.description = this.artistProfile.overview;
    } else if (this.artistProfile.biography) {
      socialMediaTags.description =
        this.artistProfile.biography.length < 200
          ? this.artistProfile.biography
          : this.artistProfile.biography.substring(1, 200);
    }

    socialMediaTags.url = window.location.href;
    if (this.artistProfile.coverPhoto) {
      socialMediaTags.image = this.artistProfile.coverPhoto.imageUrl;
    } else if (this.artistProfile.profilePicture) {
      socialMediaTags.image = this.artistProfile.profilePicture.imageUrl;
    }
    return socialMediaTags;
  }
  setIsWikipediaExtract(): void {
    if (this.artistProfile.biography) {
      let wikipediaIndex = this.artistProfile.biography.indexOf(
        "[Wikipedia Extract]"
      );
      if (wikipediaIndex > 0) {
        this.wikipediaExtractBiography = true;
      } else {
        this.wikipediaExtractBiography = false;
      }
    } else {
      this.wikipediaExtractBiography = false;
    }
  }
  setIsEditable(): void {
    this.isEditable = this.userAuthService.isEditable(this.artistProfile);
  }
  getLineCount(content: string): number {
    if (content) {
      let lineCount = content.split(/\r\n|\r|\n/).length;
      return lineCount;
    }
    return 0;
  }
  tabIndexChanged(tabIndex: number): void {
    this.currentTabIndex = tabIndex;
  }
  showBiography(): void {
    this.artistHeaderComponent.setCurrentTabIndex(this.biographyTabIndex);
  }
  showSongs(): void {
    this.artistHeaderComponent.setCurrentTabIndex(this.songsTabIndex);
  }
  showRelatedArtists(): void {
    this.artistHeaderComponent.setCurrentTabIndex(this.relatedArtistTabIndex);
  }
  showFollowers(): void {
    this.artistHeaderComponent.setCurrentTabIndex(this.followersTabIndex);
  }
  followersChanged(): void {
    this.artistFollowersComponent.loadArtistFollowers();
  }
  hasRelatedArtistChange(hasRelatedArtist: boolean): void {
    this.hasRelatedArtist = hasRelatedArtist;
  }
  updateBiography() {
    this.artistService
      .updateBiography(
        this.artistProfile.artistProfileId,
        this.artistProfile.overview,
        this.artistProfile.biography
      )
      .subscribe();
  }
}
