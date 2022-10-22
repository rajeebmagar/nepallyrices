import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NewArtist as AddNewArtistCommand } from "../entities/new-artist";
import { ArtistRole } from "../../shared-artists/models/artist-role";
import { AddNewSingerService } from "../services/add-new-singer.service";
import { FormControl, Validators } from "@angular/forms";
import { debounce, distinctUntilChanged, debounceTime } from "rxjs/operators";
import { AddNewLyricistService } from "../services/add-new-lyricist.service";
import { FindLyricistByNameService } from "../services/find-lyricist-by-name.service";
import { FindMusicianByNameService } from "../services/find-musician-by-name.service";
import { AddNewMusicianService } from "../services/add-new-musician.service";
import { FindSingerByNameService } from "app/shared-artist-services/find-singer-by-name.service";

@Component({
  selector: "nl-new-artist-dialog",
  templateUrl: "./new-artist-dialog.component.html",
  styleUrls: ["./new-artist-dialog.component.css"],
  providers: [
    AddNewSingerService,
    AddNewLyricistService,
    FindLyricistByNameService,
    FindMusicianByNameService,
    AddNewMusicianService,
  ],
})
export class NewArtistDialogComponent implements OnInit {
  private newArtistCreated: ArtistRole;
  public similarNamedArtists: ArtistRole[];
  public artistNameFormControl: FormControl = new FormControl(
    "",
    Validators.compose([Validators.required])
  );
  constructor(
    public dialogRef: MatDialogRef<NewArtistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public addNewArtistCommand: AddNewArtistCommand,
    public findSingerByNameService: FindSingerByNameService,
    public addNewSingerService: AddNewSingerService,
    public addNewLyricistService: AddNewLyricistService,
    public findLyricistByNameService: FindLyricistByNameService,
    public findMusicianByNameService: FindMusicianByNameService,
    public addNewMusicanSerivice: AddNewMusicianService
  ) {
    console.log(addNewArtistCommand);
  }

  ngOnInit() {
    console.log(this.addNewArtistCommand);
    this.artistNameFormControl.setValue(this.addNewArtistCommand.name);
    this.artistNameFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((artistName) => {
        this.onArtistNameChange(artistName);
      });

    this.onArtistNameChange(this.addNewArtistCommand.name);
  }

  onArtistNameChange(artistName) {
    switch (this.addNewArtistCommand.role) {
      case "Singer":
        this.findSingerByNameService.find(artistName).subscribe((singers) => {
          this.similarNamedArtists = singers;
        });
        break;
      case "Lyricist":
        this.findLyricistByNameService
          .find(artistName)
          .subscribe((lyricists) => {
            this.similarNamedArtists = lyricists;
          });
        break;
      case "Musician":
        this.findMusicianByNameService
          .find(artistName)
          .subscribe((musicians) => (this.similarNamedArtists = musicians));
        break;
      default:
        throw new Error(
          `Artist role ${this.addNewArtistCommand.role} is not supported`
        );
    }
  }
  addNewArtist() {
    switch (this.addNewArtistCommand.role) {
      case "Singer":
        this.addNewSingerService
          .add(this.artistNameFormControl.value)
          .subscribe((newSinger) => {
            this.dialogRef.close(newSinger);
          });
        break;
      case "Lyricist":
        this.addNewLyricistService
          .add(this.artistNameFormControl.value)
          .subscribe((newLyricist) => {
            this.dialogRef.close(newLyricist);
          });
        break;
      case "Musician":
        this.addNewMusicanSerivice
          .add(this.artistNameFormControl.value)
          .subscribe((newMusician) => this.dialogRef.close(newMusician));
        break;
      default:
        throw new Error(
          `Artist role ${this.addNewArtistCommand.role} is not supported`
        );
    }
  }
}
