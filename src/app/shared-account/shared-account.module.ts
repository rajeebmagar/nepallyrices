import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { UserRegisterComponent } from "./user-register/user-register.component";
import { UserAccountAccessComponent } from "./user-account-access.component";
import { UserAccountAccessService } from "./user-account-access.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    UserAccountAccessComponent,
    ForgotPasswordComponent,
    UserLoginComponent,
    UserRegisterComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [UserAccountAccessComponent],
})
export class SharedAccountModule {}
