import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { SelectedImage } from "app/shared/entities/selected-image";
import { GetExistingPictureService } from "app/shared-services/get-existing-picture.service";

@Injectable()
export class ImageSelectorService {
  private requestToShowImageSelector = new Subject<GetExistingPictureService>();
  private onImageSelected = new Subject<SelectedImage>();
  requestToShowImageSelector$ = this.requestToShowImageSelector.asObservable();
  onImageSelected$ = this.onImageSelected.asObservable();

  constructor() {}
  showImageSelector(
    getExistingPictureService: GetExistingPictureService
  ): void {
    this.requestToShowImageSelector.next(getExistingPictureService);
  }
  imageSelected(selectedImage: SelectedImage): void {
    this.onImageSelected.next(selectedImage);
  }
}
