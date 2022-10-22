import { Component, OnInit } from "@angular/core";
import { User } from "app/shared/entities/user";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { AuthService } from "app/identity/auth.service";

@Component({
  selector: "nl-footer-banner",
  templateUrl: "./footer-banner.component.html",
  styleUrls: ["./footer-banner.component.css"],
})
export class FooterBannerComponent implements OnInit {
  user: User;
  constructor(
    private authService: AuthService,
    private userAuthService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService
  ) {}
  ngOnInit() {
    this.user = this.userAuthService.getUser();
    this.userAuthService.userLoggedInEvent.subscribe((user) => {
      this.userLoggedInEventHandler(user);
    });
  }

  userLoggedInEventHandler(user: User) {
    this.user = this.userAuthService.getUser();
  }
  showLogin(): void {
    this.userAccountAccessService.showLogin();
  }
  showRegister(): void {
    this.userAccountAccessService.showRegister();
  }
}
