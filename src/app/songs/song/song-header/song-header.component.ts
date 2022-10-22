import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterContentInit,
} from "@angular/core";
import { Song } from "app/shared/entities/song";
import { songtabs } from "../song-tabs";
import { SetSongCoverPictureService } from "app/songs/song/song-header/set-song-cover-picture.service";
import { SetSongProfilePictureService } from "app/songs/song/song-header/set-song-profile-picture.service";
import { Image } from "app/shared-models/image";
import { SongService } from "../../../shared-songs/song.service";
import { Observable, EMPTY, of } from "rxjs";
import { AssignArtistAsSingerService } from "app/shared/services/assign-artist-as-singer.service";
import { AddNewSingerService } from "app/shared/services/add-new-singer.service";
import { ArtistRole } from "app/shared-artists/models/artist-role";
import { ArtistProfile } from "app/shared/entities/artist-profile";
import { Genre } from "app/shared-models/genre";
import { ArtistIntro } from "../../../shared-models/artist-intro";
import { SongLikeEventService } from "app/shared/services/song-like-event.service";
import { PublishSong } from "app/shared/entities/publish-song";
import { SongAudio } from "app/shared-models/song-audio";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { CoverPhotoHelper } from "app/shared/helpers/cover-photo-helper";
import { ProfilePhotoHelper } from "app/shared/helpers/profile-photo-helper";
import { GetArtistPicturesService } from "app/shared-artist-services/get-artist-pictures.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { GoogleAnalyticsReportService } from "app/shared/services/google-analytics-report.service";
import { UserIntro } from "app/shared-models/user-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { map, tap } from "rxjs/operators";
import { NewArtistDialogComponent } from "app/shared/new-artist-dialog/new-artist-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";
import { ImageSelectorService } from "app/shared-module/services/image-selector.service";
import { FindGenreByNameService } from "app/songs/services/find-genre-by-name.service";
import { FindSingerByNameService } from "app/shared-artist-services/find-singer-by-name.service";
import { AddNewGenreService } from "app/songs/services/add-new-genre.service";
import { GetArtistCoverPicturesService } from "app/shared-artist-services/get-artist-cover-pictures.service";
@Component({
  selector: "nl-song-header",
  templateUrl: "./song-header.component.html",
  styleUrls: ["./song-header.component.css"],
})
export class SongHeaderComponent implements OnInit, AfterContentInit {
  profilePictureSize: any;
  songLikesCount: number;
  pagedSongLikers: PagedResponse<UserIntro>;
  displayUserIntroList: boolean;
  newSingerName: string;
  newGenreName: string;
  possibleDuplicateGenres: Genre[];

  @ViewChild("profilepicture", { static: true })
  profilepicture: ElementRef;

  getSongLikers(songId: number): void {
    this.songService.likers(songId).subscribe((pagedResponse) => {
      this.pagedSongLikers = pagedResponse;
      this.songLikesCount = pagedResponse.totalCount;
    });
  }
  showLikers(): void {
    this.displayUserIntroList = true;
  }
  songPlayCount: Number;
  coverPictureUpdateInProgress: boolean;
  profilePictureUpdateInProgress: boolean;
  private _song: Song;
  @Input() set song(song: Song) {
    this._song = song;
    this.setExistingPictureEntityIds(song);
    this.resetState();
    this.initializeSongRelatedVariables();
    this.coverPhotoPositionY = this.coverPhotoHelper.getYOffset(
      this.song.coverPhotoPositionY
    );
    this.currentCoverPhotoPositionY = this.coverPhotoPositionY;
    this.setAnalyticCounts(song.urlFriendlyTitle);
    this.getSongLikers(song.songId);
  }
  get song(): Song {
    return this._song;
  }

