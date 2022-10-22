import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { appsetting } from "app-settings/app-setting";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CustomValidator } from "app/shared/helpers/custom-validator";
import { AuthService } from "app/identity/auth.service";
import { ModelStatePipe } from "app/shared/pipes/model-state.pipe";

@Component({
  selector: "nl-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  @Output() havePasswordClicked = new EventEmitter();
  nlForm: FormGroup;

  resetLinkSent: boolean;
  modelState = new Array<string>();
  isRequesting: boolean;
  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.nlForm = this.fb.group({
      email: [
        "",
        Validators.compose([Validators.required, CustomValidator.mailFormat]),
      ],
    });
  }
  havePassword(): void {
    this.havePasswordClicked.emit();
  }
  onForgotPasswordSubmit(value: any): void {
    this.isRequesting = false;
    this.authService.forgotPassword(value.email).subscribe(
      () => {
        this.isRequesting = false;
        this.resetLinkSent = true;
      },
      (error) => {
        this.isRequesting = false;
        var modelStatePipe = new ModelStatePipe();
        this.modelState = new Array<string>(); //clear validation message
        try {
          this.modelState = modelStatePipe.transform(error.json());
        } catch (err) {
          this.modelState.push(`${appsetting.GENERAL_ERROR_MESSAGE}`);
        }
      }
    );
  }
}
