import { Component, OnInit } from "@angular/core";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";

@Component({
  selector: "nl-account-activated",
  templateUrl: "./account-activated.component.html",
  styleUrls: ["./account-activated.component.css"],
})
export class AccountActivatedComponent implements OnInit {
  constructor(private userAccountAccessService: UserAccountAccessService) {}

  ngOnInit() {}
  showLogin(): void {
    this.userAccountAccessService.showLogin();
  }
}
