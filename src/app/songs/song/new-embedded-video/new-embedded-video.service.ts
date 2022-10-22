import { Injectable } from '@angular/core';
import { EmbeddedVideo } from "app/shared/entities/embedded-video";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NewEmbeddedVideoService {

  constructor(private http: HttpClient) { }
  add(songId: number, youTubeId: string): Observable<EmbeddedVideo> {
    let addEmbeddedVideoAPI = `${environment.API_ENDPOINT}/embeddedvideos/${songId}/embeddedvideo`;
    return this.http.post<EmbeddedVideo>(addEmbeddedVideoAPI, { html: youTubeId });
  }
  remove(embeddedVideoId:string){
    let removeEmbeddedVideoAPI=`${environment.API_ENDPOINT}/embeddedvideos/${embeddedVideoId}`;
    return this.http.delete(removeEmbeddedVideoAPI);
  }
}
