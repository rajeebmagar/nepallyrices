import { Injectable } from "@angular/core";
import { appsetting } from "app-settings/app-setting";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
@Injectable()
export class FileUploadService {
  private onUploadProgress = new Subject<number>();
  private onUploadError = new Subject<any>();
  private onUploadCompleted = new Subject<any>();

  onUploadProgress$ = this.onUploadProgress.asObservable();
  onUploadError$ = this.onUploadError.asObservable();
  onUploadCompleted$ = this.onUploadCompleted.asObservable();

  constructor() {}

  uploadWithProgress(url: string, audioFile: File): void {
    var access_token = localStorage.getItem(appsetting.TOKEN_NAME);
    let formData: FormData = new FormData();
    if (audioFile.name) formData.append("", audioFile, audioFile.name);
    else formData.append("", audioFile);

    let xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event: ProgressEvent) => {
      let progress = Math.round(
        event.lengthComputable ? (event.loaded * 100) / event.total : 0
      );
      this.onProgress(progress);
    };

    xhr.onload = () => {
      this.onUploadComplete(
        xhr.response,
        xhr.status,
        xhr.getAllResponseHeaders()
      );
    };

    xhr.onerror = () => {
      this.onError(xhr.response, xhr.status, xhr.getAllResponseHeaders());
    };

    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.setRequestHeader("mimeType", "multipart/form-data");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(formData);
  }

  onProgress(progress: number) {
    this.onUploadProgress.next(progress);
  }
  onUploadComplete(response: any, statusCode: number, responseHeaders: string) {
    if (statusCode == 200) this.onUploadCompleted.next(JSON.parse(response));
    else this.onUploadError.next(response);
  }
  onError(response: any, statusCode: number, responseHeaders: string) {
    this.onUploadError.next(response);
  }
}
