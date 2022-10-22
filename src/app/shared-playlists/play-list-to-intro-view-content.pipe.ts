import { Pipe, PipeTransform } from "@angular/core";
import { IntroViewContent } from "app/shared-models/intro-view-content";
import { PlayList } from "app/shared/entities/play-list";
import { Func } from "app/shared/data-strucutres/func";
import { IntroViewCellQuickCommand } from "app/shared/commands/intro-view-cell-quick-command";
import { Command } from "app/shared/commands/command";
import { GenresToAnchorsPipe } from "app/shared-songs/genres-to-anchors.pipe";
@Pipe({
  name: "playListToIntroViewContent",
})
export class PlayListToIntroViewContentPipe implements PipeTransform {
  constructor(private genresToAnchorsPipe: GenresToAnchorsPipe) {}
  transform(
    playlists: Array<PlayList>,
    quickCommandFactory?: Func<IntroViewContent, IntroViewCellQuickCommand>,
    optionCommandsFactory?: Func<IntroViewContent, Command<IntroViewContent>[]>
  ): Array<IntroViewContent> {
    let introViewContents = new Array<IntroViewContent>();

    for (let playlist of playlists) {
      let introViewContent = this.mapToIntroViewContent(
        playlist,
        quickCommandFactory,
        optionCommandsFactory
      );
      introViewContents.push(introViewContent);
    }
    return introViewContents;
  }
  mapToIntroViewContent(
    playlist: PlayList,
    quickCommandFactory?: Func<IntroViewContent, IntroViewCellQuickCommand>,
    optionCommandsFactory?: Func<IntroViewContent, Command<IntroViewContent>[]>
  ): IntroViewContent {
    let introViewContent = new IntroViewContent();
    introViewContent.id = playlist.id.toString();
    introViewContent.title = playlist.title;
    introViewContent.url = "/playlists/" + playlist.id;
    if (playlist.profilePicture)
      introViewContent.thumbnailUrl = playlist.profilePicture.imageUrl;
    if (playlist.genres)
      introViewContent.anchors = this.genresToAnchorsPipe.transform(
        playlist.genres
      );
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
