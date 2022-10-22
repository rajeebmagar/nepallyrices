import { Pipe, PipeTransform } from "@angular/core";
import { UserIntro } from "app/shared-models/user-intro";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { Func } from "app/shared/data-strucutres/func";
import { IntroViewCellQuickCommand } from "app/shared/commands/intro-view-cell-quick-command";
import { Command } from "app/shared/commands/command";

@Pipe({
  name: "userIntroToIntroViewContent",
})
export class UserIntroToIntroViewContentPipe implements PipeTransform {
  transform(
    artists: Array<UserIntro>,
    quickCommandFactory?: Func<IntroViewContent, IntroViewCellQuickCommand>,
    optionCommandsFactory?: Func<IntroViewContent, Command<IntroViewContent>[]>
  ): Array<IntroViewContent> {
    let introViewContents = new Array<IntroViewContent>();
    if (artists) {
      artists.forEach((artist) => {
        introViewContents.push(
          this.mapToIntroViewContent(
            artist,
            quickCommandFactory,
            optionCommandsFactory
          )
        );
      });
    }
    return introViewContents;
  }
  mapToIntroViewContent(
    user: UserIntro,
    quickCommandFactory?: Func<IntroViewContent, IntroViewCellQuickCommand>,
    optionCommandsFactory?: Func<IntroViewContent, Command<IntroViewContent>[]>
  ): IntroViewContent {
    let introViewContent = new IntroViewContent();
    introViewContent.id = user.id;
    introViewContent.urlFriendlyId = user.userName;
    introViewContent.title = user.fullName;
    introViewContent.url = "/" + user.userName;
    if (user.profilePicture)
      introViewContent.thumbnailUrl = user.profilePicture.imageUrl;

    if (quickCommandFactory) {
      introViewContent.quickCommand =
        quickCommandFactory.execute(introViewContent);
    }
    if (optionCommandsFactory) {
      introViewContent.optionCommands =
        optionCommandsFactory.execute(introViewContent);
    }
    return introViewContent;
  }
}
