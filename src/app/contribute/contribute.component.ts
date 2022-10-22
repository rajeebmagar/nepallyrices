import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { ValueDisplayPair } from "app/shared/entities/value-display-pair";
import { ArtistRole } from "app/shared-artists/models/artist-role";
import { ConfirmDialogComponent } from "app/shared/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { AssignArtistAsSingerService } from "app/shared/services/assign-artist-as-singer.service";
import { AddNewSingerService } from "app/shared/services/add-new-singer.service";
import { NewSong } from "app/shared/entities/new-song";
import { FormControl } from "@angular/forms";
import { FindPossibleDuplicateSongsService } from "./find-possible-duplicate-songs.service";
import { SongIntro } from "app/shared-models/song-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { PaginationService } from "app/shared/services/pagination.service";

import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
import { AddNewSongService } from "app/contribute/add-new-song.service";
import { Router } from "@angular/router";
import { Observable, EMPTY, of } from "rxjs";
import { distinctUntilChanged, debounceTime, tap, map } from "rxjs/operators";
import { NewArtistDialogComponent } from "app/shared/new-artist-dialog/new-artist-dialog.component";
import { FindSingerByNameService } from "app/shared-artist-services/find-singer-by-name.service";
@Component({
  selector: "nl-contribute",
  templateUrl: "./contribute.component.html",
  styleUrls: ["./contribute.component.css"],
  providers: [
    AssignArtistAsSingerService,
    AddNewSingerService,
    FindPossibleDuplicateSongsService,
    AddNewSongService,
  ],
})
export class ContributeComponent implements OnInit, OnDestroy {
  addedNewSong = false;
  newSong: NewSong;
  songTitleQuery = new FormControl();
  songLyricsQuery = new FormControl();
  validForNewSong = false;
  inputValue = "";

  pagedpossibleDuplicateSongIntros: PagedResponse<SongIntro>;
  possibleDuplicateSongIntros: SongIntro[];
  hasMorePossibleDuplicateSongIntros = false;

  status = `Start Contributing, Let's not make duplicate song.`;

  readonly newArtistId = ArtistRole.NewArtistId;

  constructor(
    public dialog: MatDialog,
    private findSingerByNameService: FindSingerByNameService,
    private assignArtistAsSingerService: AssignArtistAsSingerService,
    private addNewSingerService: AddNewSingerService,
    private findPossibleDuplicateSongsService: FindPossibleDuplicateSongsService,
    private paginationService: PaginationService,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService,
    private addNewSongService: AddNewSongService,
    private router: Router
  ) {
    this.newSong = new NewSong();
    this.newSong.singers = [];
  }

