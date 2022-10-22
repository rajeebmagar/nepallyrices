import { SearchService } from "../search/search.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
// import { SearchFormService } from './search-form.service';
import { SongIntro } from "app/shared-models/song-intro";
import { Observable, EMPTY } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";

@Component({
  selector: "nl-search-form",
  templateUrl: "./search-form.component.html",
  styleUrls: ["./search-form.component.css"],
  providers: [SearchService],
})
export class SearchFormComponent {
  showSearchBar: boolean;

  router: Router;
  public searchResult = new Map<string, string>();
  query = new FormControl();
  queryExecuted: boolean;
  public isRequesting;
  public noResult: boolean;

  @ViewChild("searchinput", { static: true }) searchinput: ElementRef;
  constructor(router: Router, private searchService: SearchService) {
    this.router = router;
  }

  ngOnInit() {
    var searchType = "all";
    this.query.valueChanges
      .pipe(
        debounceTime(400),
        switchMap((data) => {
          this.noResult = false;
          if (this.searchResult.size === 0) this.isRequesting = true;
          if (data == "") {
            this.searchResult = new Map<string, string>();
            this.isRequesting = false;
          }
          if (this.queryExecuted) {
            // hide the query suggestions if the search query has been submitted on form submi
            // and return empty result - don't call web service
            this.isRequesting = false;
            this.queryExecuted = false;
            return EMPTY;
          }
          return this.searchService.search(data, searchType);
        })
      )
      .subscribe((result) => {
        this.searchResult = new Map<string, string>();
        var songs = result.songs.items;
        var artists = result.artists.items;

        // use code to redirect to the detail page
        songs.forEach((song) => {
          this.searchResult.set(song.urlFriendlyTitle + "|S", song.title);
        });
        artists.forEach((artist) => {
          this.searchResult.set(artist.urlFriendlyTitle + "|A", artist.title);
        });
        if (this.searchResult.size == 0) {
          this.noResult = true;
        }
        this.isRequesting = false;
      });
  }
  onSubmit() {
    this.searchResult = new Map<string, string>();
    // if data is empty dont redirect
    if (this.query.value != undefined) {
      this.queryExecuted = true;
      this.router.navigate(["/search", this.query.value]);
    }
    if (window.innerWidth < 991) {
      this.showSearchBar = true;
      this.searchinput.nativeElement.focus();
    } else {
      this.showSearchBar = false;
    }
  }
  hideSearchBarInMobile(): void {
    this.showSearchBar = false;
  }
  inputFocusOut(): void {
    //this.hideSearchBarInMobile();
  }
  // on focus out hide search options
  focusOut(): void {
    setTimeout(() => {
      this.noResult = false;
      this.searchResult = new Map<string, string>();
    }, 200);
  }

  focusIn(): void {
    if (this.query.value) {
      var val = this.query.value;
      this.query.setValue(val);
    }
  }

  onOptionClick(query): void {
    this.searchResult = new Map<string, string>();
    this.redirectToDetail(query);
  }
  redirectToDetail(complexQuery): void {
    // complex query contains the type of the query appended with pipe
    var queryArray = complexQuery.split("|");
    var query = queryArray[0];
    var route = "";
    switch (queryArray[1]) {
      case "S": {
        route = "/songs";
        break;
      }
      case "A": {
        route = "/artists";
        break;
      }
    }
    this.router.navigate([route, query]);
  }
}
