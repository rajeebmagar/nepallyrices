import { UserIntro } from "app/shared-models/user-intro";
import { Image } from "app/shared-models/image";

export class SocialNotification {
  notificationId: number;
  actor: UserIntro;
  actionType: string;
  objectType: string;
  objectIdentifier: string;
  objectImage: Image;
  objectTitle: string;
  notifictionDate: string;
  notificationMoment: string;
  readByUser: boolean;
}
