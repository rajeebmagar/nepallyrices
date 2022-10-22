import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccountActivatedComponent } from "app/account/account-activated/account-activated.component";
import { ExternalLoginComponent } from "app/account/external-login/external-login.component";
import { RegistrationSuccessfulComponent } from "app/account/registration-successful/registration-successful.component";
import { ResetPasswordComponent } from "app/account/reset-password/reset-password.component";
import { RegistrationConfirmationComponent } from "app/account/user-account-access/registration-confirmation/registration-confirmation.component";

const routes: Routes = [
  {
    path: "registration-successful",
    component: RegistrationSuccessfulComponent,
  },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "external-login", component: ExternalLoginComponent },
  { path: "account-activated", component: AccountActivatedComponent },
  {
    path: "comfirmation-email-sent",
    component: RegistrationConfirmationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
