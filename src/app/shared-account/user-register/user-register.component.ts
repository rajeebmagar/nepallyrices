import { UserAccountAccessService } from "../user-account-access.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModelStatePipe } from "app/shared/pipes/model-state.pipe";
import { Router } from "@angular/router";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { RegisterUser } from "app/shared/entities/register-user";
import { GoogleAnalyticsEventsService } from "app/shared/services/google-analytics-events.service";
import { AuthService } from "app/identity/auth.service";
import { CustomValidator } from "app/shared/helpers/custom-validator";
import { appsetting } from "app-settings/app-setting";
@Component({
  selector: "nl-user-register",
  templateUrl: "./user-register.component.html",
  styleUrls: ["./user-register.component.css"],
})
export class UserRegisterComponent implements OnInit {
  registerForm: FormGroup;
  modelState = new Array<string>();
  isRequesting: boolean;
  @Output() onUserRegistered = new EventEmitter();
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private userAccountAccessService: UserAccountAccessService
  ) {}

  ngOnInit() {
    //initialize form
    this.registerForm = this.fb.group({
      email: [
        "",
        Validators.compose([Validators.required, CustomValidator.mailFormat]),
      ],
      fullName: ["", Validators.required],
      agree: [false, Validators.required],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required],
    });
    this.registerForm.validator = this.confirmPasswordValidator;
  }
  confirmPasswordValidator(form: FormGroup) {
    const password = form.controls["password"].value;
    const confirmPassword = form.controls["confirmPassword"].value;
    if (password === confirmPassword) {
      return null;
    } else {
      return {
        confirmPassword: true,
      };
    }
  }
  onSubmit(value: any): void {
    this.isRequesting = true;
    let user = new RegisterUser();
    user.email = value.email;
    user.fullName = value.fullName;
    user.password = value.password;
    user.confirmPassword = value.confirmPassword;
    this.authService.registerUserAccount(user).subscribe(
      (data) => {
        this.isRequesting = false;
        this.onUserRegistered.emit();
        this.router.navigate(["/account/registration-successful"]);
      },
      (errorResponse) => {
        this.isRequesting = false;
        this.modelState = new Array<string>(); //clear validation message
        var modelStatePipe = new ModelStatePipe();
        try {
          this.modelState = modelStatePipe.transform(errorResponse.error);
        } catch (err) {
          this.modelState.push(`${appsetting.GENERAL_ERROR_MESSAGE}`);
        }
      }
    );
  }
}
