import { appsetting } from "../../../app-settings/app-setting";
import { ShareArgs } from "../../shared/modules/helpers/share-buttons.class";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { PlayListService } from "app/add-to-play-list/play-list.service";
import { SongIntro } from "app/shared-models/song-intro";
import { PlayList } from "app/shared/entities/play-list";
import { AudioPlayerService } from "app/shared/services/audio-player.service";
import { CommandExecuteNotificationService } from "app/shared/services/command-execute-notification.service";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { PlayListSongCommandsFactoryService } from "app/shared/commands/factories/play-list-song-commands-factory.service";
import { Subscription } from "rxjs";
import { SongAudio } from "app/shared-models/song-audio";
import { switchMap } from "rxjs/operators";
import { ImageDefaultUrlPipe } from "app/shared-module/pipes/image-default-url.pipe";
@Component({
  selector: "nl-play-list-detail",
  templateUrl: "./play-list-detail.component.html",
  styleUrls: ["./play-list-detail.component.css"],
  providers: [PlayListService, PlayListSongCommandsFactoryService],
})
export class PlayListDetailComponent implements OnInit, OnDestroy {
  songIntros: SongIntro[] = [];
  playlist: PlayList;
  shareArgs: ShareArgs;
  defaultImageUrl: string = `${appsetting.DEFAULT_PLAYLIST_IMAGE}`;
  constructor(
    private route: ActivatedRoute,
    private playListService: PlayListService,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private playListSongCommandsFactoryService: PlayListSongCommandsFactoryService,
    private audioPlayerService: AudioPlayerService,
    private commandExecuteNotificationService: CommandExecuteNotificationService
  ) {}
  private playlistRemovedSubscription: Subscription;
  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) =>
          this.playListService.getPlayListById(params["id"])
        )
      )
      .subscribe((playlist) => {
        this.playlist = playlist;
        this.setGenresOfPlaylist();
      });

    this.route.params
      .pipe(
        switchMap((params: Params) =>
          this.playListService.getSongAudiosOfPlayList(params["id"])
        )
      )
      .subscribe((songAudios) => {
        this.songIntros = [];
        songAudios.forEach((songAudio) => {
          this.songIntros.push(songAudio.songIntro);
        });
        this.setGenresOfPlaylist();
      });

    this.playlistRemovedSubscription =
      this.commandExecuteNotificationService.executedSuccessfully$.subscribe(
        (introviewContent) => {
          let songIntro = this.songIntros.filter(
            (songIntro) =>
              songIntro.urlFriendlyTitle === introviewContent.urlFriendlyId
          )[0];
          let removedIndex = this.songIntros.indexOf(songIntro);
          this.songIntros.splice(removedIndex, 1);
          let updatedSongIntros: SongIntro[] = [];
          updatedSongIntros = updatedSongIntros.concat(this.songIntros);
          this.songIntros = updatedSongIntros;
          this.playlist.songCount--;
        }
      );
  }
  setShareArgs(): void {
    var image = new ImageDefaultUrlPipe().transform(
      (this.playlist.coverPhoto && this.playlist.coverPhoto.imageUrl) || "",
      this.defaultImageUrl
    ); //fallback for image
    var title = this.playlist.title;
    var tags = `${appsetting.DEFAULT_SHARING_TAG}`;
    var description = this.playlist.title + "..." + "";
    this.shareArgs = new ShareArgs("", title, description, image, tags);
  }
  setGenresOfPlaylist() {
    if (this.playlist && this.songIntros && !this.playlist.genres) {
      this.songIntros.forEach((songIntro) => {
        if (!this.playlist.genres) this.playlist.genres = [];
        if (!this.playlist.singers) this.playlist.singers = [];

        songIntro.genres.forEach((genre) => {
          if (
            this.playlist.genres.filter((g) => g.genreId == genre.genreId)
              .length == 0
          ) {
            this.playlist.genres.push(genre);
          }
        });

        songIntro.singers.forEach((singer) => {
          if (
            this.playlist.singers.filter((s) => s.artistId == singer.artistId)
              .length == 0
          ) {
            this.playlist.singers.push(singer);
          }
        });
      });
    }
  }
  playAll(): void {
    this.audioPlayerService.playAll(this.getSongAudios());
  }
  queueAll(): void {
    this.audioPlayerService.queueAll(this.getSongAudios());
  }
  private getSongAudios(): SongAudio[] {
    return this.songIntros
      .filter((songIntro) => {
        return songIntro.audios && songIntro.audios.length > 0;
      })
      .map((songIntro) => {
        return songIntro.audios[0];
      });
  }
  ngOnDestroy(): void {
    this.playlistRemovedSubscription.unsubscribe();
  }
}
