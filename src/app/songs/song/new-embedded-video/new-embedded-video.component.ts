import { Component, OnInit, Input } from "@angular/core";
import { Song } from "app/shared/entities/song";
import { NewEmbeddedVideoService } from "app/songs/song/new-embedded-video/new-embedded-video.service";
import { MatSnackBar } from "@angular/material/snack-bar";
@Component({
  selector: "nl-new-embedded-video",
  templateUrl: "./new-embedded-video.component.html",
  styleUrls: ["./new-embedded-video.component.css"],
})
export class NewEmbeddedVideoComponent implements OnInit {
  @Input() song: Song;
  youtubeUrl: string;
  isAddingNew = false;
  constructor(
    public snackBar: MatSnackBar,
    private newEmbeddedVideoService: NewEmbeddedVideoService
  ) {}

  ngOnInit() {}
  changeToAddMode(): void {
    this.isAddingNew = true;
  }
  changeToNormalMode(): void {
    this.isAddingNew = false;
  }
  addNewVideo(): void {
    let youTubeId = this.fetchYoutubeId(this.youtubeUrl);
    if (youTubeId) {
      this.newEmbeddedVideoService
        .add(this.song.songId, youTubeId)
        .subscribe((newEmbeddedVideo) => {
          if (!this.song.embeddedVideos) {
            this.song.embeddedVideos = [];
          }
          this.song.embeddedVideos.push(newEmbeddedVideo);
          this.changeToNormalMode();
        });
    } else {
      //this.snackBar.open('invalid url');
      alert("invalid youtube url");
    }
  }
  fetchYoutubeId(youtubeUrl: string): string {
    var regularExpression =
      /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/i;
    let results = regularExpression.exec(youtubeUrl);
    if (results && results.length > 0) return results[results.length - 1];
    return null;
  }
}
