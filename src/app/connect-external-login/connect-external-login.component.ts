import { Component, OnInit } from '@angular/core';
import { UrlHelper } from "app/shared/url-helper";
import { ConnectExternalAccount } from "app/shared/entities/connect-external-account";
import { UserFacebookService } from "app/connect-external-login/user-facebook.service";
import { JWTHelper } from "app/shared/helpers/jwt-helper";
import { environment } from 'environments/environment';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from "@angular/router";
import { ExternalAccount } from "app/shared/entities/external-account";
@Component({
  selector: 'nl-connect-external-login',
  templateUrl: './connect-external-login.component.html',
  styleUrls: ['./connect-external-login.component.css'],
  providers: [UserFacebookService]
})
export class ConnectExternalLoginComponent implements OnInit {
  accessToken = '';
  facebookConnectUrl = `${environment.API_ENDPOINT}/sharings/me/facebook?redirect_uri=${location.href}?provider=facebook`;
  twitterConnectUrl = `${environment.API_ENDPOINT}/sharings/me/twitter?redirect_uri=${location.href}?provider=twitter`;
  googleConnectUrl = `${environment.API_ENDPOINT}/externalaccounts/login?provider=Google&response_type=token&client_id=nepalyrics-web&redirect_uri=${location.href}?provider=google`;
  disabled=true;
  facebookConnected = false;
  twitterConnected = false;
  googleConnected = false;
  constructor(
    private urlHelper: UrlHelper,
    private externalAccountService: UserFacebookService,
    private router: Router) { }


  ngOnInit() {
    let provider = this.urlHelper.getParamValue("provider");
    if (provider) {
      let connectExternal = new ConnectExternalAccount();
      connectExternal.provider=provider;
      switch (provider) {
        case 'twitter':
          this.accessToken = this.urlHelper.getParamValue("access_token");
          connectExternal.providerKey = this.urlHelper.getParamValue("user_id");
          break;
        case 'facebook':
          this.accessToken = this.urlHelper.getParamValue("access_token");
          connectExternal.providerKey = this.urlHelper.getParamValue("user_id");
          break;
        case 'google':
          this.accessToken = this.urlHelper.getParamValue("access_token");
          connectExternal.providerKey = JWTHelper.decodedAccessToken(this.accessToken).nameid;
          break;
        default: break;
      }

      this.externalAccountService.link(connectExternal)
        .subscribe(response => {
          location.href = '/connectexternalaccount';
        });
    } else {
      this.externalAccountService.getExternalAccounts().subscribe(externalAccounts => {
        for (let externalAccount of externalAccounts) {
          if (externalAccount.loginProvider === 'Facebook')
            this.facebookConnected = true;
          else if (externalAccount.loginProvider === 'Twitter')
            this.twitterConnected = true;
          else if (externalAccount.loginProvider === 'Google')
            this.googleConnected = true;
        }
        this.disabled=false;
      });
    }
  }

  onFacebookConnectChanged(slideToggleChange: MatSlideToggleChange): void {
    if (slideToggleChange.checked) {
      location.href = this.facebookConnectUrl;
    }
    else {
      this.externalAccountService.unlink('Facebook').subscribe(response => {
        this.facebookConnected = false;
      });
    }
  }
  onTwitterConnectChanged(slideToggleChange: MatSlideToggleChange): void {
    if (slideToggleChange.checked) {
      location.href = this.twitterConnectUrl;
    }
    else {
      this.externalAccountService.unlink('Twitter').subscribe(response => {
        this.twitterConnected = false;
      });
    }
  }
  onGoogleConnectChanged(slideToggleChange: MatSlideToggleChange): void {
    if (slideToggleChange.checked) {
      location.href = this.googleConnectUrl;
    }
    else {
      this.externalAccountService.unlink('Google').subscribe(response => {
        this.googleConnected = false;
      });
    }
  }

}
