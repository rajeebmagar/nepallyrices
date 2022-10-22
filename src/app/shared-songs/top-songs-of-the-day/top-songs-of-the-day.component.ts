import {
  Component,
  OnInit,
  AfterViewChecked,
  AfterViewInit,
} from "@angular/core";
import { SongIntro } from "app/shared-models/song-intro";
import { TopSongsOfTheDayService } from "./top-songs-of-the-day.service";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
import { SongAudio } from "app/shared-models/song-audio";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
declare var $: any;

@Component({
  selector: "nl-top-songs-of-the-day",
  templateUrl: "./top-songs-of-the-day.component.html",
  styleUrls: ["./top-songs-of-the-day.component.css"],
})
export class TopSongsOfTheDayComponent implements OnInit {
  sliderName: string = "top-songs-of-the-day";
  topSongs: SongIntro[];

  constructor(
    private topSongsOfTheDayService: TopSongsOfTheDayService,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService,
    private audioPlayerService: AudioPlayerService
  ) {}

  ngOnInit(): void {
    this.topSongsOfTheDayService.getTopSongsOfTheDay().subscribe((val) => {
      var itemMap = val;
      this.topSongs = itemMap["items"];
    });
  }

  playAll(): void {
    let songAudios = this.getSongAudios();
    this.audioPlayerService.playAll(songAudios);
  }
  queueAll(): void {
    let songAudios = this.getSongAudios();
    this.audioPlayerService.queueAll(songAudios);
  }
  private getSongAudios(): SongAudio[] {
    return this.topSongs
      .filter((songIntro) => {
        return songIntro.audios && songIntro.audios.length > 0;
      })
      .map((songIntro) => {
        return songIntro.audios[0];
      });
  }
}
