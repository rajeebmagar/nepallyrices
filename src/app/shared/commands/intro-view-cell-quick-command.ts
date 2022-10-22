import { IntroViewContent } from "app/shared-models/intro-view-content";
import { Command } from "app/shared/commands/command";
import { Observable } from "rxjs";
export class IntroViewCellQuickCommand {
  command: Command<IntroViewContent>;
  css: string;
  cssForExecuted: string;
  cssFinal: string;
}
