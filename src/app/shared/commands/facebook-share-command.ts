import { Injectable } from '@angular/core';
import { ShareButton } from "app/shared/modules/helpers/share-buttons.class";
import { ShareProvider } from "app/shared/modules/helpers/share-provider.enum";
import {SocialShareCommand} from './social-share-command';
@Injectable()
export class FacebookShareCommand extends SocialShareCommand {
    shareButton = new ShareButton(ShareProvider.FACEBOOK, "Share on Facebook", 'cb');
    title: string = 'Share on facebook';
}
