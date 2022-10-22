import { Injectable } from '@angular/core';
import { LyricKaraokeLine } from 'app/shared/entities/lyric-karaoke-line';
import { LyricKaraoke } from 'app/shared/entities/lyric-karaoke'


import { environment } from 'environments/environment';
import { appsetting } from 'app-settings/app-setting';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';


@Injectable()
export class LyricKaraokeLineService {

  constructor(private http: HttpClient) {

  }

  updateKaraokeLine(karaokeLine: LyricKaraokeLine): void {
    const updateLyricKaraokeLineAPI = `${environment.API_ENDPOINT}/karaokelines/${karaokeLine.lyricKaraokeLineId}`;
    this.http.patch(updateLyricKaraokeLineAPI, karaokeLine)
             .subscribe();
  }

  removeKaraokeLine(karaokeLine: LyricKaraokeLine): void {
    const removeLyricKaraokeLineAPI = `${environment.API_ENDPOINT}/karaokelines/${karaokeLine.lyricKaraokeLineId}`;
    this.http.delete(removeLyricKaraokeLineAPI)
             .subscribe();
  }
}
