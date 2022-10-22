import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UserAccountFollowerComponent } from "./user-account-follower/user-account-follower.component";

@NgModule({
  declarations: [UserAccountFollowerComponent],
  imports: [CommonModule, RouterModule],
  exports: [UserAccountFollowerComponent],
})
export class SharedUsersModule {}
