import { Injectable } from "@angular/core";
import { appsetting } from "app-settings/app-setting";
import { Observable } from "rxjs";

import { environment } from "environments/environment";
import { PagedResponse } from "app/shared-models/paged-response";
import { PlayList } from "app/shared/entities/play-list";
import { NewPlayList } from "app/shared/entities/new-play-list";
import { SongAudio } from "app/shared-models/song-audio";
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Injectable()
export class PlayListService {
  constructor(private http: HttpClient) {}

  getCurrentUserPlayLists(): Observable<PagedResponse<PlayList>> {
    var getUserPlaylistAPI = `${environment.API_ENDPOINT}/playlists/private`;

    return this.http.get<PagedResponse<PlayList>>(getUserPlaylistAPI);
  }

  getCurrentUserPlayListsOfSongAudio(
    songAudio: SongAudio
  ): Observable<PlayList[]> {
    var getUserPlaylistAPI = `${environment.API_ENDPOINT}/playlists/ofaudio/${songAudio.id}`;

    return this.http.get<PlayList[]>(getUserPlaylistAPI);
  }
  getPlayListById(playListId: number): Observable<PlayList> {
    var getPlaylistAPI = `${environment.API_ENDPOINT}/playlists/${playListId}`;

    return this.http.get<PlayList>(getPlaylistAPI);
  }
  getPublicPlayLists(): Observable<PagedResponse<PlayList>> {
    var getUserPlaylistAPI = `${environment.API_ENDPOINT}/playlists/public`;

    return this.http.get<PagedResponse<PlayList>>(getUserPlaylistAPI);
  }

  getPrivatePlayLists(): Observable<PagedResponse<PlayList>> {
    var getUserPlaylistAPI = `${environment.API_ENDPOINT}/playlists/private`;

    return this.http.get<PagedResponse<PlayList>>(getUserPlaylistAPI);
  }

  getSongAudiosOfPlayList(playListId: number): Observable<SongAudio[]> {
    var getSongAudiosOfPlaylistAPI = `${environment.API_ENDPOINT}/playlists/${playListId}/songaudios`;
    return this.http.get<SongAudio[]>(getSongAudiosOfPlaylistAPI);
  }
  createNewPlayList(newPlayList: NewPlayList): Observable<PlayList> {
    let newPlaylistAPI = `${environment.API_ENDPOINT}/playlists/new`;
    return this.http.post<PlayList>(newPlaylistAPI, newPlayList);
  }

  addSongAudioToPlaylist(playList: PlayList, songAudio: SongAudio) {
    let addSongAudioToPlaylistAPI = `${environment.API_ENDPOINT}/playlists/${playList.id}/songAudios/${songAudio.id}`;
    return this.http.post(addSongAudioToPlaylistAPI, null);
  }

  removeSongAudioFromPlaylist(
    playList: PlayList,
    songAudio: SongAudio
  ): Observable<any> {
    return this.removeSongAudioFromPlaylistWithId(playList.id, songAudio.id);
  }
  removeSongAudioFromPlaylistWithId(
    playListId: number,
    songAudioId: number
  ): Observable<any> {
    let removeSongAudioToPlaylistAPI = `${environment.API_ENDPOINT}/playlists/${playListId}/songAudios/${songAudioId}`;
    return this.http.delete(removeSongAudioToPlaylistAPI, null);
  }

  updateTitle(playListId: number, title: string): Observable<any> {
    let updatePlaylistTitleAPI = `${environment.API_ENDPOINT}/playlists/${playListId}/title`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "blob",
      }),
    };
    return this.http.patch(updatePlaylistTitleAPI, { title: title });
  }
  updateAccessibility(playListId: number, isPrivate: boolean): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "blob",
      }),
    };
    let updatePlaylistTitleAPI = `${environment.API_ENDPOINT}/playlists/${playListId}/accessibility`;
    return this.http.patch(
      updatePlaylistTitleAPI,
      { private: isPrivate },
      options
    );
  }
}
