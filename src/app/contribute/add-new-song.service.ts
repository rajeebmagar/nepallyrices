import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { NewSong } from 'app/shared/entities/new-song';
import { Song } from 'app/shared/entities/song';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AddNewSongService {

  constructor(private http: HttpClient) { }

  add(newSong: NewSong): Observable<Song> {
    let newSongAPI = `${environment.API_ENDPOINT}/songs/new`;
    return this.http.post<Song>(newSongAPI, {
                                        title: newSong.title.trim(),
                                        lyric: newSong.lyrics.trim(),
                                        singerIds: newSong.singers.map(ns => ns.artistRoleId)
                                      }
                          );
  }

}
