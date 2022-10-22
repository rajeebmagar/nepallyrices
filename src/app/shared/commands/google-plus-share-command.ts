import { Injectable } from '@angular/core';
import { ShareButton } from "app/shared/modules/helpers/share-buttons.class";
import { ShareProvider } from "app/shared/modules/helpers/share-provider.enum";
import {SocialShareCommand} from './social-share-command';
@Injectable()
export class GooglePlusShareCommand extends SocialShareCommand {
    shareButton = new ShareButton(ShareProvider.GOOGLEPLUS, "Share on Google+", 'cb');
    title: string = 'Share on Google+';
}