  setExistingPictureEntityIds(song: Song): void {
    this.existingPictureEntityIds = [];
    if (song.singers && song.singers.length > 0)
      this.existingPictureEntityIds = this.existingPictureEntityIds.concat(
        song.singers.map((s) => s.artistId)
      );
    if (song.lyricists && song.lyricists.length > 0)
      this.existingPictureEntityIds = this.existingPictureEntityIds.concat(
        song.lyricists.map((s) => s.artistId)
      );
    if (song.musicians && song.musicians.length > 0)
      this.existingPictureEntityIds = this.existingPictureEntityIds.concat(
        song.musicians.map((s) => s.artistId)
      );
    if (song.coverSingers && song.coverSingers.length > 0)
      this.existingPictureEntityIds = this.existingPictureEntityIds.concat(
        song.coverSingers.map((s) => s.artistId)
      );
  }
  @Output() tabSelected = new EventEmitter<number>();
  liked: boolean;
  isEditable: boolean = false;
  currentTabIndex: number = 0;
  lyricTabIndex = songtabs.lyricTabIndex;
  relatedSongsTabIndex = songtabs.relatedSongsTabIndex;
  commentsTabIndex = songtabs.commentsTabIndex;
  uploadedCoverPicture: Image;
  uploadedProfilePicture: Image;
  lyricsTitle: string;
  editSingers: boolean;
  editGenres: boolean;
  isSpamChecker: boolean;
  items = ["item1", "item2"];
  profileCropRatio = 0;
  profileCropWidth = 0;
  profileCropHeight = 0;

  coverCropRatio = 0;
  coverCropWidth = 0;
  coverCropHeight = 0;

  //image drag
  dragging = false;
  referenceY = 0;
  initialPositionY = 0;
  editingCoverPicture = false;

  coverPhotoPositionY = 0;
  currentCoverPhotoPositionY = 0;
  existingPictureEntityIds: string[];
  pageViewsCount: Number;

  constructor(
    private setSongCoverPictureService: SetSongCoverPictureService,
    private setSongProfilePictureService: SetSongProfilePictureService,
    private songService: SongService,
    private findSingerByNameService: FindSingerByNameService,
    private findGenreByNameService: FindGenreByNameService,
    private assignArtistAsSingerService: AssignArtistAsSingerService,
    private addNewSingerService: AddNewSingerService,
    private songLikeEventService: SongLikeEventService,
    private addNewgenreService: AddNewGenreService,
    private authService: UserAuthService,
    private coverPhotoHelper: CoverPhotoHelper,
    private profilePhotoHelper: ProfilePhotoHelper,
    private getArtistPicturesService: GetArtistPicturesService,
    private getArtistCoverPicturesService: GetArtistCoverPicturesService,
    private imageSelectorService: ImageSelectorService,
    private userAccountAccessService: UserAccountAccessService,
    private googleAnalyticsReportService: GoogleAnalyticsReportService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    //social network sharing info
    this.profileCropHeight = this.profilePhotoHelper.IMAGE_HEIGHT;
    this.profileCropWidth = this.profilePhotoHelper.IMAGE_WIDTH;
    this.profileCropRatio = this.profilePhotoHelper.getCropRatio();

    this.coverCropHeight = this.coverPhotoHelper.IMAGE_HEIGHT;
    this.coverCropWidth = this.coverPhotoHelper.IMAGE_WIDTH;
    this.coverCropRatio = this.coverPhotoHelper.getCropRatio();

    this.authService.userLoggedInEvent.subscribe((user) => {
      this.setIsEditable();
    });
  }
  ngAfterContentInit() {
    if (this.profilepicture) {
      this.profilePictureSize = this.profilepicture.nativeElement.offsetWidth;
    }
  }
  setAnalyticCounts(urlFriendlyName: string): void {
    this.googleAnalyticsReportService
      .getSongPageViewCount(urlFriendlyName)
      .subscribe((pageViewsCount) => {
        this.pageViewsCount = Number(pageViewsCount);
      });
    this.googleAnalyticsReportService
      .getSongAudioPlayCount(urlFriendlyName)
      .subscribe((songPlayCount) => {
        this.songPlayCount = Number(songPlayCount);
      });
  }
  initializeSongRelatedVariables(): void {
    this.isliked(this.song);
    this.lyricsTitle = this.song.title;
    this.subscribeSongLikeEvents();
    this.setIsEditable();
  }
  setIsEditable(): void {
    this.isEditable = this.authService.isEditable(this.song);
    this.isSpamChecker =
      this.authService.isAdmin() || this.authService.isEditor();
  }
  subscribeSongLikeEvents() {
    this.songLikeEventService.onSongLiked$.subscribe((songId) => {
      if (songId === this.song.songId) {
        this.liked = true;
      }
    });
    this.songLikeEventService.onSongUnLiked$.subscribe((songId) => {
      if (songId === this.song.songId) {
        this.liked = false;
      }
    });
  }
  setCurrentTabIndex(tabIndex: number): void {
    this.currentTabIndex = tabIndex;
    this.tabSelected.emit(tabIndex);
  }

