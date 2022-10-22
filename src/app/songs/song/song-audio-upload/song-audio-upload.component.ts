import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { FileUploadService } from "app/shared-module/services/file-upload.service";
import { appsetting } from "app-settings/app-setting";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { SongAudio } from "app/shared-models/song-audio";
import { Song } from "app/shared/entities/song";
import { environment } from "environments/environment";

@Component({
  selector: "nl-song-audio-upload",
  templateUrl: "./song-audio-upload.component.html",
  styleUrls: ["./song-audio-upload.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongAudioUploadComponent {
  @Input()
  song: Song;

  private fileToUpload: File;

  uploadInProgress = false;
  progress = 0;

  constructor(
    private fileUploadService: FileUploadService,
    private ref: ChangeDetectorRef
  ) {}

  fileChangeEvent(event: any): void {
    this.fileToUpload = <File>event.target.files[0];
    if (this.fileToUpload) {
      this.uploadInProgress = true;
      this.uploadWithProgress(this.song, this.fileToUpload);
    }
  }
  uploadWithProgress(song: Song, audioFile: File): void {
    var uploadSongAudioAPI = `${environment.API_ENDPOINT}/audios/new/song/${song.urlFriendlyTitle}`;
    this.fileUploadService.onUploadError$.subscribe((response) => {
      this.uploadInProgress = false;
      this.progress = 0;
      this.ref.markForCheck();
      this.ref.detectChanges();
      alert("error:" + response);
    });
    this.fileUploadService.onUploadProgress$.subscribe((progress) => {
      this.progress = progress;
      this.ref.markForCheck();
      this.ref.detectChanges();
    });
    this.fileUploadService.onUploadCompleted$.subscribe((response) => {
      this.uploadInProgress = false;
      if (!this.song.audios) {
        this.song.audios = [];
      }
      let songAudio = <SongAudio>response;
      songAudio.song = this.song;
      this.song.audios.push(songAudio);
    });

    this.fileUploadService.uploadWithProgress(uploadSongAudioAPI, audioFile);
  }
}
