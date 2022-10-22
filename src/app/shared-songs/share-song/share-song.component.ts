import { Component, OnInit, Input } from "@angular/core";
import { Song } from "../../shared/entities/song";
import { ShareArgs } from "../../shared/modules/share-button.module";
import { appsetting } from "app-settings/app-setting";
import { Router } from "@angular/router";
import { ImageDefaultUrlPipe } from "app/shared-module/pipes/image-default-url.pipe";
import { TruncatePipe } from "app/shared-module/pipes/truncate.pipe";

@Component({
  selector: "nl-share-song",
  templateUrl: "./share-song.component.html",
  styleUrls: ["./share-song.component.css"],
})
export class ShareSongComponent implements OnInit {
  private _song: Song;

  @Input()
  public get song() {
    return this._song;
  }

  public set song(value: Song) {
    this._song = value;
    this.setShareArgs();
  }

  @Input() lyrical: boolean;

  shareArgs: ShareArgs;
  constructor(private router: Router) {}

  ngOnInit() {
    this.setShareArgs();
  }
  setShareArgs(): void {
    var image = new ImageDefaultUrlPipe().transform(
      (this.song.coverPhoto && this.song.coverPhoto.imageUrl) || "",
      appsetting.DEFAULT_SONG_IMAGE
    ); //fallback for image
    var title = this.song.title;
    var tags = appsetting.DEFAULT_SHARING_TAG;
    if (this.song.tags && this.song.tags.length > 0) {
      tags += this.song.tags.map((tag) => `#${tag}`).join(", ");
    }

    var description =
      this.song.title +
      "..." +
      new TruncatePipe().transform(this.song.lyric, ["100"]);
    this.shareArgs = new ShareArgs(
      this.buildShareUrl(),
      title,
      description,
      image,
      tags
    );
  }
  buildShareUrl(): string {
    if (this.lyrical) {
      const songLyricalPlayerUrl = this.router.createUrlTree([
        "songs",
        this.song.urlFriendlyTitle,
        "lyrical",
      ]);
      const shareUrl = decodeURI(
        `${location.origin}${songLyricalPlayerUrl.toString()}`
      );
      return shareUrl;
    }
    return ""; //will use current window.location.href
  }
}
