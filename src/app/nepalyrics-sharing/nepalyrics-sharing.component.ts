import { Component, OnInit } from '@angular/core';
import { UrlHelper } from 'app/shared/url-helper';
import { SocialSharing } from 'app/shared/entities/social-sharing';
import { NepalyricsTwitterSharingService } from 'app/nepalyrics-sharing/nepalyrics-twitter-sharing.service';
import { NepalyricsFacebookSharingService } from 'app/nepalyrics-sharing/nepalyrics-facebook-sharing.service';
import { environment } from 'environments/environment';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NepalyricsSharingService } from "app/nepalyrics-sharing/nepalyrics-sharing.service";
@Component({
  selector: 'nl-nepalyrics-sharing',
  templateUrl: './nepalyrics-sharing.component.html',
  styleUrls: ['./nepalyrics-sharing.component.css'],
  providers: [NepalyricsTwitterSharingService, NepalyricsFacebookSharingService, NepalyricsSharingService]
})
export class NepalyricsSharingComponent implements OnInit {

  displayFacebookPages = false;
  accessToken = '';
  facebookPageConnected = false;
  twitterConnected = false;
  facebookConnectUrl = `${environment.API_ENDPOINT}/sharings/facebook?redirect_uri=${location.href}?provider=facebook`;
  twitterConnectUrl = `${environment.API_ENDPOINT}/sharings/twitter?redirect_uri=${location.href}?provider=twitter`;
  constructor(
    private urlHelper: UrlHelper,
    private nepalyricsTwitterSharingService: NepalyricsTwitterSharingService,
    private nepalyricsFacebookSharingService: NepalyricsFacebookSharingService,
    private nepalyricsSharingService: NepalyricsSharingService) { }

  ngOnInit() {
    let provider = this.urlHelper.getParamValue("provider");
    if (provider) {
      switch (provider) {
        case 'facebook':
          this.accessToken = this.urlHelper.getParamValue("access_token");
          this.displayFacebookPages = true;
          break;
        case 'twitter':
          let socialSharingCommand = new SocialSharing();
          socialSharingCommand.provider = provider;
          socialSharingCommand.accessTokenSecret = this.urlHelper.getParamValue("access_token_secret");
          socialSharingCommand.accessToken = this.urlHelper.getParamValue("access_token");
          socialSharingCommand.providerKey = this.urlHelper.getParamValue("user_id");

          this.nepalyricsTwitterSharingService.connect(socialSharingCommand)
            .subscribe(response => {
              this.twitterConnected = true;
              this.reloadPage();
            });
          break;
        default: break;
      }
    } else {
      this.nepalyricsFacebookSharingService.isConnected()
        .subscribe(connected => {
          this.facebookPageConnected = connected;
        });

      this.nepalyricsTwitterSharingService.isConnected()
        .subscribe(connected => {
          this.twitterConnected = connected;
        });
    }
  }
  facebookPageSelected(socialSharing: SocialSharing): void {
    this.nepalyricsFacebookSharingService.connect(socialSharing)
      .subscribe(response => {
        this.facebookPageConnected = true;
        this.reloadPage();
      });
  }
  reloadPage(): void {
    location.href = '/nlsharings';
  }
  onTwitterConnectChanged(slideToggleChange: MatSlideToggleChange): void {
    if (slideToggleChange.checked) {
      //connect
      this.connectWithTwitter();
    }
    else {
      this.nepalyricsSharingService.disconnect('Twitter').subscribe(response => {
        this.twitterConnected = false;
      });
    }
  }
  connectWithTwitter(): void {
    location.href = this.twitterConnectUrl;
  }
  onFacebookConnectChanged(slideToggleChange: MatSlideToggleChange): void {
    if (slideToggleChange.checked) {
      //connect
      this.connectWithFacebook();
    }
    else {
      this.nepalyricsSharingService.disconnect('Facebook').subscribe(response => {
        this.facebookPageConnected = false;
      });
    }
  }
  connectWithFacebook(): void {
    location.href = this.facebookConnectUrl;
  }
  close(): void {
    this.displayFacebookPages = false;
  }
}
