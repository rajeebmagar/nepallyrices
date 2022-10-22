import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { ArtistSongsComponent } from "app/artists/artist/artist-songs/artist-songs.component";
@Component({
  selector: "nl-artist-popular-songs",
  templateUrl: "./artist-popular-songs.component.html",
  styleUrls: ["./artist-popular-songs.component.css"],
})
export class ArtistPopularSongsComponent implements OnInit {
  @Output() showAllSongs = new EventEmitter();

  @ViewChild(ArtistSongsComponent, { static: true })
  private artistSongsComponent: ArtistSongsComponent;

  hasSong = false;
  constructor() {}

  ngOnInit() {}
  onSongAvailable(event: any) {
    this.hasSong = true;
  }
  requestToShowAllSong(): void {
    this.showAllSongs.emit();
  }
  playAll(): void {
    this.artistSongsComponent.playAll();
  }
}
