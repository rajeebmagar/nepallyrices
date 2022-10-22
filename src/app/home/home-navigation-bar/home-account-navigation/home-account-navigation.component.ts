import { Component, OnInit } from "@angular/core";
import { User } from "app/shared/entities/user";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { NotificationsService } from "app/notifications/notifications.service";
import { DisplayNotificationService } from "app/notifications/display-notification.service";
import { UserAccountService } from "app/user-account-services/user-account.service";
import { AuthService } from "app/identity/auth.service";

@Component({
  selector: "nl-home-account-navigation",
  templateUrl: "./home-account-navigation.component.html",
  styleUrls: ["./home-account-navigation.component.css"],
})
export class HomeAccountNavigationComponent implements OnInit {
  unReadNotificationsCount: number;
  notificationCount: number;

  showUserAccount: boolean = false;
  showRegisterTab: boolean = false;
  isAdmin = false;
  isLoggedIn = false;
  user: User;
  constructor(
    private authService: AuthService,
    private userAuthService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService,
    private userAccountService: UserAccountService,
    private notificationsService: NotificationsService,
    private displayNotificationService: DisplayNotificationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.userAuthService.isAdmin();
    this.isLoggedIn = this.userAuthService.isUserLoggedIn();
    this.user = this.userAuthService.getUser();
    this.userAuthService.userLoggedInEvent.subscribe((loggedInUser) => {
      this.isLoggedIn = this.userAuthService.isUserLoggedIn();
      this.user = loggedInUser;
      if (loggedInUser) {
        this.getNotificationCount();
        this.userAccountService
          .getUserProfileByName(loggedInUser.userName)
          .subscribe((profile) => {
            this.user.profilePicture = profile.profilePicture;
            this.userAuthService.setUser(this.user, false); // set user with profile picture
          });
      } else {
        this.notificationCount = 0;
      }
      this.isAdmin = this.userAuthService.isAdmin();
    });

    if (this.isLoggedIn) {
      this.getNotificationCount();
    } else {
      this.notificationCount = 0;
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
  logOut(): void {
    this.userAuthService.clear();
  }

  showLogIn(): void {
    this.userAccountAccessService.showLogin();
  }

  showRegister(): void {
    this.userAccountAccessService.showRegister();
  }
  displayUserNotifications(event: MouseEvent): void {
    this.displayNotificationService.show(event.screenX);
  }
}
