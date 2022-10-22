import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SiteLinksComponent } from "./site-links/site-links.component";
import { RouterModule } from "@angular/router";
import { OptionMenuComponent } from "./option-menu/option-menu.component";
import { IntroViewCellComponent } from "./intro-view-cell/intro-view-cell.component";
import { TinyAudioPlayerComponent } from "./tiny-audio-player/tiny-audio-player.component";
import { CommaSeparatedAnchorsComponent } from "./comma-separated-anchors/comma-separated-anchors.component";
import { PictureSelectorComponent } from "./picture-selector/picture-selector.component";
import { PictureUploaderComponent } from "./picture-uploader/picture-uploader.component";
import { AngularMaterialModule } from "app/material.module";
import { IntroListViewComponent } from "./intro-list-view/intro-list-view.component";
import { InlineEditorModule } from "app/shared/modules/inline-editor/inline-editor.module";
import { ShareButtonsModule } from "app/shared/modules/share-button.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SpinnerComponent } from "./spinner/spinner.component";
import { HomeSlickSliderCellComponent } from "./home-slick-slider-cell/home-slick-slider-cell.component";
import { HomeSlickSliderComponent } from "./home-slick-slider/home-slick-slider.component";
import { TopSingersOfTheDayComponent } from "./top-singers-of-the-day/top-singers-of-the-day.component";
import { TopSingersOfTheDayService } from "./top-singers-of-the-day/top-singers-of-the-day.service";
import { SharedModelsModule } from "app/shared-models/shared-models.module";
import { TagInputOptionComponent } from "./tag-input-option/tag-input-option.component";
import { ToDatePipe } from "./pipes/to-date.pipe";
import { ArtistIntroToIntroViewContentPipe } from "./pipes/artist-intro-to-intro-view-content.pipe";
import { FileUploadService } from "./services/file-upload.service";
import { ImageCropperService } from "./services/image-cropper.service";
import { ImageSelectorService } from "./services/image-selector.service";
import { TagsToAnchorsPipe } from "./pipes/tags-to-anchors.pipe";
import { TagToTagInputOptionPipe } from "./pipes/tag-to-tag-input-option.pipe";
import { TruncatePipe } from "./pipes/truncate.pipe";
import { ImageDefaultUrlPipe } from "./pipes/image-default-url.pipe";
import { SafeUrlPipe } from "./pipes/safe-url-pipe";
import { AudioSliderComponent } from "./audio-slider/audio-slider.component";
import { ImageCropperComponent } from "./image-cropper/image-cropper.component";
import { MinutesColonSecondsPipe } from "./pipes/minutes-colon-seconds.pipe";
import { SharedServicesModule } from "app/shared-services/shared-services.module";
import { TagInputModule } from "ngx-chips";
import { SharedAccountModule } from "app/shared-account/shared-account.module";

@NgModule({
  declarations: [
    SiteLinksComponent,
    OptionMenuComponent,
    IntroListViewComponent,
    IntroViewCellComponent,
    TinyAudioPlayerComponent,
    CommaSeparatedAnchorsComponent,
    PictureSelectorComponent,
    PictureUploaderComponent,
    ToDatePipe,
    SpinnerComponent,
    HomeSlickSliderComponent,
    HomeSlickSliderCellComponent,
    TopSingersOfTheDayComponent,
    ArtistIntroToIntroViewContentPipe,
    TagInputOptionComponent,
    TagsToAnchorsPipe,
    TagToTagInputOptionPipe,
    TruncatePipe,
    ImageDefaultUrlPipe,
    SafeUrlPipe,
    AudioSliderComponent,
    ImageCropperComponent,
    MinutesColonSecondsPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TagInputModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    InlineEditorModule,
    ShareButtonsModule,
    SharedModelsModule,
    SharedServicesModule,
    SharedAccountModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TagInputModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    InlineEditorModule,
    ShareButtonsModule,
    SharedServicesModule,
    SiteLinksComponent,
    OptionMenuComponent,
    IntroListViewComponent,
    IntroViewCellComponent,
    TinyAudioPlayerComponent,
    CommaSeparatedAnchorsComponent,
    PictureSelectorComponent,
    PictureUploaderComponent,
    ToDatePipe,
    SpinnerComponent,
    HomeSlickSliderComponent,
    HomeSlickSliderCellComponent,
    TopSingersOfTheDayComponent,
    ArtistIntroToIntroViewContentPipe,
    TagInputOptionComponent,
    TagsToAnchorsPipe,
    TagToTagInputOptionPipe,
    TruncatePipe,
    ImageDefaultUrlPipe,
    SafeUrlPipe,
    AudioSliderComponent,
    ImageCropperComponent,
    MinutesColonSecondsPipe,
    SharedAccountModule,
  ],
  providers: [ArtistIntroToIntroViewContentPipe, TopSingersOfTheDayService],
})
export class SharedModule {}
