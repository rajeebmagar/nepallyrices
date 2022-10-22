import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { SongIntro } from "app/shared-models/song-intro";
import { SongWithLikeCommandFactory } from "app/shared/commands/factories/song-with-like-command-factory";
import { SongPlayListCommandsFactoryService } from "app/shared/commands/factories/song-play-list-commands-factory.service";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
import { SongAudio } from "app/shared-models/song-audio";
import { SaveAsPlaylistService } from "app/save-as-playlist/save-as-playlist.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { AuthService } from "app/identity/auth.service";

@Component({
  selector: "nl-audio-play-list",
  templateUrl: "./audio-play-list.component.html",
  styleUrls: ["./audio-play-list.component.css"],
  animations: [
    trigger("displayAudioPlayList", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(100),
      ]),
      transition("* => void", [
        animate(100, style({ transform: "translateX(100%)" })),
      ]),
    ]),
  ],
})
export class AudioPlayListComponent implements OnInit {
  @Input() displayAudioPlayList: boolean;
  @Output() displayAudioPlayListChange = new EventEmitter<boolean>();

  constructor(
    private audioPlayerService: AudioPlayerService,
    private songWithLikeCommandFactory: SongWithLikeCommandFactory,
    private songPlayListCommandsFactoryService: SongPlayListCommandsFactoryService,
    private saveAsPlaylistService: SaveAsPlaylistService,
    private authService: AuthService,
    private userAuthService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService
  ) {}

  songIntros: SongIntro[];

  ngOnInit() {
    this.songIntros = this.audioPlayerService.getSongIntroList();
    this.audioPlayerService.onPlayListUpdated$.subscribe(() => {
      this.songIntros = this.audioPlayerService.getSongIntroList();
    });
  }

  saveAsPlayList(): void {
    if (this.userAuthService.isUserLoggedIn()) {
      this.saveAsPlaylistService.showSaveAsPlaylist(this.getSongAudios());
    } else {
      this.userAccountAccessService.showLogin();
    }

    this.close();
  }

  getSongAudios(): SongAudio[] {
    return this.songIntros
      .filter((songIntro) => {
        return songIntro.audios && songIntro.audios.length > 0;
      })
      .map((songIntro) => {
        return songIntro.audios[0];
      });
  }

  clear(): void {
    this.songIntros = [];
    this.audioPlayerService.clear();
    this.close();
  }

  close(): void {
    this.displayAudioPlayListChange.next(false);
  }
}
