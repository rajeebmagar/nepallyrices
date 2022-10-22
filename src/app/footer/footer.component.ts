import { Component, OnInit } from '@angular/core';
import { NepaliAlphabet } from "app/shared/helpers/nepali-alphabet";
import { AudioPlayerService } from "app/shared/services/audio-player.service";

@Component({
  selector: 'nl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private audioPlayerService: AudioPlayerService) { }
  alphabetsVowels = NepaliAlphabet.Vowels;
  alphabetsConsonants = NepaliAlphabet.Consonants;
  displayingAudioPlayer = false;
  currentYear: number;
  ngOnInit() {
    var today = new Date();
    this.currentYear = today.getFullYear();

    this.audioPlayerService.onPlayListPlayBackCompleted$.subscribe(() => {
      this.displayingAudioPlayer = false;
    });
    this.audioPlayerService.onAudioSourceChange$.subscribe(newSongAudio => {

      this.displayingAudioPlayer = true;
    });
  }
}
