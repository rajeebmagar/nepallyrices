import { Image } from "app/shared-models/image";
import { Observable } from "rxjs";
import { PagedResponse } from "app/shared-models/paged-response";

export interface GetExistingPictureService {
  type: string;
  entityIds: string[];
  get(): Observable<PagedResponse<Image>>;
}
