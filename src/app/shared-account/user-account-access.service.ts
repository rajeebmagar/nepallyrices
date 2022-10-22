import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/internal/Subject';

@Injectable()
export class UserAccountAccessService {

  private onShowLogin = new Subject();
  private onShowRegister = new Subject();
  redirectRoute: string;
  onShowLogin$ = this.onShowLogin.asObservable();
  onShowRegister$ = this.onShowRegister.asObservable();

  constructor(private router: Router) {
  }

  redirected(): void {
    this.redirectRoute = null;
  }

  showLogin(redirectRoute?: string): void {
    if (redirectRoute) {
      this.redirectRoute = redirectRoute;
    } else {
      this.redirectRoute = this.router.url;
    }
    this.onShowLogin.next();
    this.scrollWindowToTop();
  }

  showRegister(): void {
    this.onShowRegister.next();
    this.scrollWindowToTop();
  }

  scrollWindowToTop(): void {
    window.scrollTo(0, 0);
  }
}
