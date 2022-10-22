import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {Tag} from "../../shared/entities/tag";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AssignTagToSongService {

  constructor(private http: HttpClient) { }

  assign(tagId:number, songId:number):Observable<Tag>{
    let assignTagAPI = `${environment.API_ENDPOINT}/songs/${songId}/tag/${tagId}`;
    return this.http.post<Tag>(assignTagAPI,null);
  }

  remove(tagId:number, songId:number) {
    let removeTagAPI = `${environment.API_ENDPOINT}/songs/${songId}/tag/${tagId}`;
    return this.http.delete(removeTagAPI);
  }

}
