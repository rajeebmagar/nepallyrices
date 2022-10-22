import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import { Image } from "app/shared-models/image";
import { environment } from "environments/environment";
import { SetPictureService } from "app/shared/services/set-picture-service";
import { CroppingRequest } from "app/shared-module/cropping-request";
import { ImageSelectorService } from "../services/image-selector.service";
import { FileUploadService } from "../services/file-upload.service";
import { ImageCropperService } from "../services/image-cropper.service";
import { GetExistingPictureService } from "app/shared-services/get-existing-picture.service";
@Component({
  selector: "nl-picture-uploader",
  templateUrl: "./picture-uploader.component.html",
  styleUrls: ["./picture-uploader.component.css"],
  providers: [FileUploadService],
})
export class PictureUploaderComponent<T> implements OnInit {
  private _entity: T;
  @Input() toolTipText: string;
  @Input() existingPictureEntityIds: string[];
  @Input() set entity(entity: T) {
    this._entity = entity;
    this.resetState();
  }
  get entity(): T {
    return this._entity;
  }
  @Input() setPictureService: SetPictureService<T>;
  @Input() getExistingPictureService: GetExistingPictureService;
  @Input() imageSelectorService: ImageSelectorService;
  @Input() enableReposition: boolean;
  @Input() enableCropping: boolean;
  @Input() defaultImage: Image;
  @Input() cropLength: Number = 300;
  @Input() cropHeight: Number = 300;
  @Input() cropRatio: Number = 0.5;

  @Output() uploadedPicture = new EventEmitter<Image>();
  @Output() saved = new EventEmitter<boolean>();
  @Output() repositioned = new EventEmitter<boolean>();
  @Output() saving = new EventEmitter<boolean>();
  @Output() editing = new EventEmitter<boolean>();

  @ViewChild("fileInput")
  fileInput: ElementRef;

  uploadedCoverPicture: Image;
  inputPictureForCrop: Image;
  uploadCoverPictureInProgress = false;
  savingCoverPicture = false;
  uploadedCoverPictureProgress = 0;
  repositionOnly = false;
  imageCropped = false;

  constructor(
    private fileUploadService: FileUploadService,
    private imageCropperService: ImageCropperService,
    private ref: ChangeDetectorRef
  ) {}

  resetState(): void {
    this.uploadCoverPictureInProgress = false;
    this.savingCoverPicture = false;
    this.uploadedCoverPictureProgress = 0;
    this.ref.markForCheck();
    this.ref.detectChanges();
  }
  openFileDialog() {
    this.fileInput.nativeElement.click();
  }
  ngOnInit() {
    if (this.enableCropping) {
      this.imageCropperService.onImageCropped$.subscribe((croppedImage) => {
        if (
          this.inputPictureForCrop &&
          croppedImage.inputImage.id == this.inputPictureForCrop.id
        )
          this.onPictureCropped(croppedImage.croppedFile);
      });
      this.imageSelectorService.onImageSelected$.subscribe((selectedImage) => {
        if (this.getExistingPictureService.type === selectedImage.type) {
          this.uploadedCoverPicture = selectedImage.image;
          this.editing.emit(true);
          this.onImageUploaded(selectedImage.image);
        }
      });
    }
    this.fileUploadService.onUploadError$.subscribe((response) => {
      alert("error:" + response);
      this.uploadCoverPictureInProgress = false;
    });
    this.fileUploadService.onUploadProgress$.subscribe((progress) => {
      this.uploadedCoverPictureProgress = progress;
      this.ref.markForCheck();
      this.ref.detectChanges();
    });
    this.fileUploadService.onUploadCompleted$.subscribe((response) => {
      this.uploadedCoverPicture = <Image>response;
      this.uploadCoverPictureInProgress = false;

      if (this.enableCropping && !this.imageCropped) {
        this.showImageCropper(this.uploadedCoverPicture);
      } else {
        this.onImageUploaded(this.uploadedCoverPicture);
      }
    });
  }
  onImageUploaded(image: Image): void {
    this.imageCropped = false;
    this.setSavingCoverPicture(true);
    this.uploadedPicture.emit(image);
  }
  onPictureCropped(croppedImageFile: File): void {
    this.imageCropped = true;
    this.resetState();
    this.uploadCoverPictureWithProgress(croppedImageFile);
  }
  cropExistingImage() {
    if (this.defaultImage) {
      this.showImageCropper(this.defaultImage);
    } else console.error("defaultImage is not defined for cropping.");
  }
  prepareForReposition() {
    this.setSavingCoverPicture(true);
    this.repositionOnly = true;
  }
  coverPictureSelected(event: any): void {
    let coverPictureFile = <File>event.target.files[0];
    if (coverPictureFile) {
      this.resetState();
      this.uploadCoverPictureWithProgress(coverPictureFile);
    }
  }
  uploadCoverPictureWithProgress(coverPictureFile: File): void {
    this.uploadCoverPictureInProgress = true;
    this.editing.emit(true);
    var uploadPhotographAPI = `${environment.API_ENDPOINT}/photographs/upload`;
    this.fileUploadService.uploadWithProgress(
      uploadPhotographAPI,
      coverPictureFile
    );
  }
  setEditingImage(image: Image): void {
    this.uploadedCoverPicture = image;
    this.setSavingCoverPicture(true);
  }
  setSavingCoverPicture(saving: boolean): void {
    this.savingCoverPicture = saving;
    this.saving.emit(saving);
  }
  setCoverPicture() {
    this.setPictureService
      .setEntityPicture(
        this.entity,
        this.uploadedCoverPicture,
        this.repositionOnly
      )
      .subscribe((response) => {
        this.editing.emit(false);
        this.setSavingCoverPicture(false);
        if (this.repositionOnly) {
          this.repositioned.emit(true);
          this.repositionOnly = false;
        } else {
          this.saved.emit(true);
        }
      });
  }
  showImageCropper(image: Image): void {
    this.inputPictureForCrop = image;
    let croppingRequest = new CroppingRequest();

    croppingRequest.image = image;
    croppingRequest.cropLength = this.cropLength;
    croppingRequest.cropHeight = this.cropHeight;
    croppingRequest.cropRatio = this.cropRatio;
    this.imageCropperService.showImageCropper(croppingRequest);
  }

  chooseExistingImage(): void {
    this.getExistingPictureService.entityIds = this.existingPictureEntityIds;
    this.imageSelectorService.showImageSelector(this.getExistingPictureService);
  }

  cancelsetCoverPictureUpdate() {
    this.editing.emit(false);
    this.setSavingCoverPicture(false);
    this.repositionOnly = false;
    this.uploadedCoverPicture = null;
    this.saved.emit(false);
  }
}
