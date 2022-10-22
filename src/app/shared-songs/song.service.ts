import { Injectable } from "@angular/core";

import { Song } from "app/shared/entities/song";
import { Comment } from "app/shared/entities/comment";
import { environment } from "environments/environment";
import { SongIntro } from "app/shared-models/song-intro";
import { appsetting } from "app-settings/app-setting";
import { ArtistIntro } from "../shared-models/artist-intro";
import { ArtistProfile } from "../shared/entities/artist-profile";
import { ArtistRole } from "../shared-artists/models/artist-role";
import { Genre } from "../shared-models/genre";
import { PublishSong } from "app/shared/entities/publish-song";
import { SongAudio } from "app/shared-models/song-audio";
import { PagedResponse } from "app/shared-models/paged-response";
import { UserIntro } from "app/shared-models/user-intro";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class SongService {
  constructor(private http: HttpClient) {}

  getSongDetailByUrlFriendlyTitle(urlFriendlyTitle: string): Observable<Song> {
    const topSongsURL = `${environment.API_ENDPOINT}/songs/${urlFriendlyTitle}`;
    return this.http.get<Song>(topSongsURL);
  }

  getSongById(songId: number): Observable<Song> {
    const topSongsURL = `${environment.API_ENDPOINT}/songs/${songId}`;
    return this.http.get<Song>(topSongsURL);
  }

  getRelatedSongs(urlFriendlyTitle: string): Observable<SongIntro[]> {
    const topSongsURL = `${environment.API_ENDPOINT}/songs/${urlFriendlyTitle}/related`;
    return this.http.get<SongIntro[]>(topSongsURL);
  }

  //Post Comment for logged in User
  postComment(comments: string, songId: number): Observable<Comment> {
    const postCommentURL = `${environment.API_ENDPOINT}/songs/${songId}/comment`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.post<Comment>(
      postCommentURL,
      JSON.stringify(comments),
      options
    );
  }

  getCommentsForSong(songId: number): Observable<PagedResponse<Comment>> {
    const getCommentsURL = `${environment.API_ENDPOINT}/songs/${songId}/comments`;
    return this.http.get<PagedResponse<Comment>>(getCommentsURL);
  }

  patchComment(commentId: number, comments: string) {
    const putCommentsURL = `${environment.API_ENDPOINT}/comments/${commentId}`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.patch(putCommentsURL, JSON.stringify(comments), options);
  }

  deleteComment(commentId: number) {
    const deleteCommentsURL = `${environment.API_ENDPOINT}/comments/${commentId}`;
    return this.http.delete(deleteCommentsURL);
  }

  isLiked(songId: number): Observable<boolean> {
    let likedSongURL = `${environment.API_ENDPOINT}/songs/${songId}/liked`;
    // var access_token = localStorage.getItem(appsetting.TOKEN_NAME);
    // let headers = new Headers({ 'Authorization': 'Bearer ' + access_token });
    // headers.append('Content-Type', 'application/json');
    // let options = new RequestOptions({ headers: headers });

    return this.http.get<boolean>(likedSongURL);
  }

  likeSong(songId: number) {
    const likeSongURL = `${environment.API_ENDPOINT}/songs/${songId}/like`;
    return this.http.post(likeSongURL, true);
  }

  unLikeSong(songId: number) {
    const unLikeSongURL = `${environment.API_ENDPOINT}/songs/${songId}/unlike`;
    //  let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.delete(unLikeSongURL);
  }

  likers(songId: number): Observable<PagedResponse<UserIntro>> {
    const likersUrl = `${environment.API_ENDPOINT}/songs/${songId}/likers`;
    return this.http.get<PagedResponse<UserIntro>>(likersUrl);
  }

  publish(songId: number, publishSong: PublishSong): Observable<any> {
    const publishSongAPI = `${environment.API_ENDPOINT}/songs/${songId}/publish`;
    return this.http.patch(publishSongAPI, publishSong);
  }

  markAsSpam(songId: number): Observable<any> {
    const publishSongAPI = `${environment.API_ENDPOINT}/songs/${songId}/markspam`;
    return this.http.patch(publishSongAPI, null);
  }

  saveEditedLyrics(songId: number, lyrics: string) {
    const putlyricURL = `${environment.API_ENDPOINT}/songs/${songId}/lyric`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    const lyricsEdited = {
      lyric: lyrics,
    };
    return this.http.patch(putlyricURL, JSON.stringify(lyricsEdited), options);
  }

  patchTitle(songId: number, title: string) {
    const putlyricTitleURL = `${environment.API_ENDPOINT}/songs/${songId}/title`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    const titleEdited = {
      title: title,
    };
    return this.http.patch(putlyricTitleURL, titleEdited, options);
  }

  saveNewSingerForSong(songId: number, artist: ArtistRole) {
    const putSongSingerURL = `${environment.API_ENDPOINT}/songs/${songId}/singer/${artist.artistRoleId}`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(putSongSingerURL, options);
  }

  removeSingerForSong(songId: number, artist: ArtistRole) {
    const removeSongSingerURL = `${environment.API_ENDPOINT}/songs/${songId}/singer/${artist.artistRoleId}`;
    //  let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.delete(removeSongSingerURL);
  }

  saveNewCoverSingerForSong(songId: number, artist: ArtistRole) {
    const putSongSingerURL = `${environment.API_ENDPOINT}/songs/${songId}/coversinger/${artist.artistRoleId}`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(putSongSingerURL, options);
  }

  removeCoverSingerForSong(songId: number, artist: ArtistRole) {
    const removeSongSingerURL = `${environment.API_ENDPOINT}/songs/${songId}/coversinger/${artist.artistRoleId}`;
    //  let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.delete(removeSongSingerURL);
  }

  saveNewGenreForSong(songId: number, genre: Genre) {
    const newSongGenreURL = `${environment.API_ENDPOINT}/songs/${songId}/genre/${genre.genreId}`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(newSongGenreURL, options);
  }

  removeGenreForSong(songId: number, genre: Genre) {
    const removeSongGenreURL = `${environment.API_ENDPOINT}/songs/${songId}/genre/${genre.genreId}`;
    return this.http.delete(removeSongGenreURL);
  }

  saveNewLyricistForSong(songId: number, artist: ArtistRole) {
    const putSongLyricistURL = `${environment.API_ENDPOINT}/songs/${songId}/lyricist/${artist.artistRoleId}`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(putSongLyricistURL, options);
  }

  removeSonglyricist(songId: number, artist: ArtistRole) {
    const removeSongLyricistURL = `${environment.API_ENDPOINT}/songs/${songId}/lyricist/${artist.artistRoleId}`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.delete(removeSongLyricistURL, options);
  }

  saveNewMusicianForSong(songId: number, artist: ArtistRole) {
    const putSongMusicianURL = `${environment.API_ENDPOINT}/songs/${songId}/musician/${artist.artistRoleId}`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(putSongMusicianURL, options);
  }

  removeSongmusician(songId: number, artist: ArtistRole) {
    const removeSongMusicianURL = `${environment.API_ENDPOINT}/songs/${songId}/musician/${artist.artistRoleId}`;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.delete(removeSongMusicianURL, options);
  }

  removeAudioFromSong(urlFriendlyTitle: string, songAudio: SongAudio) {
    const removeAudioFromSongAPI = `${environment.API_ENDPOINT}/audios/${songAudio.id}/song/${urlFriendlyTitle}`;
    return this.http.delete(removeAudioFromSongAPI);
  }
}
