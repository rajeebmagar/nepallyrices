import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UserIntro } from "app/shared-models/user-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { UserWithFollowCommandFactory } from "app/shared/commands/factories/user-with-follow-command-factory";
import { PaginationService } from "app/shared/services/pagination.service";
import { NotificationsService } from "app/notifications/notifications.service";
import { SocialNotification } from "app/shared/entities/social-notification";

@Component({
  selector: "nl-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  loadingMoreNotifications: boolean = false;
  scrollDiffMax: number = 275;

  notifications: SocialNotification[];
  hasMore: boolean;
  pagedNotifications: PagedResponse<SocialNotification>;

  private _displayNotifications: boolean;
  @Input() set displayNotifications(displayNotifications: boolean) {
    this._displayNotifications = displayNotifications;
  }

  get displayNotifications(): boolean {
    return this._displayNotifications;
  }

  @Input() notificationPositionX: number;
  @Output() displayNotificationsChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Output() markedAsRead: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private notificationsService: NotificationsService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.notificationsService
      .getNotifications()
      .subscribe((pagedNotifications) => {
        this.pagedNotifications = pagedNotifications;
        this.hasMore = this.paginationService.hasNext(pagedNotifications.links);
        this.notifications = pagedNotifications.items;
      });
  }

  getMoreNotifications(): void {
    let notificationUrl = this.paginationService.getNextPageUrl(
      this.pagedNotifications.links
    );
    if (notificationUrl) {
      this.paginationService
        .getNextPageResponse<SocialNotification>(notificationUrl)
        .subscribe((pagedNotifications) => {
          this.pagedNotifications = pagedNotifications;
          this.hasMore = this.paginationService.hasNext(
            pagedNotifications.links
          );
          let notifications = new Array<SocialNotification>();
          notifications = notifications.concat(this.notifications);
          for (let socialNotification of pagedNotifications.items) {
            notifications.push(socialNotification);
          }
          this.notifications = notifications;
          this.loadingMoreNotifications = false;
        });
    }
  }

  notificationScrolled(event: any): void {
    if (
      !this.loadingMoreNotifications &&
      this.hasMore &&
      this.isScrolledToBottom(event)
    ) {
      this.loadingMoreNotifications = true;
      this.getMoreNotifications();
    }
  }

  isScrolledToBottom(event: any): boolean {
    let scrolledBottom =
      this.scrollDiffMax >=
      event.srcElement.scrollHeight - event.srcElement.scrollTop;
    return scrolledBottom;
  }

  emitMarkedAsRead(): void {
    this.markedAsRead.emit(true);
  }

  close(): void {
    this.displayNotificationsChange.next(false);
  }
}
