import { Injectable } from "@angular/core";
import { UserIntro } from "app/shared-models/user-intro";
import { Subject, Observable } from "rxjs";

@Injectable()
export class UserFollowChangeEventService {
  private onUserFollowingAdded = new Subject<UserIntro>();
  private onUserFollowingRemoved = new Subject<UserIntro>();
  constructor() {}
  followingUserAdded(userIntro: UserIntro): void {
    this.onUserFollowingAdded.next(userIntro);
  }
  onFollowingUserAdded(): Observable<UserIntro> {
    return this.onUserFollowingAdded.asObservable();
  }
  followingUserRemoved(userIntro: UserIntro): void {
    this.onUserFollowingRemoved.next(userIntro);
  }
  onFollowingUserRemoved(): Observable<UserIntro> {
    return this.onUserFollowingRemoved.asObservable();
  }
}
