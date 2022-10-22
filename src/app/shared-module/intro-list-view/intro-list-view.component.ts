import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IntroViewContent } from "app/shared-models/intro-view-content";
@Component({
  selector: "nl-intro-list-view",
  templateUrl: "./intro-list-view.component.html",
  styleUrls: ["./intro-list-view.component.css"],
})
export class IntroListViewComponent implements OnInit {
  @Input()
  contents: IntroViewContent[];

  @Input()
  hasMore: boolean;

  @Output() moreData = new EventEmitter();

  isPlaying = true;

  ngOnInit() {}
  askForMoreData(): void {
    this.moreData.emit();
  }
}
