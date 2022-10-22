import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PagesRoutingModule } from "./pages-routing.module";
import { CookiePolicyComponent } from "./cookie-policy/cookie-policy.component";
import { TermsOfUseComponent } from "./terms-of-use/terms-of-use.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { CommunityGuidelinesComponent } from "./community-guidelines/community-guidelines.component";
import { CopyrightComponent } from "./copyright/copyright.component";
import { AboutNepalyricsComponent } from "./about-nepalyrics/about-nepalyrics.component";
import { SharedModule } from "app/shared-module/shared.module";

@NgModule({
  declarations: [
    CookiePolicyComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    CommunityGuidelinesComponent,
    CopyrightComponent,
    AboutNepalyricsComponent,
  ],
  imports: [CommonModule, PagesRoutingModule, SharedModule],
})
export class PagesModule {}
