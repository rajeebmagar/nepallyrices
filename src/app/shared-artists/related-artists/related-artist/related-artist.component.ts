import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { ArtistService } from "app/artists/artist/artist.service";
import { UserProfile } from "app/shared/entities/user-profile";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { AuthService } from "app/identity/auth.service";
@Component({
  selector: "nl-related-artist",
  templateUrl: "./related-artist.component.html",
  styleUrls: ["./related-artist.component.css"],
})
export class RelatedArtistComponent implements OnInit {
  thumbnailImageSize: any;
  @ViewChild("thumbnailImage", { static: true })
  thumbnailImage: ElementRef;

  @Input()
  relatedArtist: ArtistIntro;
  @Input() userProfile: UserProfile;

  @Input() set relatedArtistDisplayed(relatedArtistDisplayed: boolean) {
    if (relatedArtistDisplayed) {
      this.thumbnailImageSize = this.thumbnailImage.nativeElement.offsetWidth;
    }
  }

  @Output() followersChanged = new EventEmitter<any>();
  constructor(
    private authService: AuthService,
    private artistService: ArtistService,
    private userAuthService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService
  ) {}

  ngOnInit() {
    this.userAuthService.userLoggedInEvent.subscribe((user) => {
      if (user) {
        this.fetchIsFollowing();
      }
    });
  }
  fetchIsFollowing(): void {
    this.artistService
      .following(this.relatedArtist.urlFriendlyName)
      .subscribe((following) => {
        this.relatedArtist.isFollowing = following;
      });
  }
  changeFollowing(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (this.userAuthService.isUserLoggedIn()) {
      if (this.relatedArtist.isFollowing) {
        this.unFollow();
      } else {
        this.follow();
      }
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
  follow(): void {
    if (this.userAuthService.isUserLoggedIn()) {
      this.artistService
        .followArtist(this.relatedArtist.artistId)
        .subscribe((response) => {
          this.relatedArtist.isFollowing = true;
          if (
            this.userProfile.userName ===
            this.userAuthService.getLoggedInUserName()
          ) {
            this.userProfile.followingCount++;
            this.followersChanged.emit({
              relatedArtist: this.relatedArtist,
              isRemoved: false,
            });
          }
        });
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
  unFollow(): void {
    this.artistService
      .unFollowArtist(this.relatedArtist.artistId)
      .subscribe((response) => {
        this.relatedArtist.isFollowing = false;
        if (
          this.userProfile.userName ===
          this.userAuthService.getLoggedInUserName()
        ) {
          this.userProfile.followingCount--;
          this.followersChanged.emit({
            relatedArtist: this.relatedArtist,
            isRemoved: true,
          });
        }
      });
  }
}
