import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IntroViewContent } from "app/shared-models/intro-view-content";
@Injectable()
export class CommandExecuteNotificationService {
  private onExecutedSuccessfully = new Subject<IntroViewContent>();
  executedSuccessfully$ = this.onExecutedSuccessfully.asObservable();
  constructor() {}
  executed(introViewContent: IntroViewContent): void {
    this.onExecutedSuccessfully.next(introViewContent);
  }
}
