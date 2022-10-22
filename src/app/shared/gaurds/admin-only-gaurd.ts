import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
@Injectable()
export class AdminOnlyGaurd implements CanActivate {
  constructor(
    private router: Router,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    var loggedIn = this.authService.isUserLoggedIn();
    if (!loggedIn) {
      this.userAccountAccessService.showLogin(state.url);
    }
    return this.authService.isAdmin();
  }
}
