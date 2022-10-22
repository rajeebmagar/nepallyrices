import { CustomValidator } from "../../shared/helpers/custom-validator";
import { appsetting } from "../../../app-settings/app-setting";
import { ModelStatePipe } from "../../shared/pipes/model-state.pipe";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DOCUMENT } from "@angular/common";
import { ResetPassword } from "../../shared/entities/reset-password";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Component, Inject, OnInit } from "@angular/core";
import { UrlHelper } from "../../shared/url-helper";
import { AuthService } from "app/identity/auth.service";
@Component({
  selector: "nl-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
  providers: [UrlHelper],
})
export class ResetPasswordComponent implements OnInit {
  passwordResetForm: FormGroup;
  private subscription: Subscription;
  modelState = new Array<string>();
  code: string;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    @Inject(UrlHelper) public urlHelper: UrlHelper,
    @Inject(DOCUMENT) private document: any,
    private fb: FormBuilder
  ) {}
  passwordReset: boolean;
  ngOnInit() {
    //subscribe to router event
    this.code = this.route.snapshot.queryParams["code"];
    this.passwordResetForm = this.fb.group({
      email: [
        "",
        Validators.compose([Validators.required, CustomValidator.mailFormat]),
      ],
      passwords: this.fb.group({
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
      }),
    });
    this.subscribeToFormChangesAndSetValidity();
  }
  resetPassword(value: any): void {
    this.authService
      .resetPassword(
        value.email,
        value.passwords.password,
        value.passwords.confirmPassword,
        this.code
      )
      .subscribe(
        (response) => {
          if (response) {
            this.passwordReset = true;
          }
        },
        (error) => {
          var modelStatePipe = new ModelStatePipe();
          try {
            this.modelState = modelStatePipe.transform(error.json().modelState);
          } catch (err) {
            this.modelState.push(`${appsetting.GENERAL_ERROR_MESSAGE}`);
          }
        }
      );
  }

  subscribeToFormChangesAndSetValidity() {
    const passwordResetFormValueChanges$ =
      this.passwordResetForm.controls["passwords"].valueChanges;

    passwordResetFormValueChanges$.subscribe((x) => {
      if (x.password === x.confirmPassword) {
        this.passwordResetForm.controls["passwords"].setErrors(null);
      } else {
        this.passwordResetForm.controls["passwords"]["controls"][
          "confirmPassword"
        ].setErrors({ notValid: true });
      }
    });
  }
}
