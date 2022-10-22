import { Func } from "app/shared/data-strucutres/func";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { IntroViewCellQuickCommand } from "app/shared/commands/intro-view-cell-quick-command";
import { LikeSongCommand } from "app/shared/commands/like-song-command";
import { Injectable } from "@angular/core";
import { SongService } from "app/shared-songs/song.service";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { SongLikeEventService } from "app/shared/services/song-like-event.service";
import { UserAuthService } from "app/identity/user-auth-service.service";
@Injectable()
export class SongWithLikeCommandFactory
  implements Func<IntroViewContent, IntroViewCellQuickCommand>
{
  constructor(
    private songService: SongService,
    private authService: UserAuthService,
    private userAccountAccessService: UserAccountAccessService,
    private songLikeEventService: SongLikeEventService
  ) {}
  execute(introViewContent: IntroViewContent): IntroViewCellQuickCommand {
    let introViewCellQuickCommand = new IntroViewCellQuickCommand();
    introViewCellQuickCommand.command = new LikeSongCommand(
      this.songService,
      this.authService,
      this.userAccountAccessService,
      this.songLikeEventService
    );
    introViewCellQuickCommand.command.content = introViewContent;
    introViewCellQuickCommand.command.initialize();
    introViewCellQuickCommand.css = "fa fa-heart-o";
    introViewCellQuickCommand.cssForExecuted = "fa fa-heart active";
    return introViewCellQuickCommand;
  }
}