  ngOnInit() {
    this.songTitleQuery.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.findDuplicates();
      });

    this.songLyricsQuery.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.findDuplicates();
      });
  }
  ngOnDestroy() {}
  getLineCount(content: string): number {
    if (content) {
      const lineCount = content.split(/\r\n|\r|\n/).length;
      return lineCount;
    }
    return 1;
  }
  singerAdded(song: any): void {
    this.findDuplicates();
  }
  singerRemoved(song: any): void {
    this.findDuplicates();
  }
  findDuplicates() {
    this.resetDuplicateSongIntros();
    if (this.validNewSongToFindDuplicate()) {
      this.findPossibleDuplicateSongsService
        .find(this.newSong)
        .subscribe((pagedSongIntros) => {
          this.receivedPossibleDuplicateResponse(pagedSongIntros);
        });
    }
    this.validForNewSong =
      this.validNewSongToFindDuplicate() &&
      this.newSong.lyrics &&
      this.newSong.lyrics.trim().length > 0;
    if (this.validForNewSong) {
      window.scrollTo(0, 500);
    }
  }
  resetDuplicateSongIntros(): void {
    this.possibleDuplicateSongIntros = [];
    this.pagedpossibleDuplicateSongIntros = null;
    this.hasMorePossibleDuplicateSongIntros = false;
  }
  receivedPossibleDuplicateResponse(
    pagedSongIntros: PagedResponse<SongIntro>
  ): void {
    this.pagedpossibleDuplicateSongIntros = pagedSongIntros;
    this.addSongIntrosFromPagedResponse();
    this.hasMorePossibleDuplicateSongIntros = this.paginationService.hasNext(
      pagedSongIntros.links
    );
  }
  addSongIntrosFromPagedResponse(): void {
    let newSongIntros = new Array<SongIntro>();
    if (this.possibleDuplicateSongIntros) {
      newSongIntros = newSongIntros.concat(this.possibleDuplicateSongIntros);
    }
    for (const songIntro of this.pagedpossibleDuplicateSongIntros.items) {
      newSongIntros.push(songIntro);
    }
    this.possibleDuplicateSongIntros = newSongIntros;
  }
  getMorePossibleDuplicateSongIntros() {
    const nextPossibleDuplicateSongUrl = this.paginationService.getNextPageUrl(
      this.pagedpossibleDuplicateSongIntros.links
    );
    if (nextPossibleDuplicateSongUrl) {
      this.paginationService
        .getNextPageResponse<SongIntro>(nextPossibleDuplicateSongUrl)
        .subscribe((pagedSongIntros) => {
          this.receivedPossibleDuplicateResponse(pagedSongIntros);
        });
    }
  }
  validNewSongToFindDuplicate(): boolean {
    return (
      this.newSong.title &&
      this.newSong.title.trim().length > 0 &&
      this.newSong.singers.length > 0
    );
  }
  requestAutocompleteSingers = (
    searchTerm: string
  ): Observable<ArtistRole[]> => {
    if (searchTerm) {
      return this.findSingerByNameService.find(searchTerm).pipe(
        map((singers) => {
          singers.unshift(
            ArtistRole.NewArtist({ name: searchTerm, role: "Singer" })
          );
          return singers;
        })
      );
    } else {
      return EMPTY;
    }
  };
  onAddingSinger = (singer): Observable<any> => {
    if (typeof singer === "string") {
      this.openNewArtistDialogForSinger();
      return EMPTY;
    } else {
      if (singer.artistId === ArtistRole.NewArtistId) {
        this.openNewArtistDialogForSinger();
        return EMPTY;
      }
      if (singer.artistRoleId > 0) {
        return of(singer);
      } else {
        if (
          confirm(
            `Would you like to assign an artist ${singer.artistName} as singer`
          )
        ) {
          return this.assignArtistAsSingerService.assign(singer.artistId);
        } else {
          return EMPTY;
        }
      }
    }
  };
  openNewArtistDialogForSinger(): void {
    const dialogRef = this.dialog.open(NewArtistDialogComponent, {
      data: { name: this.inputValue, role: "Singer" },
    });

    dialogRef.afterClosed().subscribe((newSinger) => {
      if (newSinger) {
        if (!this.newSong.singers) {
          this.newSong.singers = [];
        }

        this.newSong.singers.push(newSinger);
      }
      this.inputValue = "";
    });
  }
  addNewSong(): void {
    if (this.validForNewSong) {
      this.status = "Processing new song request";
      this.addNewSongService.add(this.newSong).subscribe((song) => {
        this.addedNewSong = true;
        this.status =
          "New song has been created. Redirecting to newly created song.";
        this.router.navigate(["songs", song.urlFriendlyTitle]);
      });
    }
  }

  @HostListener("window:beforeunload", ["$event"])
  confirmLeave($event) {
    if (this.validForNewSong) {
      $event.returnValue =
        "Are you sure you want to leave without saving your work?";
    }
  }

  openNewArtistDialog(): void {
    const dialogRef = this.dialog.open(NewArtistDialogComponent, {
      data: { name: this.inputValue, role: "Singer" },
    });

    dialogRef.afterClosed().subscribe((newSingerCreated) => {
      if (newSingerCreated) {
        this.newSong.singers.push(newSingerCreated);
      }
      this.inputValue = "";
    });
  }
}
