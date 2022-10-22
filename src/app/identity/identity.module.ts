import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "./auth.service";
import { UserAuthService } from "./user-auth-service.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthService, UserAuthService],
})
export class IdentityModule {}
