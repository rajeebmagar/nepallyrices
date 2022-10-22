import { Component, OnInit, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "app/shared/entities/user";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { NotificationsService } from "app/notifications/notifications.service";
import { DisplayNotificationService } from "app/notifications/display-notification.service";
import { UserAccountService } from "app/user-account-services/user-account.service";

@Component({
  selector: "nl-navigation-bar",
  templateUrl: "./navigation-bar.component.html",
  styleUrls: ["./navigation-bar.component.css"],
})
export class NavigationBarComponent implements OnInit {
  unReadNotificationsCount: number;
  notificationCount: number;

  pageTitle: string = "Nepalyrics";
  userAuthenticated: boolean;
  user: User;
  isAdmin = false;
  isLoggedIn = false;
  constructor(
    private authService: UserAuthService,
    private router: Router,
    private userAccountAccessService: UserAccountAccessService,
    private userAccountService: UserAccountService,
    private userAuthService: UserAuthService,
    private notificationsService: NotificationsService,
    private displayNotificationService: DisplayNotificationService
  ) {}
  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.isLoggedIn = this.authService.isUserLoggedIn();
    this.authService.userLoggedInEvent.subscribe((user) =>
      this.userLoggedInEventHandler(user)
    );
    this.user = this.authService.getUser();
    if (this.isLoggedIn) {
      this.getNotificationCount();
    }
  }
  getNotificationCount(): void {
    this.notificationsService
      .getNotifications()
      .subscribe((pagedNotification) => {
        this.notificationCount = pagedNotification.totalCount;
        this.unReadNotificationsCount =
          pagedNotification.unReadNotificationsCount;
      });
  }
  markedAsRead(): void {
    this.unReadNotificationsCount--;
  }
  displayUserNotifications(event: MouseEvent): void {
    this.displayNotificationService.show(event.screenX);
  }
  userLoggedInEventHandler(user: User) {
    this.user = user;
    this.isAdmin = this.authService.isAdmin();
    this.isLoggedIn = this.authService.isUserLoggedIn();
    if (this.isLoggedIn) {
      this.getNotificationCount();
      this.userAccountService
        .getUserProfileByName(this.user.userName)
        .subscribe((profile) => {
          this.user.profilePicture = profile.profilePicture;
          this.userAuthService.setUser(this.user, false); // set user with profile picture
        });
    }
  }

  logOut(): void {
    this.authService.clear();
    this.router.navigateByUrl("/");
  }

  showLogin(): void {
    this.userAccountAccessService.showLogin();
  }
  showRegister(): void {
    this.userAccountAccessService.showRegister();
  }

  public navIsTransparent: boolean = true;
  thresholdTop = 70;
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (this.navIsTransparent && number > this.thresholdTop) {
      this.navIsTransparent = false;
    } else if (!this.navIsTransparent && number < this.thresholdTop) {
      this.navIsTransparent = true;
    }
  }
}
