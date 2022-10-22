import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/internal/Subject';

@Injectable()
export class AudioPlayListService {
  private requestToShowAudioPlayList = new Subject();

  requestToShowAudioPlayList$ = this.requestToShowAudioPlayList.asObservable();
  constructor() { }
  showAudioPlayList(): void {
      this.requestToShowAudioPlayList.next();
  }

}
