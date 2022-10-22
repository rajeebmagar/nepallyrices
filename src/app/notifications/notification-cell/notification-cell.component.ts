import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SocialNotification } from "app/shared/entities/social-notification";
import { NotificationsService } from "app/notifications/notifications.service";
import { Router } from "@angular/router";
import { NotificationToUrlPipe } from "app/shared/pipes/notification-to-url.pipe";

@Component({
  selector: 'nl-notification-cell',
  templateUrl: './notification-cell.component.html',
  styleUrls: ['./notification-cell.component.css']
})
export class NotificationCellComponent implements OnInit {
  _markedAsRead: boolean;

  @Input() notification: SocialNotification;
  @Output() markedAsRead: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
    private notificationToUrlPipe: NotificationToUrlPipe) { }

  ngOnInit() {
  }
  markAsReadAndNavigate(): void {
    if (!this._markedAsRead) {
      this.markAsRead();
      this.router.navigateByUrl(this.notificationToUrlPipe.transform(this.notification));
    }
    this._markedAsRead = false;
  }
  markAsRead(): void {
    if (!this.notification.readByUser) {
      this.notificationsService.markAsRead(this.notification.notificationId,
        this.notification.objectType).subscribe(response => {
          this.notification.readByUser = true;
          this.markedAsRead.emit(true);
        });

    }
    this._markedAsRead = true;
  }
   
}
