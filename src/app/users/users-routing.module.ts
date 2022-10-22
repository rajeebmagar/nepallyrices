import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "app/shared-module/shared.module";
import { UserAccountComponent } from "./user-account.component";

const routes: Routes = [
  { path: "", component: UserAccountComponent },
  { path: "contributions", component: UserAccountComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
