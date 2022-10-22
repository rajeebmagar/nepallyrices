import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AccountRoutingModule } from "./account-routing.module";
import { RegistrationSuccessfulComponent } from "./registration-successful/registration-successful.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ExternalLoginComponent } from "./external-login/external-login.component";
import { AccountActivatedComponent } from "./account-activated/account-activated.component";
import { RegistrationConfirmationComponent } from "./user-account-access/registration-confirmation/registration-confirmation.component";
import { SharedModule } from "app/shared-module/shared.module";
import { IdentityModule } from "app/identity/identity.module";

@NgModule({
  declarations: [
    RegistrationSuccessfulComponent,
    ResetPasswordComponent,
    ExternalLoginComponent,
    AccountActivatedComponent,
    RegistrationConfirmationComponent,
  ],
  imports: [CommonModule, SharedModule, IdentityModule, AccountRoutingModule],
  providers: [],
})
export class AccountModule {}
