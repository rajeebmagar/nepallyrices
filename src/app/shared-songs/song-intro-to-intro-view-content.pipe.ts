import { Pipe, PipeTransform } from "@angular/core";
import { SongIntro } from "app/shared-models/song-intro";
import { Anchor } from "app/shared-models/anchor";
import { Func } from "app/shared/data-strucutres/func";
import { IntroViewCellQuickCommand } from "app/shared/commands/intro-view-cell-quick-command";
import { Command } from "app/shared/commands/command";
import { ArtistRolesToAnchorsPipe } from "app/shared-artists/pipes/artist-roles-to-anchors.pipe";
import { IntroViewContent } from "app/shared-models/intro-view-content";
@Pipe({
  name: "songIntroToIntroViewContent",
})
export class SongIntroToIntroViewContentPipe implements PipeTransform {
  constructor(private artistRolesToAnchorsPipe: ArtistRolesToAnchorsPipe) {}
  transform(
    songIntros: Array<SongIntro>,
    quickCommandFactory?: Func<IntroViewContent, IntroViewCellQuickCommand>,
    optionCommandsFactory?: Func<IntroViewContent, Command<IntroViewContent>[]>,
    parentId?: any
  ): Array<IntroViewContent> {
    let introViewContents = new Array<IntroViewContent>();

    for (let songIntro of songIntros) {
      introViewContents.push(
        this.mapToIntroViewContent(
          songIntro,
          quickCommandFactory,
          optionCommandsFactory,
          parentId
        )
      );
    }
    return introViewContents;
  }
  mapToIntroViewContent(
    songIntro: SongIntro,
    quickCommandFactory?: Func<IntroViewContent, IntroViewCellQuickCommand>,
    optionCommandsFactory?: Func<IntroViewContent, Command<IntroViewContent>[]>,
    parentId?: any
  ): IntroViewContent {
    let introViewContent = new IntroViewContent();
    introViewContent.id = songIntro.id.toString();
    if (parentId) {
      introViewContent.parentId = parentId;
    }
    introViewContent.urlFriendlyId = songIntro.urlFriendlyTitle;
    introViewContent.title = songIntro.title;
    introViewContent.url = "/songs/" + songIntro.urlFriendlyTitle;
    if (songIntro.image)
      introViewContent.thumbnailUrl = songIntro.image.imageUrl;

    if (songIntro.singers)
      introViewContent.anchors = this.artistRolesToAnchorsPipe.transform(
        songIntro.singers
      );

    if (songIntro.audios.length > 0) {
      introViewContent.songAudio = songIntro.audios[0];
      introViewContent.songAudio.songId = songIntro.id;
      introViewContent.songAudio.songIntro = songIntro;

      if (quickCommandFactory) {
        introViewContent.quickCommand =
          quickCommandFactory.execute(introViewContent);
      }
      if (optionCommandsFactory) {
        introViewContent.optionCommands =
          optionCommandsFactory.execute(introViewContent);
      }
    }
    return introViewContent;
  }
}
