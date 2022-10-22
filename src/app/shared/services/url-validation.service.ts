import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class UrlValidationService {

  constructor(private http:HttpClient) { 
  }
  isValidUrl(url:string):Observable<boolean>{
    return this.http.get<boolean>(url);
  }
}
