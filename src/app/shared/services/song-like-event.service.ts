import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Song} from 'app/shared/entities/song';
@Injectable()
export class SongLikeEventService {

  private onSongLiked = new Subject<Number>();
  private onSongUnLiked = new Subject<Number>();

  onSongLiked$ = this.onSongLiked.asObservable();
  onSongUnLiked$ = this.onSongUnLiked.asObservable();
  constructor() { }
  
  songLiked(liked:boolean, songId:Number):void{
    if(liked)
      this.onSongLiked.next(songId);
    else
      this.onSongUnLiked.next(songId);
  }
}
