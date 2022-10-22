import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SetUserAccountProfilePictureService } from "./set-user-account-profile-picture.service";
import { GetUserCoverPicturesService } from "./get-user-cover-pictures.service";
import { SetUserAccountCoverPictureService } from "./set-user-account-cover-picture.service";
import { GetUserProfilePicturesService } from "./get-user-profile-pictures.service";
import { UserAccountService } from "./user-account.service";
import { UserFollowChangeEventService } from "./user-follow-change-event.service";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule],
  providers: [
    SetUserAccountProfilePictureService,
    SetUserAccountCoverPictureService,
    UserAccountService,
    GetUserCoverPicturesService,
    GetUserProfilePicturesService,
    UserFollowChangeEventService,
  ],
  exports: [],
})
export class UserAccountServicesModule {}
