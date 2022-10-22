import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { ArtistService } from "../artist.service";
import { SocialMedia } from "app/shared/entities/social-media";
import { SocialMediaService } from "./social-media.service";
import { switchMap } from "rxjs/operators";
@Component({
  selector: "nl-social-medias",
  templateUrl: "./social-medias.component.html",
  styleUrls: ["./social-medias.component.css"],
})
export class SocialMediasComponent implements OnInit {
  @Input()
  artistId: string;

  @Input()
  isEditable: boolean;

  isAddingNew = false;
  newSocialMedia: SocialMedia = new SocialMedia();
  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private socialMediaService: SocialMediaService
  ) {}
  socialMedias: SocialMedia[];
  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) =>
          this.artistService.getSocialMediasOfArtist(params["urlFriendlyName"])
        )
      )
      .subscribe((socialMedias) => {
        this.socialMedias = socialMedias;
      });
  }
  changeToAddMode(): void {
    this.isAddingNew = true;
  }
  changeToNormalMode(): void {
    this.isAddingNew = false;
  }
  addNewSocialMedia(): void {
    if (
      this.newSocialMedia.title &&
      this.newSocialMedia.url &&
      this.newSocialMedia.title != "" &&
      this.newSocialMedia.url != ""
    ) {
      this.socialMediaService
        .addNew(this.newSocialMedia, this.artistId)
        .subscribe((socialMedia) => {
          this.socialMedias.push(socialMedia);
          this.resetForNewSocialMedia();
          this.changeToNormalMode();
        });
    } else {
      alert("Title and Url both required");
    }
  }
  resetForNewSocialMedia(): void {
    this.newSocialMedia = new SocialMedia();
  }
  removeSocialMedia(socialMedia: SocialMedia): void {
    if (confirm("Are you sure to remove: " + socialMedia.title)) {
      this.socialMediaService
        .remove(socialMedia, this.artistId)
        .subscribe((response) => {
          this.socialMedias.splice(this.socialMedias.indexOf(socialMedia));
        });
    }
  }
}
