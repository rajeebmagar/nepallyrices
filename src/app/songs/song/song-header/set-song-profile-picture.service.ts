import { Injectable } from "@angular/core";
import { SetPictureService } from "app/shared/services/set-picture-service";
import { Song } from "app/shared/entities/song";
import { Image } from "app/shared-models/image";
import { environment } from "environments/environment";

import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class SetSongProfilePictureService implements SetPictureService<Song> {
  constructor(private http: HttpClient) {}
  setEntityPicture(song: Song, profilePicture: Image) {
    let setArtistCoverPictureAPI = `${environment.API_ENDPOINT}/songs/${song.songId}/setProfilePicture/${profilePicture.id}`;
    return this.http.post(setArtistCoverPictureAPI, null);
  }
}
