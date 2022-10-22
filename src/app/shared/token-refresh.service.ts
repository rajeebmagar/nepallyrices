import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable()
export class TokenRefreshService {
  private requestToRefreshToken = new Subject();
  requestToRefreshToken$ = this.requestToRefreshToken.asObservable();
  constructor() { }
  refreshToken():void{
    this.requestToRefreshToken.next();
  }
}
