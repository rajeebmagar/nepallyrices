import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { JWTHelper } from "app/shared/helpers/jwt-helper";
import { User } from "app/shared/entities/user";
import { CreateAuditable } from "app/shared/entities/create-auditable";
import { TokenRefreshService } from "app/shared/token-refresh.service";

@Directive()
@Injectable()
export class UserAuthService {

  accessTokenKey: string = "access_token";
  refreshTokenKey: string = "refresh_token";
  currentUserKey: string = "currentUser";

  @Output() userLoggedInEvent: EventEmitter<User> = new EventEmitter<User>();
  constructor(private tokenRefreshService: TokenRefreshService) { }

  setAccessToken(access_token: string, accountExist = true): void {
    localStorage.setItem(this.accessTokenKey, access_token);
    if (accountExist) {
      this.login();
    }
  }
  login(): void {
    var decodedAccessToken = this.decodedAccessToken();

    let user = new User();
    user.id = decodedAccessToken.nameid;
    user.userName = decodedAccessToken.unique_name;
    this.setUser(user);
  }
  setUser(user: any, emitEvent = true): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    if(emitEvent)
      this.userLoggedInEvent.emit(user);
  }
  getUser(): User {
    let currentUser = localStorage.getItem(this.currentUserKey);
    if (currentUser)
      return JSON.parse(currentUser);
    return null;
  }
  getAccessToken(): any {
    return localStorage.getItem(this.accessTokenKey);
  }
  getAuthorizationToken(): string{
    return `Bearer ${this.getAccessToken()}`;
  }
  setRefreshToken(access_token: string): void {
    localStorage.setItem(this.refreshTokenKey, access_token);
  }
  getRefreshToken(): any {
    return localStorage.getItem(this.refreshTokenKey);
  }
  isTokenAvailable(): boolean {
    if (this.getAccessToken()) {
      return true;
    }
    return false;
  }
  isRefreshTokenAvailable(): boolean {
    if (this.getRefreshToken()) {
      return true;
    }
    return false;
  }
  isTokenExpired(): boolean {
    if (this.isTokenAvailable()) {
      let tokenExpired = JWTHelper.isTokenExpired(this.getAccessToken());

      return tokenExpired;
    }
    return true;
  }
  isUserLoggedIn(): boolean {
    if (this.isTokenAvailable() && this.isTokenExpired() && this.isRefreshTokenAvailable()) {
      this.tokenRefreshService.refreshToken();
    }
    return (this.isTokenAvailable() && !this.isTokenExpired()) ||
      this.isRefreshTokenAvailable();
  }
  isEditable(createAuditable: CreateAuditable): boolean {
    if(!createAuditable){
      return false;
    }
    if (this.isUserLoggedIn()) {
      let owned = this.isOwnedByLoggedInUser(createAuditable);
      if (!owned) {
        return this.isEditor();
      } else {
        return true;
      }
    }
    return false;
  }
  decodedAccessToken(): any {
    return JWTHelper.decodedAccessToken(this.getAccessToken());
  }
  isAdmin(): boolean {
    if (this.isUserLoggedIn()) {
      let decodedToken = this.decodedAccessToken();
      if (decodedToken) {
        if (decodedToken.role) {
          var roles = this.parseRole(decodedToken.role);
          return roles
            .filter(role =>
              role.toLowerCase() === 'admin' ||
              role.toLowerCase() === 'superadmin').length > 0;
        }
      }
    }
    return false;
  }
  parseRole(role: any): string[] {
    var roles = [];
    if (typeof role === 'string') {
      roles.push(role);
    }
    else
      roles = role;
    return roles;
  }
  isSuperAdmin(): boolean {
    if (this.isUserLoggedIn()) {
      let decodedToken = this.decodedAccessToken();
      if (decodedToken) {
        if (decodedToken.role) {
          var roles = this.parseRole(decodedToken.role);

          return roles
            .filter(role =>
              role.toLowerCase() === 'superadmin').length > 0;
        }
      }
    }
    return false;
  }
  isEditor(): boolean {
    if (this.isUserLoggedIn()) {
      let decodedToken = this.decodedAccessToken();
      if (decodedToken) {
        if (decodedToken.role) {
          var roles = this.parseRole(decodedToken.role);
          return roles
            .filter(role => role.toLowerCase() === 'editor' ||
              role.toLowerCase() === 'admin' ||
              role.toLowerCase() === 'superadmin').length > 0;
        }
      }
    }
    return false;
  }
  isOwnedByLoggedInUser(createAuditable: CreateAuditable): boolean {
    return this.isOwnedByLoggedInUserByName(createAuditable.owner.userName);
  }
  isOwnedByLoggedInUserByName(userName: string): boolean {
    if (this.isUserLoggedIn()) {
      let loggedInUserName = this.getLoggedInUserName();
      if (userName === loggedInUserName)
        return true;
    }
    return false;
  }
  getLoggedInUserName(): string {
    let user = this.getUser();
    if (user) {
      return user.userName;
    }
    return null;
  }
  clear(): void {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.userLoggedInEvent.emit(null);
  }
}
