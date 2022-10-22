import { Injectable } from "@angular/core";
import { SetPictureService } from "app/shared/services/set-picture-service";
import { Song } from "app/shared/entities/song";
import { Image } from "app/shared-models/image";
import { environment } from "environments/environment";

import { Observable } from "rxjs";
import { CoverPhotoHelper } from "app/shared/helpers/cover-photo-helper";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class SetSongCoverPictureService implements SetPictureService<Song> {
  constructor(
    private http: HttpClient,
    private coverPhotoHelper: CoverPhotoHelper
  ) {}
  setEntityPicture(song: Song, coverPicture: Image, repositionOnly: boolean) {
    let setArtistCoverPictureAPI = `${environment.API_ENDPOINT}/songs/${
      song.songId
    }/setCoverPicture/${
      repositionOnly ? song.coverPhoto.id : coverPicture.id
    }/${this.coverPhotoHelper.getOffsetPercentage(song.coverPhotoPositionY)}`;
    return this.http.post(setArtistCoverPictureAPI, null);
  }
}
