import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Image } from "app/shared-models/image";
import { CroppedImage } from "app/shared/entities/cropped-image";
import { animate, style, transition, trigger } from "@angular/animations";

declare var Croppie: any;
@Component({
  selector: "nl-image-cropper",
  templateUrl: "./image-cropper.component.html",
  styleUrls: ["./image-cropper.component.css"],
  animations: [
    trigger("displayImageCropper", [
      transition("void => *", [
        style({ transform: "translateY(-100%)" }),
        animate(100),
      ]),
      transition("* => void", [
        animate(100, style({ transform: "translateY(-100%)" })),
      ]),
    ]),
  ],
})
export class ImageCropperComponent {
  @Input() cropLength: any;
  @Input() cropHeight: any;
  @Input() cropRatio: any;
  private imageCropper: ElementRef;
  @ViewChild("imagecropper") set content(
    imageCropper: ElementRef
  ) {
    if (imageCropper) {
      this.imageCropper = imageCropper;
      this.croppie = new Croppie(this.imageCropper.nativeElement, {
        viewport: {
          width: this.cropLength * this.cropRatio,
          height: this.cropHeight * this.cropRatio,
        },
        showZoomer: true,
        enableOrientation: true,
        checkCrossOrigin: false,
      });

      this.croppie.bind({
        url: this.image.imageUrl + "?" + Date.now.toString(), //due to caching, it was causing cors problem
      });
    }
  }

  croppie: any;

  private _image: Image;
  @Input() displayImageCropper: boolean;

  @Input() set image(image: Image) {
    this._image = image;
  }

  get image(): Image {
    return this._image;
  }
  @Output() displayImageCropperChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() imageCropped: EventEmitter<CroppedImage> =
    new EventEmitter<CroppedImage>();
  constructor() {}

  save(): void {
    this.croppie
      .result({
        type: "blob",
        size: {
          width: this.cropLength / this.cropRatio,
          height: this.cropHeight / this.cropRatio,
        },
        format: "jpeg",
      })
      .then((blob) => {
        let croppedImageFile = this.blobToFile(blob, "croppedimage.jpeg");
        let croppedImage = new CroppedImage();
        croppedImage.inputImage = this.image;
        croppedImage.croppedFile = croppedImageFile;
        this.imageCropped.emit(croppedImage);
        this.close();
      });
  }
  close(): void {
    this.displayImageCropperChange.emit(false);
  }

  blobToFile(theBlob: Blob, fileName: string): File {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>b;
  }
}
