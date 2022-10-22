import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { IntroViewContent } from "app/shared-models/intro-view-content";

declare var $: any;

@Component({
  selector: "nl-home-slick-slider",
  templateUrl: "./home-slick-slider.component.html",
  styleUrls: ["./home-slick-slider.component.css"],
})
export class HomeSlickSliderComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  shouldRefreshSlider: boolean = false;

  @Input()
  private _contents: IntroViewContent[];

  @Input() set contents(contents: IntroViewContent[]) {
    if (this.hasContentsChanged(contents)) {
      this._contents = contents;
    }
  }

  get contents() {
    return this._contents;
  }

  @Input()
  name: string;

  @Input()
  darkBackground: boolean = false;

  constructor() {}

  hasContentsChanged(newContents: IntroViewContent[]) {
    if (this.contents === newContents) {
      return false;
    }
    if (!newContents || !this.contents) {
      return true;
    }
    if (this.contents.length !== newContents.length) {
      return true;
    }
    const previousContentMap = new Map<string, IntroViewContent>(
      this.contents.map((content) => [content.id, content])
    );
    for (var i = 0; i < newContents.length - 1; i++) {
      const newContent = newContents[i];
      const previousContent = previousContentMap.get(newContent.id);
      if (this.hasContentChanged(newContent, previousContent)) {
        return true;
      }
    }
    return false;
  }

  private hasContentChanged(
    newContent: IntroViewContent,
    previousContent: IntroViewContent
  ) {
    return (
      newContent.quickCommand.command.isExecuted !==
      previousContent.quickCommand.command.isExecuted
    );
  }

  ngOnInit() {}
  ngAfterViewChecked() {
    if (this.shouldRefreshSlider) {
      this.refreshSlickSlider();
      this.shouldRefreshSlider = false;
    }
  }
  ngAfterViewInit() {
    this.initializeSlickSlider();
  }
  private refreshSlickSlider() {
    $(`#${this.name}`).slick("unslick");
    setTimeout(() => this.initializeSlickSlider());
  }
  private initializeSlickSlider() {
    $(`#${this.name}`).slick(this.getSliderConfiguration());
  }

  private getSliderConfiguration(): any {
    return {
      infinite: false,
      slidesToShow: 7,
      slidesToScroll: 7,
      dots: true,
      dotsClass: this.darkBackground ? "slick-dots-for-dark" : "slick-dots",
      responsive: [
        {
          breakpoint: 1600,
          settings: {
            dots: true,
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 5,
            dotsClass: this.darkBackground
              ? "slick-dots-for-dark"
              : "slick-dots",
          },
        },
        {
          breakpoint: 1200,
          settings: {
            dots: true,
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            dotsClass: this.darkBackground
              ? "slick-dots-for-dark"
              : "slick-dots",
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 580,
          settings: {
            arrows: false,
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 320,
          settings: {
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
          },
        },
      ],
    };
  }
}
