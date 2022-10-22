import { environment } from "../../environments/environment";

import { PagedResponse } from "app/shared-models/paged-response";
import { Injectable, Inject } from "@angular/core";
import { UserProfile } from "../shared/entities/user-profile";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class UserAccountService {
  private USERS_URL = `${environment.API_ENDPOINT}/users`;
  private USER_PROFILE_URL = `${environment.API_ENDPOINT}/userprofiles`;

  constructor(private http: HttpClient) {}

  //Returns user profile information based on the use id
  getUserProfileById(userId: string): Observable<UserProfile> {
    var url = `${this.USERS_URL}/${userId}/profile`;
    return this.http.get<UserProfile>(url);
  }

  //Returns user profile information based on the user name
  getUserProfileByName(userName: string): Observable<UserProfile> {
    const url = `${this.USERS_URL}/${userName}/profile`;
    return this.http.get<UserProfile>(url);
  }

  //Returns user profile information based on access token
  getLoggedInUserProfile() {
    const url = `${this.USER_PROFILE_URL}/GetLoggedInUserProfile`;
    return this.http.get(url);
  }

  updateUserProfile(userProfile: UserProfile) {
    const url = this.USERS_URL + "/me/updateprofile";
    const data = {
      aboutMe: userProfile.aboutMe,
      gender: userProfile.gender,
      homeCountry: userProfile.address.homeCountry,
      homeTown: userProfile.address.homeTown,
      currentCountry: userProfile.address.currentCountry,
      currentTown: userProfile.address.currentTown,
      dateOfBirth: userProfile.dateOfBirth,
      firstName: userProfile.firstName,
      middleName: userProfile.middleName,
      lastName: userProfile.lastName,
    };
    return this.http.put(url, data);
  }

  followUser(userId: string) {
    const followArtistAPI = `${environment.API_ENDPOINT}/users/${userId}/follow`;
    return this.http.post(followArtistAPI, null);
  }

  unFollowUser(userId: string) {
    const followArtistAPI = `${environment.API_ENDPOINT}/users/${userId}/unfollow`;
    return this.http.delete(followArtistAPI);
  }

  assignAsEditor(userName: string) {
    const editorAssignAPI = `${environment.API_ENDPOINT}/users/${userName}/assignAsEditor`;
    return this.http.post(editorAssignAPI, null);
  }

  removeAsEditor(userName: string) {
    const editorRemoveAPI = `${environment.API_ENDPOINT}/users/${userName}/removeAsEditor`;
    return this.http.delete(editorRemoveAPI);
  }

  isEditor(userName: string): Observable<boolean> {
    const isUserEditorAPI = `${environment.API_ENDPOINT}/users/${userName}/isEditor`;
    return this.http.get<boolean>(isUserEditorAPI);
  }

  following(userId: string): Observable<boolean> {
    const followingArtistAPI = `${environment.API_ENDPOINT}/users/${userId}/following`;
    return this.http.get<boolean>(followingArtistAPI);
  }

  followers(userName: string): Observable<boolean> {
    const followingArtistAPI = `${environment.API_ENDPOINT}/users/${userName}/followrs`;
    return this.http.get<boolean>(followingArtistAPI);
  }
}
