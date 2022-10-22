import { SocialNotification } from "app/shared/entities/social-notification";
import { PagedResponse } from "app/shared-models/paged-response";

export class PagedNotificationResponse extends PagedResponse<SocialNotification> {
  unReadNotificationsCount: number;
}