  coverPictureUploaded(coverPicture: Image) {
    this.uploadedCoverPicture = coverPicture;
    //initialize
    this.song.coverPhotoPositionY = 0;
  }

  coverPictureSaved(saved: boolean) {
    if (saved) {
      this.song.coverPhoto = this.uploadedCoverPicture;
    } else {
      //reset to original position on cancel.
      this.song.coverPhotoPositionY = this.coverPhotoPositionY;
    }
    this.uploadedCoverPicture = null;
  }

  profilePictureUploaded(coverPicture: Image) {
    this.uploadedProfilePicture = coverPicture;
  }

  profilePictureSaved(saved: boolean) {
    if (saved) {
      this.song.profilePicture = this.uploadedProfilePicture;
    }
    this.uploadedProfilePicture = null;
  }

  isliked(song): void {
    if (this.authService.isUserLoggedIn()) {
      this.songService.isLiked(song.songId).subscribe((response) => {
        this.liked = response;
      });
    }
  }

  likeSong(song): void {
    if (this.authService.isUserLoggedIn()) {
      this.songService.likeSong(song.songId).subscribe((response) => {
        this.setLiked(true);
        this.songLikesCount++;
      });
    } else {
      this.userAccountAccessService.showLogin();
    }
  }

  unLikeSong(song): void {
    if (this.authService.isUserLoggedIn()) {
      this.songService.unLikeSong(song.songId).subscribe((response) => {
        this.setLiked(false);
        this.songLikesCount--;
      });
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
  publishSong(): void {
    let publishSong = new PublishSong();
    publishSong.url = window.location.href;
    this.songService
      .publish(this.song.songId, publishSong)
      .subscribe((response) => {
        this.song.status = "Published";
      });
  }
  markSongAsSpam(): void {
    this.songService.markAsSpam(this.song.songId).subscribe((response) => {
      if (response === 200) {
        this.song.status = "Spamed";
      }
    });
  }
  setLiked(liked: boolean): void {
    this.liked = liked;
    this.getSongLikers(this.song.songId);
    this.songLikeEventService.songLiked(liked, this.song.songId);
  }
  saveSongTitle(e): void {
    this.songService.patchTitle(this.song.songId, e).subscribe((response) => {
      this.lyricsTitle = e;
    });
  }
  removeAudio(songAudio: SongAudio): void {
    if (confirm("Are you sure you want to remove audio?")) {
      this.songService
        .removeAudioFromSong(this.song.urlFriendlyTitle, songAudio)
        .subscribe((resonse) => {
          this.song.audios.splice(this.song.audios.indexOf(songAudio));
        });
    }
  }
  resetEditingModes(event: any): void {
    if (
      !(
        event.srcElement.localName === "span" ||
        event.srcElement.localName === "mat-icon" ||
        event.srcElement.localName === "path" ||
        event.srcElement.localName === "svg" ||
        event.srcElement.localName === "input"
      )
    ) {
      this.editSingers = false;
      this.editGenres = false;
    }
  }

  editModeChange(): void {
    this.editSingers = true;
  }

  editModeChangeForGenre(): void {
    this.editGenres = true;
  }

  public onAddingSinger = (singer): Observable<any> => {
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

  onAddingGenres = (genre): Observable<Genre> => {
    if (typeof genre === "string") {
      if (!this.isDuplicateGenre(genre)) {
        this.openNewGenreConfirmationDialog();
      } else {
        alert("Cannot add duplicate genre");
        this.newGenreName = "";
      }
      return EMPTY;
    } else {
      if (genre.genreId === Genre.NewGenreId) {
        this.openNewGenreConfirmationDialog();
        return EMPTY;
      }
      return of(genre);
    }
  };

  openNewGenreConfirmationDialog() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `Would you like to add new genre '${this.newGenreName}'`,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.addNewgenreService
            .add(this.newGenreName)
            .subscribe((newGenre) => {
              this.songService
                .saveNewGenreForSong(this.song.songId, newGenre)
                .subscribe((response) => {
                  this.song.genres.push(newGenre);
                });
            });
        }
        this.newGenreName = "";
      });
  }
  public requestAutocompleteSingers = (
    searchTerm: string
  ): Observable<ArtistRole[]> => {
    if (searchTerm) {
      return this.findSingerByNameService.find(searchTerm).pipe(
        map((singer) => {
          singer.unshift(
            ArtistRole.NewArtist({ name: searchTerm, role: "Singer" })
          );
          return singer;
        })
      );
    }
    return EMPTY;
  };
  isDuplicateGenre(genreName: string): boolean {
    if (this.possibleDuplicateGenres) {
      return this.possibleDuplicateGenres.some(
        (genre) => genre.name === genreName
      );
    }
    return false;
  }
  public requestAutocompleteGenreItems = (
    searchTerm: string
  ): Observable<Genre[]> => {
    if (searchTerm) {
      return this.findGenreByNameService.find(searchTerm).pipe(
        tap((genres) => (this.possibleDuplicateGenres = genres)),
        map((genres) => {
          const hasDuplicate = genres.some(
            (genre) => genre.name === searchTerm
          );
          if (!hasDuplicate) {
            genres.unshift(Genre.NewGenre(searchTerm));
          }
          return genres;
        })
      );
    }
    return EMPTY;
  };

  singerAdded(artist: ArtistRole): void {
    if (!this.findDuplicates(artist)) {
      this.saveSongArtist(artist);
    }
  }
  genresAdded(genre: Genre): void {
    this.songService.saveNewGenreForSong(this.song.songId, genre).subscribe();
  }

  genresRemoved(genre: Genre): void {
    this.songService
      .removeGenreForSong(this.song.songId, genre)
      .subscribe((response) => {
        if (this.song.genres.length === 0) {
          this.editGenres = false;
        }
      });
  }

  singerRemoved(artist: ArtistRole): void {
    this.songService
      .removeSingerForSong(this.song.songId, artist)
      .subscribe((response) => {
        if (this.song.singers.length === 0) {
          this.editSingers = false;
        }
      });
  }
  findDuplicates(artist) {
    return false;
  }

  saveSongArtist(e): void {
    this.songService.saveNewSingerForSong(this.song.songId, e).subscribe();
  }

  //cover photo repositioning
  savingCoverPicture(saving: boolean) {
    this.editingCoverPicture = saving;
  }

  mouseDown(event: MouseEvent): void {
    this.dragging = true;
    this.referenceY = event.y;
    this.initialPositionY = this.currentCoverPhotoPositionY;
    this.resetEditingModes(event);
  }
  mouseUp(event: MouseEvent): void {
    this.dragging = false;
  }
  mouseMove(event: MouseEvent): void {
    if (this.dragging && this.editingCoverPicture) {
      let changeY = event.y - this.referenceY;
      this.currentCoverPhotoPositionY = changeY + this.initialPositionY;
      this.song.coverPhotoPositionY = changeY + this.initialPositionY;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }
  resetState(): void {
    this.uploadedCoverPicture = null;
    this.uploadedProfilePicture = null;

    this.editingCoverPicture = false;
    this.dragging = false;
  }
  profilePictureWorkInProgress(workInProgress: boolean): void {
    this.profilePictureUpdateInProgress = workInProgress;
  }
  coverPictureWorkInProgress(workInProgress: boolean): void {
    this.coverPictureUpdateInProgress = workInProgress;
  }

  openNewArtistDialogForSinger(): void {
    const dialogRef = this.dialog.open(NewArtistDialogComponent, {
      data: { name: this.newSingerName, role: "Singer" },
    });

    dialogRef.afterClosed().subscribe((newSinger) => {
      if (newSinger) {
        if (!this.song.singers) {
          this.song.singers = [];
        }
        this.songService
          .saveNewSingerForSong(this.song.songId, newSinger)
          .subscribe((response) => {
            this.song.singers.push(newSinger);
          });
      }
      this.newSingerName = "";
    });
  }
}
