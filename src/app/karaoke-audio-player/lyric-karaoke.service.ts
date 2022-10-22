import { Injectable } from '@angular/core';
import { LyricKaraokeLine } from 'app/shared/entities/lyric-karaoke-line';
import { LyricKaraoke } from 'app/shared/entities/lyric-karaoke'


import { environment } from 'environments/environment';
import { appsetting } from 'app-settings/app-setting'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class LyricKaraokeService {

  constructor(private http: HttpClient) {

  }

  getKaraokeByAudioId(audioId: number): Observable<LyricKaraoke> {
    const lyricKaraokeByAudioIdAPI = `${environment.API_ENDPOINT}/audios/${audioId}/lyrickaraokes/published`;
    return this.http.get<LyricKaraoke>(lyricKaraokeByAudioIdAPI);
  }

  addKaraokeOfAudioIdWithLines(audioId: number, karaokeLines: LyricKaraokeLine[]): Observable<LyricKaraoke> {

    const newLyricKaraokeAPI = `${environment.API_ENDPOINT}/audios/${audioId}/lyrickaraokes/new`;
    return this.http.post<LyricKaraoke>(newLyricKaraokeAPI, karaokeLines);

  }
  publishLyricKaraoke(lyricKarokeId: number) {
    const publishLyricKaraokeAPI = `${environment.API_ENDPOINT}/lyrickaraokes/${lyricKarokeId}/publish`;
    return this.http.patch(publishLyricKaraokeAPI, null);
  }
}
