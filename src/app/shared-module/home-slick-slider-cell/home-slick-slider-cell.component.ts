import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterContentInit,
} from "@angular/core";
import { IntroViewContent } from "app/shared-models/intro-view-content";

@Component({
  selector: "nl-home-slick-slider-cell",
  templateUrl: "./home-slick-slider-cell.component.html",
  styleUrls: ["./home-slick-slider-cell.component.css"],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeSlickSliderCellComponent implements OnInit {
  thumbnailImageSize: any = 229;
  readonly defaultThumbnailImageSize = 229;

  @Input() content: IntroViewContent;

  optionMenuDisplayed = false;
  isPlaying = false;

  constructor(private changeDector: ChangeDetectorRef) {}

  ngOnInit() {}
  changedPlayingState(isPlaying: boolean): void {
    this.isPlaying = isPlaying;
  }
  optionMenuDisplayChanged(displayed: boolean): void {
    this.optionMenuDisplayed = displayed;
    this.changeDector.markForCheck();
    this.changeDector.detectChanges();
  }
  executeQuickCommand(event: Event): void {
    this.dismissEvent(event);
    this.content.quickCommand.command.execute();
  }
  dismissEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
