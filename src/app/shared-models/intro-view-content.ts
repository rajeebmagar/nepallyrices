import {Anchor} from './anchor';
import {SongAudio} from './song-audio';
import {IntroViewCellQuickCommand} from 'app/shared/commands/intro-view-cell-quick-command';
import {Command} from 'app/shared/commands/command';
import { ArtistIntro } from './artist-intro';
export class IntroViewContent {
    id:string;
    parentId:any;
    urlFriendlyId:string;
    title: string;
    shareContent: string;
    thumbnailUrl: string;
    url:string;
    anchors:Anchor[];
    subtitles:string[];
    songAudio: SongAudio;
    artist: ArtistIntro;
    quickCommand: IntroViewCellQuickCommand;
    optionCommands: Command<IntroViewContent>[];
}