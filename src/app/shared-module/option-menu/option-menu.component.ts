import { UrlHelper } from "../../shared/url-helper";
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { SongAudio } from "../../shared-models/song-audio";
import { appsetting } from "../../../app-settings/app-setting";
import { ShareProvider } from "../../shared/modules/helpers/share-provider.enum";
import {
  ShareArgs,
  ShareButton,
} from "../../shared/modules/helpers/share-buttons.class";
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { Command } from "app/shared/commands/command";
import { IntroViewContent } from "app/shared-models/intro-view-content";
declare var $: any;

@Component({
  selector: "nl-option-menu",
  templateUrl: "./option-menu.component.html",
  styleUrls: ["./option-menu.component.css"],
})
export class OptionMenuComponent implements OnInit {
  @Input() commands: Command<IntroViewContent>[];
  @Output() optionMenuDisplayChanged = new EventEmitter<boolean>();

  contextMenuVisible = false;
  constructor() {}

  ngOnInit() {}
  executeCommand(command: Command<IntroViewContent>, event: Event) {
    this.dismissEvent(event);
    command.execute();
  }
  contextMenuContainerClicked(event: Event) {
    this.dismissEvent(event);

    //triggerToggleDropdown trigger another click event
    if (this.contextMenuVisible) {
      this.triggerToggleDropdown(event);
    }
  }
  dismissEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
  triggerToggleDropdown(event: Event): void {
    $(event.target).trigger("click.bs.dropdown");
  }
  toggleDropdown(event: Event) {
    this.dismissEvent(event);
    this.notifySubscriberOnContextMenuVisibilityChanged(true);
    this.triggerToggleDropdown(event);
    this.subscribeToDropdownEvent(event);
  }
  notifySubscriberOnContextMenuVisibilityChanged(visible: boolean): void {
    this.contextMenuVisible = visible;
    this.optionMenuDisplayChanged.next(visible);
  }
  subscribeToDropdownEvent(event: Event): void {
    $(event.target)
      .parent()
      .parent()
      .on("hidden.bs.dropdown", (e) => {
        $(e.currentTarget).unbind(); // for un-register event subscription.
        this.notifySubscriberOnContextMenuVisibilityChanged(false);
      });
  }
}
