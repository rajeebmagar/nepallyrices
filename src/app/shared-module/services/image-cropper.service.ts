import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Image } from "app/shared-models/image";
import { CroppedImage } from "app/shared/entities/cropped-image";
import { CroppingRequest } from "app/shared-module/cropping-request";
@Injectable()
export class ImageCropperService {
  private requestToShowImageCropper = new Subject<CroppingRequest>();
  requestToShowImageCropper$ = this.requestToShowImageCropper.asObservable();

  private onImageCropped = new Subject<CroppedImage>();
  onImageCropped$ = this.onImageCropped.asObservable();
  constructor() {}

  showImageCropper(croppingRequest: CroppingRequest): void {
    this.requestToShowImageCropper.next(croppingRequest);
  }
  imageCropped(croppedImage: CroppedImage): void {
    this.onImageCropped.next(croppedImage);
  }
}
