import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {Tag} from "../../shared/entities/tag";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FindTagByNameService {

  constructor(private http: HttpClient) { }

  find(tag:string):Observable<Tag[]>{
    let findTagByName = `${environment.API_ENDPOINT}/tags/name/${tag}`;
    return this.http.get<Tag[]>(findTagByName);
  }

}
