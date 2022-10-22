import { Pipe, PipeTransform } from "@angular/core";
import { ArtistIntro } from "app/shared-models/artist-intro";
import { Func } from "app/shared/data-strucutres/func";
import { IntroViewCellQuickCommand } from "app/shared/commands/intro-view-cell-quick-command";
import { Command } from "app/shared/commands/command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
@Pipe({
  name: "artistIntroToIntroViewContent",
})
export class ArtistIntroToIntroViewContentPipe implements PipeTransform {
  transform(
    artists: Array<ArtistIntro>,
    quickCommandFactory?: Func<IntroViewContent, IntroViewCellQuickCommand>,
    optionCommandsFactory?: Func<IntroViewContent, Command<IntroViewContent>[]>
  ): Array<IntroViewContent> {
    let introViewContents = new Array<IntroViewContent>();
    artists.forEach((artist) => {
      introViewContents.push(
        this.mapToIntroViewContent(
          artist,
          quickCommandFactory,
          optionCommandsFactory
        )
      );
    });
    return introViewContents;
  }
  mapToIntroViewContent(
    artist: ArtistIntro,
    quickCommandFactory?: Func<IntroViewContent, IntroViewCellQuickCommand>,
    optionCommandsFactory?: Func<IntroViewContent, Command<IntroViewContent>[]>
  ): IntroViewContent {
    let introViewContent = new IntroViewContent();
    introViewContent.id = artist.artistId;
    introViewContent.urlFriendlyId = artist.urlFriendlyName;
    introViewContent.title = artist.name;
    introViewContent.url = "/artists/" + artist.urlFriendlyName;
    introViewContent.artist = artist;
    if (artist.image) {
      introViewContent.thumbnailUrl = artist.image.imageUrl;
    }

    introViewContent.subtitles = new Array<string>();
    introViewContent.subtitles.push(artist.address);

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
