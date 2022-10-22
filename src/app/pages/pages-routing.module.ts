import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AboutNepalyricsComponent } from "./about-nepalyrics/about-nepalyrics.component";
import { CommunityGuidelinesComponent } from "./community-guidelines/community-guidelines.component";
import { CookiePolicyComponent } from "./cookie-policy/cookie-policy.component";
import { CopyrightComponent } from "./copyright/copyright.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { TermsOfUseComponent } from "./terms-of-use/terms-of-use.component";

const routes: Routes = [
  { path: "", redirectTo: "about-nepalyrics" },
  { path: "cookies-policy", component: CookiePolicyComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "about-nepalyrics", component: AboutNepalyricsComponent },
  { path: "terms-of-use", component: TermsOfUseComponent },
  { path: "copyright", component: CopyrightComponent },
  { path: "community-guidelines", component: CommunityGuidelinesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
