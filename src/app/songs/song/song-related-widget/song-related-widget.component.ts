import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { SongIntro } from "app/shared-models/song-intro";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";

@Component({
  selector: "nl-song-related-widget",
  templateUrl: "./song-related-widget.component.html",
  styleUrls: ["./song-related-widget.component.css"],
})
export class SongRelatedWidgetComponent {
  @Input() relatedSongs: SongIntro[];
  @Output() showAll = new EventEmitter();
  constructor(
    private route: ActivatedRoute,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService
  ) {}

  requestToShowAll(): void {
    this.showAll.emit();
  }
}
