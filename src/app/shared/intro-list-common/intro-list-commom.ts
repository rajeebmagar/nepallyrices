import { Router } from "@angular/router";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IntroViewContent } from "app/shared-models/intro-view-content";

@Component({
  moduleId: module.id,
  selector: "nl-related-list-common",
  templateUrl: "intro-list-common.html",
})
export class IntroListCommon {
  @Input()
  introContents: IntroViewContent[];

  @Input()
  hasMore: boolean;

  @Output() moreData = new EventEmitter();
  @Output() showAll = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit() {}

  askForMoreData(): void {
    this.moreData.emit();
  }
  onClick(url) {
    this.router.navigate([url]);
  }
  loadMore() {
    this.showAll.emit();
  }
}
