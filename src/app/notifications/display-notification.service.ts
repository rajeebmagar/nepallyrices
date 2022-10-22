import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable()
export class DisplayNotificationService {

  
  private requestToShowNotifications = new Subject<number>();
  

  requestToShowNotifications$ = this.requestToShowNotifications.asObservable();
  constructor() { }
  show(xPosition:number): void {
      this.requestToShowNotifications.next(xPosition);
  }

}
