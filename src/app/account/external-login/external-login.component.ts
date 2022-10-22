import { CustomValidator } from "../../shared/helpers/custom-validator";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { appsetting } from "../../../app-settings/app-setting";
import { ModelStatePipe } from "../../shared/pipes/model-state.pipe";
import { DOCUMENT } from "@angular/common";
import { UrlHelper } from "../../shared/url-helper";
import { RegisterExternalUser } from "../../shared/entities/register-external-user";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, Inject, OnInit } from "@angular/core";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { AuthService } from "app/identity/auth.service";

@Component({
  selector: "nl-external-login",
  templateUrl: "./external-login.component.html",
  styleUrls: ["./external-login.component.css"],
  providers: [UrlHelper],
})
export class ExternalLoginComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userAuthService: UserAuthService,
    private router: Router,
    @Inject(UrlHelper) public urlHelper: UrlHelper,
    @Inject(DOCUMENT) private document: any,
    private fb: FormBuilder
  ) {}
  private access_token: string;
  registerForm: FormGroup;
  month: string;
  day: string;
  year: string;
  userRegistered: boolean = true; //used to avoid registration page flickering
  modelState = new Array<string>();

  ngOnInit() {
    //initialize form
    this.registerForm = this.fb.group({
      email: [
        "",
        Validators.compose([Validators.required, CustomValidator.mailFormat]),
      ],
      fullName: ["", Validators.required],
      agree: [false, Validators.required],
    });

    var url = this.document.location.href;
    if (url) {
      this.access_token = this.urlHelper.getParameterByName(
        "access_token",
        url
      );
      this.userAuthService.setAccessToken(this.access_token, false);
      this.authService.getUserInfo().subscribe((response) => {
        if (response) {
          if (!response.hasRegistered) {
            this.userAuthService.clear();
            this.userRegistered = false;
            this.registerForm.get("email").setValue(response.email);
            this.registerForm
              .get("fullName")
              .setValue(
                `${response.firstName} ${response.middleName} ${response.lastName}`
              );
          } else if (response.emailConfirmed == true) {
            this.userAuthService.setAccessToken(this.access_token);
            this.router.navigate(["/"]);
          } else {
            //email is not confirmed yet
            this.router.navigate(["/account/registration-successful"]);
          }
        }
      });
    }
  }
  onSubmit(value: any): void {
    let user = new RegisterExternalUser();
    user.email = value.email;
    user.fullName = value.fullName;
    this.authService.registerExternalUserAccount(user).subscribe(
      (data) => {
        this.router.navigate(["/account/registration-successful"]);
      },
      (errorResponse) => {
        var modelStatePipe = new ModelStatePipe();
        this.modelState = new Array<string>(); // clear validation message
        try {
          this.modelState = modelStatePipe.transform(errorResponse.error);
        } catch (err) {
          this.modelState.push(`${appsetting.GENERAL_ERROR_MESSAGE}`);
        }
      }
    );
  }
}
