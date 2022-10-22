import { appsetting } from "../../../app-settings/app-setting";
import { ShareArgs } from "../../shared/modules/helpers/share-buttons.class";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { SongService } from "../../shared-songs/song.service";
import { Song } from "app/shared/entities/song";
import { SongHeaderComponent } from "./song-header/song-header.component";
import { songtabs } from "./song-tabs";
import { SongIntro } from "app/shared-models/song-intro";
import { Comment } from "app/shared/entities/comment";
import { PaginationService } from "app/shared/services/pagination.service";
import { PagedResponse } from "app/shared-models/paged-response";
import { environment } from "environments/environment";
import { Observable, EMPTY, of } from "rxjs";
import { ArtistRole } from "app/shared-artists/models/artist-role";
import { FindLyricistByNameService } from "../../shared/services/find-lyricist-by-name.service";
import { FindMusicianByNameService } from "../../shared/services/find-musician-by-name.service";
import { AssignArtistAsLyricistService } from "../../shared/services/assign-artist-as-lyricist.service";
import { AssignArtistAsMusicianService } from "../../shared/services/assign-artist-as-musician.service";
import { AddNewLyricistService } from "../../shared/services/add-new-lyricist.service";
import { AddNewMusicianService } from "../../shared/services/add-new-musician.service";
import { AssignTagToSongService } from "../../shared/services/assign-tag-to-song.service";
import { AddNewTagService } from "../../shared/services/add-new-tag.service";
import { FindTagByNameService } from "../../shared/services/find-tag-by-name.service";
import { Tag } from "../../shared/entities/tag";
import { SocialMediaTagsService } from "app/shared/services/social-media-tags.service";
import { SocialMediaTags } from "app/shared/entities/social-media-tags";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { AssignArtistAsSingerService } from "app/shared/services/assign-artist-as-singer.service";
import { AddNewSingerService } from "app/shared/services/add-new-singer.service";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { switchMap, map, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { NewArtistDialogComponent } from "../../shared/new-artist-dialog/new-artist-dialog.component";
import { ConfirmDialogComponent } from "../../shared/confirm-dialog/confirm-dialog.component";
import { KaraokeAudioPlayerService } from "app/shared/services/karaoke-audio-player.service";
import { ImageDefaultUrlPipe } from "app/shared-module/pipes/image-default-url.pipe";
import { TruncatePipe } from "app/shared-module/pipes/truncate.pipe";
import { FindSingerByNameService } from "app/shared-artist-services/find-singer-by-name.service";
@Component({
  selector: "nl-song",
  templateUrl: "./song.component.html",
  styleUrls: ["./song.component.css"],
  providers: [
    SongService,
    AssignArtistAsMusicianService,
    AssignArtistAsLyricistService,
    AddNewLyricistService,
    AddNewMusicianService,
    FindMusicianByNameService,
    FindLyricistByNameService,
    AssignTagToSongService,
    AddNewTagService,
    FindTagByNameService,
    FindSingerByNameService,
    AssignArtistAsSingerService,
    AddNewSingerService,
  ],
})
export class SongComponent implements OnInit {
  @ViewChild(SongHeaderComponent)
  private songHeaderComponent: SongHeaderComponent;

  song: Song;
  activeTabIndex: number = 0;
  relatedSongs: SongIntro[];
  lyricTabIndex = songtabs.lyricTabIndex;
  relatedSongsTabIndex = songtabs.relatedSongsTabIndex;
  commentsTabIndex = songtabs.commentsTabIndex;
  query: any;
  comments: Comment;
  liked: boolean;
  pagedSongIntros: PagedResponse<SongIntro>;
  editlyricsts: boolean;
  editCoverSingers: boolean;
  editmusicians: boolean;
  edittags: boolean;
  isEditable: boolean;
  isCoverSong: boolean;
  shareArgs: ShareArgs;
  defaultImageUrl: string = `${appsetting.DEFAULT_SONG_IMAGE}`;
  readonly newArtistId = ArtistRole.NewArtistId;
  newLyricistName = "";
  newMusicianName = "";
  newSingerName = "";
  newTagName = "";

  possibleDuplicateTags: Tag[];
  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private paginationService: PaginationService,
    private authService: UserAuthService,
    private findLyricistByNameService: FindLyricistByNameService,
    private findMusicianByNameService: FindMusicianByNameService,
    private findSingerByNameService: FindSingerByNameService,
    private assignArtistAsLyricistService: AssignArtistAsLyricistService,
    private assignArtistAsMusicianService: AssignArtistAsMusicianService,
    private assignArtistAsSingerService: AssignArtistAsSingerService,
    private addNewLyricistService: AddNewLyricistService,
    private addNewMusicianService: AddNewMusicianService,
    private addNewSingerService: AddNewSingerService,
    private addTagToSongService: AssignTagToSongService,
    private addNewTagService: AddNewTagService,
    private findTagByNameService: FindTagByNameService,
    private socialMediaTagsService: SocialMediaTagsService,
    private karaokeAudioPlayerService: KaraokeAudioPlayerService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getSong();

    this.route.params.subscribe((params: Params) => {
      let relatedSongsURL = `${environment.API_ENDPOINT}/songs/${params["urlFriendlyTitle"]}/related`;
      this.paginationService
        .getNextPageResponse<SongIntro>(relatedSongsURL)
        .subscribe((pagedSongIntros) => {
          this.pagedSongIntros = pagedSongIntros;
          this.relatedSongs = pagedSongIntros.items;
        });
    });

    this.route.params
      .pipe(
        switchMap((params: Params) =>
          this.songService.getRelatedSongs(params["urlFriendlyTitle"])
        )
      )
      .subscribe((val) => {
        var itemMap = val;
        this.relatedSongs = itemMap["items"];
      });

    this.authService.userLoggedInEvent.subscribe((user) => {
      this.setIsEditable();
    });
  }
  coverSongCheckChange(checkBoxChange: MatCheckboxChange): void {
    this.isCoverSong = checkBoxChange.checked;
  }
  getLineCount(content: string): number {
    if (content) {
      let lineCount = content.split(/\r\n|\r|\n/).length;
      return lineCount;
    }
    return 1;
  }
  getSong() {
    this.route.params
      .pipe(
        switchMap((params: Params) =>
          this.songService.getSongDetailByUrlFriendlyTitle(
            params["urlFriendlyTitle"]
          )
        )
      )
      .subscribe((song) => {
        this.song = song;
        this.setShareArgs();
        this.setIsCoverSong();
        this.setSongOfAudios();
        this.setIsEditable();
        this.setMetaTags();
        const shouldShowLyricalPlayer =
          this.route.snapshot.url.findIndex(
            (urlSegment) => urlSegment.path === "lyrical"
          ) >= 0;
        if (shouldShowLyricalPlayer && song.audios && song.audios.length > 0) {
          this.karaokeAudioPlayerService.showKaraokeAudioPlayer(song.audios[0]);
        }
      });
  }
  setIsCoverSong(): void {
    this.isCoverSong =
      this.song.coverSingers && this.song.coverSingers.length > 0;
  }
  setMetaTags(): void {
    this.socialMediaTagsService.addTags(this.getSocialMediaTags());
  }
  setShareArgs(): void {
    var image = new ImageDefaultUrlPipe().transform(
      (this.song.coverPhoto && this.song.coverPhoto.imageUrl) || "",
      this.defaultImageUrl
    ); //fallback for image
    var title = this.song.title;
    var tags = `${appsetting.DEFAULT_SHARING_TAG}`;
    var description =
      this.song.title +
      "..." +
      new TruncatePipe().transform(this.song.lyric, ["100"]);
    this.shareArgs = new ShareArgs("", title, description, image, tags);
  }
  getSocialMediaTags(): SocialMediaTags {
    let socialMediaTags = new SocialMediaTags();
    socialMediaTags.type = "Nepali Songs";
    socialMediaTags.title = this.song.title;
    socialMediaTags.description =
      this.song.description ||
      this.song.lyricExcerpt ||
      this.song.lyric.length < 200
        ? this.song.lyric
        : this.song.lyric.substring(1, 200);
    socialMediaTags.url = window.location.href;
    if (this.song.coverPhoto) {
      socialMediaTags.image = this.song.coverPhoto.imageUrl;
    } else if (this.song.profilePicture) {
      socialMediaTags.image = this.song.profilePicture.imageUrl;
    }
    return socialMediaTags;
  }
  setIsEditable(): void {
    if (this.song) {
      this.isEditable = this.authService.isEditable(this.song);
    }
  }
  setSongOfAudios() {
    if (this.song.audios) {
      for (let audio of this.song.audios) {
        audio.song = this.song;
      }
    }
  }
  tabIndexChanged(tabIndex: number): void {
    this.activeTabIndex = tabIndex;
  }
  getMoreRelatedSong(): void {
    //change tab tabIndex
    this.songHeaderComponent.setCurrentTabIndex(this.relatedSongsTabIndex);

    //getMoreRelatedSongs
  }
  getMoreComments(): void {
    //change tab tabIndex
    this.songHeaderComponent.setCurrentTabIndex(this.commentsTabIndex);

    //getMoreRelatedSongsv
  }

  saveLyricsEditable(lyrics): void {
    this.songService
      .saveEditedLyrics(this.song.songId, lyrics)
      .subscribe((updatedLyric) => {
        //can show a message with lyrics updated
      });
  }
  resetEditingModes(event: any): void {
    if (
      !(
        event.srcElement.localName === "span" ||
        event.srcElement.localName === "mat-icon" ||
        event.srcElement.localName === "input"
      )
    ) {
      this.editlyricsts = false;
      this.editmusicians = false;
      this.edittags = false;
      this.editCoverSingers = false;
    }
  }

  editModeChangeForLyricist(): void {
    this.editlyricsts = true;
  }
  editModeChangeForCoverSinger(): void {
    this.editCoverSingers = true;
  }

  editModeChangeForMusicians(): void {
    this.editmusicians = true;
  }

  editModeChangeForTags(): void {
    this.edittags = true;
  }
  focusOut(): void {
    console.log("focus out");
  }
  public onAddingLyricist = (lyricist): Observable<any> => {
    if (typeof lyricist === "string") {
      this.openNewArtistDialogForLyricist();
      return EMPTY;
    } else {
      if (lyricist.artistId === this.newArtistId) {
        this.openNewArtistDialogForLyricist();
        return EMPTY;
      }
      if (lyricist.artistRoleId > 0) {
        return of(lyricist);
      } else {
        return this.assignArtistAsLyricistService.assign(lyricist.artistId);
      }
    }
  };

  onAddingCoverSinger = (singer): Observable<any> => {
    if (typeof singer === "string") {
      this.openNewArtistDialogForSinger();
      return EMPTY;
    } else {
      if (singer.artistId === ArtistRole.NewArtistId) {
        this.openNewArtistDialogForSinger();
        return EMPTY;
      } else if (singer.artistRoleId > 0) {
        return of(singer);
      } else {
        return this.assignArtistAsSingerService.assign(singer.artistId);
      }
    }
  };
  public onAddingMusicians = (musician): Observable<any> => {
    if (typeof musician === "string") {
      this.openNewArtistDialogForMusician();
      return EMPTY;
    } else {
      if (musician.artistId === this.newArtistId) {
        this.openNewArtistDialogForMusician();
        return EMPTY;
      }
      if (musician.artistRoleId > 0) {
        return of(musician);
      } else {
        return this.assignArtistAsMusicianService.assign(musician.artistId);
      }
    }
  };

  onAddingTags = (tag): Observable<any> => {
    if (typeof tag === "string") {
      if (!this.isDuplicateTag(tag)) {
        this.openNewTagConfirmationDialog();
        return EMPTY;
      } else {
        alert("Duplicate tag cannot be added");
        return EMPTY;
      }
    } else {
      if (tag.tagId === Tag.NewTagId) {
        this.openNewTagConfirmationDialog();
        return EMPTY;
      }
      return of(tag);
    }
  };

  tagsAdded(tag: Tag): void {
    this.addTagToSongService
      .assign(tag.tagId, this.song.songId)
      .subscribe((response) => {});
  }

  requestAutocompleteItemsLyricist = (
    searchTerm: string
  ): Observable<ArtistRole[]> => {
    if (searchTerm) {
      return this.findLyricistByNameService.find(searchTerm).pipe(
        map((lyricists) => {
          lyricists.unshift(
            ArtistRole.NewArtist({ name: searchTerm, role: "Lyricist" })
          );
          return lyricists;
        })
      );
    }
    return EMPTY;
  };

  requestAutocompleteCoverSingers = (
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
    }
    return EMPTY;
  };

  requestAutocompleteItemsMusicians = (
    searchTerm: string
  ): Observable<ArtistRole[]> => {
    if (searchTerm) {
      return this.findMusicianByNameService.find(searchTerm).pipe(
        map((musicians) => {
          musicians.unshift(
            ArtistRole.NewArtist({ name: searchTerm, role: "Musician" })
          );
          return musicians;
        })
      );
    }
    return EMPTY;
  };
  requestAutocompleteItemsTags = (searchTerm: string): Observable<Tag[]> => {
    if (searchTerm) {
      return this.findTagByNameService.find(searchTerm).pipe(
        tap((tags) => (this.possibleDuplicateTags = tags)),
        map((tags) => {
          if (!this.isDuplicateTag(searchTerm)) {
            tags.push(Tag.NewTag(searchTerm));
          }
          return tags;
        })
      );
    }
    return EMPTY;
  };
  isDuplicateTag(tagName): boolean {
    if (!this.possibleDuplicateTags) {
      return false;
    }
    return this.possibleDuplicateTags.some((tag) => tag.name === tagName);
  }
  openNewTagConfirmationDialog() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `Would you like to add new tag '${this.newTagName}'`,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.addNewTagService.add(this.newTagName).subscribe((newTag) => {
            this.addTagToSongService
              .assign(newTag.tagId, this.song.songId)
              .subscribe((response) => {
                if (!this.song.tags) {
                  this.song.tags = [];
                }
                this.song.tags.push(newTag);
              });
          });
        }
        this.newTagName = "";
      });
  }
  findDuplicates(artist) {
    return false;
  }

  CoverSingerAdded(artist: ArtistRole): void {
    if (!this.findDuplicates(artist)) {
      this.saveSongCoverSinger(artist);
    }
  }

  saveSongCoverSinger(artist: ArtistRole): void {
    this.songService
      .saveNewCoverSingerForSong(this.song.songId, artist)
      .subscribe();
  }

  coverSingerRemoved(artist: ArtistRole): void {
    this.songService
      .removeCoverSingerForSong(this.song.songId, artist)
      .subscribe((response) => {
        if (this.song.coverSingers.length === 0) this.editCoverSingers = false;
      });
  }

  LyricistAdded(artist: ArtistRole): void {
    debugger;
    if (!this.findDuplicates(artist)) {
      this.saveSonglyricist(artist);
    }
  }

  saveSonglyricist(artist: ArtistRole): void {
    this.songService
      .saveNewLyricistForSong(this.song.songId, artist)
      .subscribe();
  }

  lyricistRemoved(artist: ArtistRole): void {
    this.songService
      .removeSonglyricist(this.song.songId, artist)
      .subscribe((response) => {
        if (this.song.lyricists.length === 0) this.editlyricsts = false;
      });
  }

  tagsRemoved(tag: Tag): void {
    this.addTagToSongService
      .remove(tag.tagId, this.song.songId)
      .subscribe((response) => {
        if (this.song.tags.length === 0) this.edittags = false;
      });
  }

  onMusicianAdded(artist: ArtistRole): void {
    this.saveSongmusician(artist);
  }
  onMusicianRemoved(artist: ArtistRole): void {
    this.songService.removeSongmusician(this.song.songId, artist).subscribe();
  }
  saveSongmusician(e): void {
    this.songService.saveNewMusicianForSong(this.song.songId, e).subscribe();
  }

  openNewArtistDialogForLyricist(): void {
    const dialogRef = this.dialog.open(NewArtistDialogComponent, {
      data: { name: this.newLyricistName, role: "Lyricist" },
    });

    dialogRef.afterClosed().subscribe((newLyricist) => {
      if (newLyricist) {
        if (!this.song.lyricists) {
          this.song.lyricists = [];
        }
        this.songService
          .saveNewLyricistForSong(this.song.songId, newLyricist)
          .subscribe((response) => {
            this.song.lyricists.push(newLyricist);
          });
      }
      this.newLyricistName = "";
    });
  }

  openNewArtistDialogForMusician(): void {
    const dialogRef = this.dialog.open(NewArtistDialogComponent, {
      data: { name: this.newMusicianName, role: "Musician" },
    });

    dialogRef.afterClosed().subscribe((newMusician) => {
      if (newMusician) {
        if (!this.song.musicians) {
          this.song.musicians = [];
        }
        this.songService
          .saveNewMusicianForSong(this.song.songId, newMusician)
          .subscribe((response) => {
            this.song.musicians.push(newMusician);
          });
      }
      this.newMusicianName = "";
    });
  }

  openNewArtistDialogForSinger(): void {
    const dialogRef = this.dialog.open(NewArtistDialogComponent, {
      data: { name: this.newSingerName, role: "Singer" },
    });

    dialogRef.afterClosed().subscribe((newSinger) => {
      if (newSinger) {
        if (!this.song.coverSingers) {
          this.song.coverSingers = [];
        }
        this.songService
          .saveNewCoverSingerForSong(this.song.songId, newSinger)
          .subscribe((response) => {
            this.song.coverSingers.push(newSinger);
          });
      }
      this.newSingerName = "";
    });
  }
}
