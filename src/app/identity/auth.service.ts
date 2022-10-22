import { RegisterExternalUser } from "app/shared/entities/register-external-user";
import { User } from "app/shared/entities/user";
import { RegisterUser } from "app/shared/entities/register-user";
import { Observable, Observer } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { ResetPassword } from "app/shared/entities/reset-password";
import { CreateAuditable } from "app/shared/entities/create-auditable";

import { JWTHelper } from "app/shared/helpers/jwt-helper";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { tap } from "rxjs/operators";
import { environment } from "environments/environment";
import { appsetting } from "app-settings/app-setting";
import { UserInfo } from "app/shared/entities/user-info";
declare var require: any;
var jwtDecode = require("jwt-decode");

@Injectable()
export class AuthService {
  private EXTERNAL_URLS: string =
    `${environment.API_ENDPOINT}/` + "externalaccounts/";
  private ACCOUNT_URL: string = `${environment.API_ENDPOINT}/` + "accounts/";
  private CLIENT_KEY: string = `${appsetting.CLIENT_KEY}`;
  private API_TOKEN_URL: string = `${environment.API_ENDPOINT}/` + "token";
  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}
  accountActivatedReturnUrl: string = `${environment.APP_ENDPOINT}/account/account-activated`;
  externalAccountReturnUrl: string = `${environment.APP_ENDPOINT}/account/external-login`;
  registrationSuccessfulReturnUrl: string = `${environment.APP_ENDPOINT}/account/registration-successful`;
  redirectResetPasswordUrl: string = `${environment.APP_ENDPOINT}/account/reset-password`;

  getExternalLoginUrls(): Observable<any> {
    var url =
      this.EXTERNAL_URLS +
      "providers?returnUrl=" +
      this.externalAccountReturnUrl +
      "&client=" +
      this.CLIENT_KEY +
      "&generateState=true";
    return this.http.get(url);
  }

  //Returns user information based on access token
  getUserInfo(): Observable<UserInfo> {
    var url = this.EXTERNAL_URLS + "userinfo";
    return this.http.get<UserInfo>(url);
  }

  // Register user from external account if the user does not exist in our database
  registerExternalUserAccount(user: RegisterExternalUser) {
    const url =
      this.EXTERNAL_URLS +
      "register?redirectUrl=" +
      this.accountActivatedReturnUrl;
    return this.http.post(url, user);
  }

  registerUserAccount(registerUser: RegisterUser) {
    var url =
      this.ACCOUNT_URL +
      "register?redirectUrl=" +
      this.accountActivatedReturnUrl;

    return this.http.post(url, registerUser);
  }

  forgotPassword(email: string) {
    var url =
      this.ACCOUNT_URL +
      "forgotpassword?redirectUrl=" +
      this.redirectResetPasswordUrl;
    return this.http.post(url, { email: email });
  }
  resetPassword(
    email: string,
    password: string,
    confirmPassword: string,
    code: string
  ): Observable<any> {
    var url = this.ACCOUNT_URL + "resetpassword";
    return this.http.post(url, {
      password: password,
      confirmPassword: confirmPassword,
      email: email,
      code: code,
    });
  }
  resendEmailConfirmation(userName: string): Observable<any> {
    var url =
      this.ACCOUNT_URL +
      "ResendConfirmEmail?userNamerOrEmail=" +
      userName +
      "&redirectUrl=" +
      this.accountActivatedReturnUrl;
    return this.http.post(url, { userNamerOrEmail: userName });
  }

  //login
  login(username: string, password: string): Observable<JsonWebToken> {
    var data =
      "grant_type=password&client_id=" +
      this.CLIENT_KEY +
      "&username=" +
      username +
      "&password=" +
      password;

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        "Data-Type": "application/json",
      }),
    };

    return this.http
      .post<JsonWebToken>(this.API_TOKEN_URL, data, httpOptions)
      .pipe(tap((jwt) => this.saveAccessToken(jwt)));
  }

  loginWithRefreshToken(): Observable<JsonWebToken> {
    let refresh_token = this.userAuthService.getRefreshToken();
    const data =
      "grant_type=refresh_token&refresh_token=" +
      refresh_token +
      "&client_id=" +
      this.CLIENT_KEY;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    };

    return this.http
      .post<JsonWebToken>(this.API_TOKEN_URL, data, httpOptions)
      .pipe(tap((jwt) => this.saveAccessToken(jwt)));
  }

  saveAccessToken(token: JsonWebToken) {
    this.userAuthService.setAccessToken(token.access_token);
    this.userAuthService.setRefreshToken(token.refresh_token);
  }
}
