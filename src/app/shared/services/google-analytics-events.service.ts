import { Injectable } from "@angular/core";
import { UserAuthService } from "app/identity/user-auth-service.service";
declare let ga: Function;
@Injectable()
export class GoogleAnalyticsEventsService {
  constructor(private authService: UserAuthService) {}
  public emitEvent(
    eventCategory: string,
    eventAction: string,
    eventLabel?: string,
    eventValue?: number
  ) {
    this.setUser();
    ga("send", "event", {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue,
    });
  }

  public sendPageView(pageRoute: string): void {
    this.setUser();
    ga("set", "page", pageRoute);
    ga("send", "pageview");
  }

  public setUser(): void {
    if (this.authService.isUserLoggedIn()) {
      let user = this.authService.getUser();
      if (user) {
        ga("set", "userId", user.id);
      }
    }
  }
}
