import { Injectable } from "@angular/core";
import { ArtistProfile } from "app/shared/entities/artist-profile";
import { PagedResponse } from "app/shared-models/paged-response";
import { SongIntro } from "app/shared-models/song-intro";
import { SocialMedia } from "app/shared/entities/social-media";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { Image } from "app/shared-models/image";
import { environment } from "environments/environment";
import { appsetting } from "app-settings/app-setting";
import { UserIntro } from "app/shared-models/user-intro";

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UrlParamHelper } from "app/shared/helpers/url-param-helper";
import { ArtistBatchMetaDataInfo } from "app/shared/entities/artist-batch-meta-data-info";

@Injectable()
export class ArtistService {
  constructor(
    private http: HttpClient,
    private urlParamHelper: UrlParamHelper
  ) {}

  getArtistProfile(urlFriendlyName: string): Observable<ArtistProfile> {
    const artistProfileAPI = `${environment.API_ENDPOINT}/artists/${urlFriendlyName}`;
    return this.http.get<ArtistProfile>(artistProfileAPI);
  }

  getSongsOfArtist(
    urlFriendlyName: string
  ): Observable<PagedResponse<SongIntro>> {
    const artistSongsAPI = `${environment.API_ENDPOINT}/artists/${urlFriendlyName}/songs?pageSize=5`;
    return this.http.get<PagedResponse<SongIntro>>(artistSongsAPI);
  }

  getRelatedArtists(
    urlFriendlyName: string,
    pageSize: number
  ): Observable<PagedResponse<ArtistIntro>> {
    const relatedArtistsAPI = `${environment.API_ENDPOINT}/artists/${urlFriendlyName}/related?pageSize=${pageSize}`;
    return this.http.get<PagedResponse<ArtistIntro>>(relatedArtistsAPI);
  }

  getFollowers(
    artistId: string,
    pageSize: number
  ): Observable<PagedResponse<UserIntro>> {
    const artistFollowersAPI = `${environment.API_ENDPOINT}/artists/${artistId}/followers?pageSize=${pageSize}`;
    return this.http.get<PagedResponse<UserIntro>>(artistFollowersAPI);
  }

  getSocialMediasOfArtist(urlFriendlyName: string): Observable<SocialMedia[]> {
    const artistSocialMediasAPI = `${environment.API_ENDPOINT}/artists/${urlFriendlyName}/socialprofilesites`;
    return this.http.get<SocialMedia[]>(artistSocialMediasAPI);
  }

  followArtist(artistId: string): Observable<any> {
    const followArtistAPI = `${environment.API_ENDPOINT}/artists/${artistId}/follow`;
    return this.http.post(followArtistAPI, null);
  }

  unFollowArtist(artistId: string): Observable<any> {
    const followArtistAPI = `${environment.API_ENDPOINT}/artists/${artistId}/unfollow`;
    return this.http.delete(followArtistAPI);
  }

  following(urlFriendlyName: string): Observable<boolean> {
    const followingArtistAPI = `${environment.API_ENDPOINT}/artists/${urlFriendlyName}/following`;
    return this.http.get<boolean>(followingArtistAPI);
  }

  updateArtistName(artistId: string, fullName: string) {
    const updateArtistNameAPI = `${environment.API_ENDPOINT}/artists/${artistId}/name`;
    return this.http.patch(updateArtistNameAPI, { name: fullName });
  }

  updateBiography(artistId: string, overview: string, biography: string) {
    const updateArtistBiographyAPI = `${environment.API_ENDPOINT}/artists/${artistId}/biography`;
    return this.http.patch(updateArtistBiographyAPI, {
      overview: overview,
      biography: biography,
    });
  }

  getMetaDataInBatchForArtists(artistIds: string[]) {
    const urlParams = this.urlParamHelper.buildUrlParams(
      artistIds,
      "artistIds"
    );
    const artistsMetaDataAPI = `${environment.API_ENDPOINT}/artists/metadata?${urlParams}`;
    return this.http.get<ArtistBatchMetaDataInfo[]>(artistsMetaDataAPI);
  }
}
