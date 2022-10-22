import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UserIntro } from "app/shared-models/user-intro";
import { PagedResponse } from "app/shared-models/paged-response";
import { UserWithFollowCommandFactory } from "app/shared/commands/factories/user-with-follow-command-factory";
import { PaginationService } from "app/shared/services/pagination.service";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "nl-user-intro-list",
  templateUrl: "./user-intro-list.component.html",
  styleUrls: ["./user-intro-list.component.css"],
  animations: [
    trigger("displayUserIntroList", [
      transition("void => *", [
        style({ transform: "translateY(-100%)" }),
        animate(100),
      ]),
      transition("* => void", [
        animate(100, style({ transform: "translateY(-100%)" })),
      ]),
    ]),
  ],
})
export class UserIntroListComponent implements OnInit {
  hasMore: boolean;
  private _pagedSongLikers: PagedResponse<UserIntro>;
  userIntros: UserIntro[];
  @Input() displayUserIntroList: boolean;

  @Input() set pagedSongLikers(pagedSongLikers: PagedResponse<UserIntro>) {
    if (pagedSongLikers) {
      this._pagedSongLikers = pagedSongLikers;
      this.userIntros = pagedSongLikers.items;
      this.hasMore = this.paginationService.hasNext(pagedSongLikers.links);
    }
  }

  get pagedSongLikers(): PagedResponse<UserIntro> {
    return this._pagedSongLikers;
  }

  @Output() displayUserIntroListChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    private userWithFollowCommandFactory: UserWithFollowCommandFactory,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {}

  getMoreLikers(): void {
    const nextPageUrl = this.paginationService.getNextPageUrl(
      this.pagedSongLikers.links
    );
    if (nextPageUrl) {
      this.paginationService
        .getNextPageResponse<UserIntro>(nextPageUrl)
        .subscribe((pagedSongLikers) => {
          let userIntros = new Array<UserIntro>();
          userIntros = userIntros.concat(this.userIntros);
          for (const songIntro of pagedSongLikers.items) {
            userIntros.push(songIntro);
          }
          this.hasMore = this.paginationService.hasNext(pagedSongLikers.links);
          this._pagedSongLikers = pagedSongLikers;
          this.userIntros = userIntros;
        });
    }
  }

  close() {
    this.displayUserIntroList = false;
    this.displayUserIntroListChange.emit(false);
  }
}
