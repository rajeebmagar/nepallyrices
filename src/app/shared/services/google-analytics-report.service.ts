import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class GoogleAnalyticsReportService {
  constructor(private http: HttpClient) { }
  getArtistPageViewCount(urlFriendlyName: string): Observable<string> {
    let getArtistPageViewCountAPI = `${environment.API_ENDPOINT}/googleanalytics/artists/${urlFriendlyName}/viewcount`;
    return this.http.get<string>(getArtistPageViewCountAPI);
  }
  getSongPageViewCount(urlFriendlyName: string): Observable<string> {
    let getArtistPageViewCountAPI = `${environment.API_ENDPOINT}/googleanalytics/songs/${urlFriendlyName}/viewcount`;
    return this.http.get<string>(getArtistPageViewCountAPI);
  }

  getSongAudioPlayCount(songUrlFriendlyName: string): Observable<string> {
    let getSongPlayCountAPI = `${environment.API_ENDPOINT}/googleanalytics/audios/${songUrlFriendlyName}/playcount`;
    return this.http.get<string>(getSongPlayCountAPI);
  }
    getSongKaraokeViewCount(songUrlFriendlyName: string): Observable<string> {
    let getSongPlayCountAPI = `${environment.API_ENDPOINT}/googleanalytics/karaokes/${songUrlFriendlyName}/viewcount`;
    return this.http.get<string>(getSongPlayCountAPI);
  }

}
