import { Image } from "app/shared-models/image";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
export interface SetPictureService<T> {
  setEntityPicture(entity: T, profilePicture: Image, repositionOnly: boolean);
}
