import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from 'app/shared/entities/user';
import {GoogleAnalyticsEventsService} from 'app/shared/services/google-analytics-events.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'nl-user-account-access',
  templateUrl: './user-account-access.component.html',
  styleUrls: ['./user-account-access.component.css'],
  animations: [
    trigger('displayUserAccount', [
      transition('void => *', [
        style({transform: 'translateY(-100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class UserAccountAccessComponent implements OnInit {
  private _displayRegisterTab: boolean;
  private _displayUserAccount: boolean;
  @Input() set displayUserAccount(displayUserAccount: boolean) {
    this._displayUserAccount = displayUserAccount;
    this.logGoogleAnalyticsPageViews();
  }

  get displayUserAccount(): boolean {
    return this._displayUserAccount;
  }

  @Input() set displayRegisterTab(displayRegisterTab: boolean) {
    this._displayRegisterTab = displayRegisterTab;
    this.logGoogleAnalyticsPageViews();
  }

  get displayRegisterTab(): boolean {
    return this._displayRegisterTab;
  }

  @Output() displayUserAccountChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  showForgotPassword = false;
  userInfo: User;

  constructor(
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
  }

  ngOnInit() {
  }

  logGoogleAnalyticsPageViews(): void {
    if (this.displayUserAccount) {
      this.googleAnalyticsEventsService.sendPageView(this.displayRegisterTab ? '/register' : '/login');
    }
  }

  close() {
    this.displayUserAccount = false;
    this.displayRegisterTab = false;
    this.displayUserAccountChange.emit(this.displayUserAccount);
  }

}
