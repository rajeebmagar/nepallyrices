import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { NewSong } from "app/shared/entities/new-song";
import { PagedResponse } from "app/shared-models/paged-response";
import { SongIntro } from "app/shared-models/song-intro";
import { PaginationService } from "app/shared/services/pagination.service";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class FindPossibleDuplicateSongsService {
  constructor(private paginationService: PaginationService) {}

  // GET search/songs?title={title}&lyric={lyric}&singerIds[0]={singerIds[0]}&singerIds[1]={singerIds[1]}
  find(newSong: NewSong): Observable<PagedResponse<SongIntro>> {
    var singerFilter = this.getSingerFilter(newSong);
    let findPossibleDuplicateSongsAPI = `${
      environment.API_ENDPOINT
    }/search/songs?title=${newSong.title}&lyric=${
      newSong.lyrics ? newSong.lyrics.trim() : newSong.title.trim()
    }&${singerFilter}&pageSize=5`;
    return this.paginationService.getNextPageResponse<SongIntro>(
      findPossibleDuplicateSongsAPI
    );
  }
  private getSingerFilter(newSong: NewSong): string {
    var singerFilter = "";
    for (let i in newSong.singers) {
      singerFilter += `singerIds[${i}]=${newSong.singers[i].artistRoleId}&`;
    }
    return singerFilter.substring(0, singerFilter.length - "&".length); //removes trailing &
  }
}
