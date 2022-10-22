import { Command } from "./command";
import { Injectable } from "@angular/core";
import { IntroViewContent } from "app/shared-models/intro-view-content";

import {
  ShareButton,
  ShareArgs,
} from "app/shared/modules/helpers/share-buttons.class";
import { ShareButtonsService } from "app/shared/modules/service/share-buttons.service";
import { WindowService } from "app/shared/modules/service/window.service";
import { UrlHelper } from "app/shared/url-helper";
import { ShareProvider } from "app/shared/modules/helpers/share-provider.enum";
import { appsetting } from "../../../app-settings/app-setting";
import { ImageDefaultUrlPipe } from "app/shared-module/pipes/image-default-url.pipe";

declare var global: any;
@Injectable()
export abstract class SocialShareCommand implements Command<IntroViewContent> {
  showCommand: boolean = true;
  content: IntroViewContent;
  private window: Window;
  abstract shareButton: ShareButton;

  isExecuted: boolean = false;
  abstract title: string;
  executedTitle: string;

  constructor(
    private sbService: ShareButtonsService,
    private windowService: WindowService,
    private urlHelper: UrlHelper
  ) {
    this.window = windowService.nativeWindow;
  }

  execute(): void {
    if (this.content) {
      this.share();
    }
  }
  share(): void {
    let shareArgs = this.getShareArguments();
    this.window.open(
      this.sbService.share(this.shareButton.provider, shareArgs),
      "newwindow",
      this.sbService.windowAttr()
    );
  }
  getShareArguments(): ShareArgs {
    let imageUrl = this.getImageUrlForShare();
    let url = this.getUrlForShare();
    var tags = `${appsetting.DEFAULT_SHARING_TAG}`;
    let shareArgs = new ShareArgs(
      url,
      this.content.title,
      this.content.shareContent,
      imageUrl,
      tags
    );
    return shareArgs;
  }
  getImageUrlForShare(): string {
    var defaultImageUrl: string = `${appsetting.DEFAULT_SONG_IMAGE}`;
    var imageUrl = new ImageDefaultUrlPipe().transform(
      this.content.thumbnailUrl,
      defaultImageUrl
    ); //fallback for image
    return imageUrl;
  }
  getUrlForShare(): string {
    let url = this.urlHelper.getAbsoluteUrl(this.content.url);
    /** If URL is presented check if it is a valid URL */
    let r =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (!r.test(url)) {
      console.warn(
        "ShareButtons: Invalid URL, switching to window.location.href"
      );
      url = this.window
        ? this.window.location.href
        : typeof global != "undefined"
        ? (<any>global).url
        : "";
    }
    return url;
  }
  initialize(): void {}
}
