import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {Tag} from "../../shared/entities/tag";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AddNewTagService {

  constructor(private http: HttpClient) { }

  add(tagName: string): Observable<Tag> {
    let newTagAPI = `${environment.API_ENDPOINT}/tags/new`;
    return this.http.post<Tag>(newTagAPI, { name: tagName });
  }

}
