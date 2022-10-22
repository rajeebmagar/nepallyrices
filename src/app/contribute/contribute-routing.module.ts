import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CanActivateGaurd } from "app/shared/gaurds/can-activate-gaurd";
import { CanLeaveContribute } from "app/contribute/can-leave-contribute";
import { ContributeComponent } from "./contribute.component";

const routes: Routes = [
  {
    path: "",
    component: ContributeComponent,
    canActivate: [CanActivateGaurd],
    canDeactivate: [CanLeaveContribute],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
})
export class ContributeRoutingModule {}
