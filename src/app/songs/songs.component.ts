import { Component, OnInit } from "@angular/core";
import { SongIntro } from "app/shared-models/song-intro";
import { SongsService } from "app/songs/songs.service";
import { Link } from "app/shared/entities/link";
import { PaginationService } from "app/shared/services/pagination.service";
import { NepaliAlphabet } from "app/shared/helpers/nepali-alphabet";
import { SongWithAddToQueueCommandFactory } from "app/shared/commands/factories/song-with-add-to-queue-command-factory";
import { SongIntroCommandsFactoryService } from "app/shared/commands/factories/song-intro-commands-factory.service";
@Component({
  selector: "nl-songs",
  templateUrl: "./songs.component.html",
  styleUrls: ["./songs.component.css"],
  providers: [SongsService],
})
export class SongsComponent implements OnInit {

  constructor(
    private songsService: SongsService,
    private paginationService: PaginationService,
    private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
    private songIntroCommandsFactoryService: SongIntroCommandsFactoryService
  ) {}

  songs: SongIntro[];
  paginationLinks: Link[];
  hasMore: boolean;
  isRequesting = true;
  displayMessage: string;
  query: string = "अ";
  alphabetsVowels = NepaliAlphabet.Vowels;
  alphabetsConsonants = NepaliAlphabet.Consonants;
  ngOnInit(): void {
    this.isRequesting = true;
    this.search(this.query); //default search
  }
  setSongs(songs: SongIntro[]) {
    this.songs = songs;
  }
  getMoreSongs(): void {
    this.paginationService.nextPage(this.paginationLinks).subscribe((val) => {
      if (val != undefined) {
        let newSongs = new Array<SongIntro>();
        newSongs = newSongs.concat(this.songs); //copy previous data

        var items = val.items;
        this.paginationLinks = val.links;
        this.hasMore = this.paginationService.hasNext(this.paginationLinks);

        for (var i = 0; i < items.length; i++) {
          let newArtist = <SongIntro>items[i];
          newSongs.push(newArtist);
        }
        this.setSongs(newSongs);
      }
    });
  }
  search(query: string) {
    this.query = query;
    this.songsService.search(this.query).subscribe((response) => {
      var itemMap = response;
      this.songs = itemMap["items"];
      this.paginationLinks = itemMap["links"];
      this.hasMore = this.paginationService.hasNext(this.paginationLinks);
      this.isRequesting = false; //hide spinner
    });
  }
}
