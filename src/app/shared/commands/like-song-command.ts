import { Command } from "./command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { Observable } from "rxjs";
import { SongService } from "app/shared-songs/song.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { SongLikeEventService } from "app/shared/services/song-like-event.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
export class LikeSongCommand implements Command<IntroViewContent> {
  showCommand: boolean = true;

  title: string = "Like";
  executedTitle: string = "Unlike";
  content: IntroViewContent;
  isExecuted: boolean;

  constructor(
    private songService: SongService,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService,
    private songLikeEventService: SongLikeEventService
  ) {}
  initialize(): void {
    this.setLiked();
    this.authService.userLoggedInEvent.subscribe((user) => {
      if (user) {
        this.setLiked();
      } else {
        this.isExecuted = false;
      }
    });

    this.songLikeEventService.onSongLiked$.subscribe((songId) => {
      if (songId === Number(this.content.id)) {
        this.isExecuted = true;
      }
    });
    this.songLikeEventService.onSongUnLiked$.subscribe((songId) => {
      if (songId === Number(this.content.id)) {
        this.isExecuted = false;
      }
    });
  }
  setLiked() {
    if (this.authService.isUserLoggedIn()) {
      this.songService.isLiked(Number(this.content.id)).subscribe((liked) => {
        this.isExecuted = liked;
      });
    }
  }
  execute(): void {
    if (this.authService.isUserLoggedIn()) {
      if (!this.isExecuted) {
        this.like();
      } else {
        this.unLike();
      }
    } else {
      this.userAccountAccessService.showLogin();
    }
  }
  like() {
    this.songService.likeSong(Number(this.content.id)).subscribe((response) => {
      this.isExecuted = true;
      this.songLikeEventService.songLiked(true, Number(this.content.id));
    });
  }
  unLike() {
    this.songService
      .unLikeSong(Number(this.content.id))
      .subscribe((response) => {
        this.isExecuted = false;
        this.songLikeEventService.songLiked(false, Number(this.content.id));
      });
  }
}
