import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { SongAudio } from "app/shared-models/song-audio";

@Component({
  selector: "nl-intro-view-cell",
  templateUrl: "./intro-view-cell.component.html",
  styleUrls: ["./intro-view-cell.component.css"],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroViewCellComponent implements OnInit {
  @Input() content: IntroViewContent;
  @Input() thumbnailSize: number;

  isPlaying = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    //this.changeDetectorRef.detach();
  }
  executeCommand(): void {
    this.content.quickCommand.command.execute();
  }
  changedPlayingState(isPlaying: boolean): void {
    this.isPlaying = isPlaying;
  }
}
