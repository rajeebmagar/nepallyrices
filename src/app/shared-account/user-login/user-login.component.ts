import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "environments/environment";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { UserAccountAccessService } from "app/shared-account/user-account-access.service";
import { AuthService } from "app/identity/auth.service";
@Component({
  selector: "nl-user-login",
  templateUrl: "./user-login.component.html",
  styleUrls: ["./user-login.component.css"],
})
export class UserLoginComponent implements OnInit {
  @Output() onUserLoggedIn = new EventEmitter();
  @Output() onForgotPasswordClicked = new EventEmitter();
  private API_ENDPOINT: string = `${environment.API_ENDPOINT}/`;
  private facebookExternalLogin: string;
  private googlePlusExternalLogin: string;
  model: any = {};
  error: string;
  loginForm: FormGroup;
  isRequesting: boolean;
  userName: string;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private userAccountAccessService: UserAccountAccessService
  ) {}

  ngOnInit(): void {
    //initialize form
    this.loginForm = this.fb.group({
      userName: ["", Validators.required],
      password: ["", Validators.required],
    });
    if (this.facebookExternalLogin == undefined) {
      this.authService.getExternalLoginUrls().subscribe((val) => {
        if (val != undefined) {
          for (var i = 0; i < val.length; i++) {
            if (val[i].name == "Facebook")
              this.facebookExternalLogin = val[i].url;
            if (val[i].name == "Google")
              this.googlePlusExternalLogin = val[i].url;
            // if (val[i].name == "Twitter")
            //     this.facebookExternalLogin = val[i].url;
          }
        }
      });
    }
  }
  onSubmit(value: any): void {
    this.isRequesting = true;
    this.userName = value.userName;
    this.authService.login(value.userName, value.password).subscribe(
      (data) => {
        this.onUserLoggedIn.emit();
        this.isRequesting = false;
        if (
          this.userAccountAccessService.redirectRoute &&
          this.userAccountAccessService.redirectRoute.length > 0
        ) {
          if (
            this.userAccountAccessService.redirectRoute ===
            "/account/account-activated"
          ) {
            this.userAccountAccessService.redirectRoute = "/";
          }
          this.router.navigateByUrl(
            this.userAccountAccessService.redirectRoute
          );
          this.userAccountAccessService.redirected();
        }
      },
      (error) => {
        this.error = error.error.error_description;
        this.isRequesting = false;
      }
    );
  }

  forgotPassword(): void {
    this.onForgotPasswordClicked.emit();
  }
  resendEmailConfirmation(): void {
    this.authService.resendEmailConfirmation(this.userName).subscribe(
      (data) => {
        this.router.navigate(["/account/comfirmation-email-sent"]);
        this.onUserLoggedIn.emit(); // close modal
      },
      (error) => {}
    );
  }

  onFacebookLoginClick() {
    var url = this.API_ENDPOINT + "/" + this.facebookExternalLogin;
    location.href = url;
  }

  onGoogleLoginClick() {
    var url = this.API_ENDPOINT + "/" + this.googlePlusExternalLogin;
    location.href = url;
  }
}
