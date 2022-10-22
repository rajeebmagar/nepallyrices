import { Component, OnInit, Input } from "@angular/core";
import { EmbeddedVideo } from "app/shared/entities/embedded-video";
import { NewEmbeddedVideoService } from "app/songs/song/new-embedded-video/new-embedded-video.service";

@Component({
  moduleId: module.id,
  selector: "nl-embeded-videos",
  styleUrls: ["embeded-videos.css"],
  templateUrl: "embeded-videos.html",
  providers: [NewEmbeddedVideoService],
})
export class EmbeddedVideos {
  constructor(private newEmbeddedVideoService: NewEmbeddedVideoService) {}
  @Input() isEditable: boolean;
  @Input() embeddedVideos: EmbeddedVideo[];
  remove(embeddedVideo: EmbeddedVideo): void {
    if (confirm("Are you sure you want to remove video?")) {
      this.newEmbeddedVideoService
        .remove(embeddedVideo.embeddedVideoId)
        .subscribe((response) => {
          this.embeddedVideos.splice(
            this.embeddedVideos.indexOf(embeddedVideo)
          );
        });
    }
  }
}
