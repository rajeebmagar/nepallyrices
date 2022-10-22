import { Component, OnInit, Input, ElementRef, ViewChild, AfterContentInit } from '@angular/core';
import { PlayList } from 'app/shared/entities/play-list';
import { PlayListService } from 'app/add-to-play-list/play-list.service';
import { AudioPlayerService } from 'app/shared/services/audio-player.service';
@Component({
  selector: 'nl-play-list-view-cell',
  templateUrl: './play-list-view-cell.component.html',
  providers: [PlayListService],
  styleUrls: ['./play-list-view-cell.component.css']
})
export class PlayListViewCellComponent implements OnInit,AfterContentInit {
  thumbnailImageSize: any;
  @Input()
  playlist: PlayList;

  @ViewChild('thumbnailImage', { static: true })
  thumbnailImage: ElementRef;

  playing = false;
  playListAudioLoaded = false;
  songAudios = [];
  constructor(
    private playListService: PlayListService,
    private audioPlayerService: AudioPlayerService) { }

  ngOnInit() {
  }
  ngAfterContentInit(){
    if(this.thumbnailImage){
      this.thumbnailImageSize =this.thumbnailImage.nativeElement.offsetWidth;
    }
  }
  playPlaylist(playlist: PlayList, event: Event): void {

    event.preventDefault();
    event.stopPropagation();

    if (!this.playing) {
      if (!this.playListAudioLoaded) {
        this.loadAudiosOfPlaylist();
      } else {
        this.audioPlayerService.startPlaying();
      }
      this.playing = true;
    }
    else {
      this.audioPlayerService.pause();
      this.playing = false;
    }
  }
  loadAudiosOfPlaylist(): void {
    if (this.songAudios.length == 0) {
      this.playListService.getSongAudiosOfPlayList(this.playlist.id)
        .subscribe(songAudios => {
          this.songAudios = songAudios;
          this.startPlayingPlaylist();
        });
    }
    else {
      this.startPlayingPlaylist();
    }
  }
  startPlayingPlaylist(): void {
    this.audioPlayerService.playAll(this.songAudios);
    this.playListAudioLoaded = true;
    this.audioPlayerService.onPlayListUpdated$.subscribe(() => {
      this.playing = false;
      this.playListAudioLoaded = false;
    });
  }
}
