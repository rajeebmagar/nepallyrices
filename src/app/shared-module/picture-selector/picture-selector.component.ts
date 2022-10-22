import {
  OnInit,
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { PagedResponse } from "app/shared-models/paged-response";
import { Image } from "app/shared-models/image";
import { PaginationService } from "app/shared/services/pagination.service";
import { SelectedImage } from "app/shared/entities/selected-image";
import { animate, style, transition, trigger } from "@angular/animations";
import { GetExistingPictureService } from "app/shared-services/get-existing-picture.service";

@Component({
  selector: "nl-picture-selector",
  templateUrl: "./picture-selector.component.html",
  styleUrls: ["./picture-selector.component.css"],
  animations: [
    trigger("displayImageSelector", [
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
export class PictureSelectorComponent implements OnInit {
  pictures: Image[];
  hasMore: boolean;
  pagedPictures: PagedResponse<Image>;
  private _getExistingPictureService: GetExistingPictureService;
  @Input() displayImageSelector: boolean;
  @Output() imageSelected: EventEmitter<SelectedImage> =
    new EventEmitter<SelectedImage>();
  @Input() set getExistingPictureService(
    getExistingPictureService: GetExistingPictureService
  ) {
    if (getExistingPictureService) {
      this._getExistingPictureService = getExistingPictureService;
    }
  }
  get getExistingPictureService(): GetExistingPictureService {
    return this._getExistingPictureService;
  }
  @Output() displayImageSelectorChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  constructor(private paginationService: PaginationService) {}

  ngOnInit() {}
  loadExistingPictures(): void {
    if (this.getExistingPictureService) {
      this.pictures = [];
      this.getExistingPictureService.get().subscribe((pagedPictures) => {
        this.addPictures(pagedPictures);
      });
    }
  }
  getMore(): void {
    let nextPageUrl = this.paginationService.getNextPageUrl(
      this.pagedPictures.links
    );
    if (nextPageUrl) {
      this.paginationService
        .getNextPageResponse<Image>(nextPageUrl)
        .subscribe((pagedResponse) => {
          this.addPictures(pagedResponse);
        });
    }
  }
  addPictures(pagedPictures: PagedResponse<Image>) {
    this.pagedPictures = pagedPictures;
    this.hasMore = this.paginationService.hasNext(this.pagedPictures.links);
    let newPictures = new Array<Image>();
    newPictures = newPictures.concat(this.pictures);
    for (let picture of this.pagedPictures.items) {
      newPictures.push(picture);
    }
    this.pictures = newPictures;
  }
  pictureSelected(selectedPicture: Image): void {
    let selectedImage = new SelectedImage();
    selectedImage.image = selectedPicture;
    selectedImage.type = this.getExistingPictureService.type;
    this.imageSelected.emit(selectedImage);
    this.close();
  }
  close(): void {
    this.displayImageSelectorChange.emit(false);
  }
}
