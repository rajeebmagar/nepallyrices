import {
  Component, OnInit, Input, Output,
  EventEmitter,
} from '@angular/core';
import { FacebookPage } from 'app/shared/entities/facebook-page';
import { NepalyricsFacebookSharingService } from 'app/nepalyrics-sharing/nepalyrics-facebook-sharing.service';
import { SocialSharing } from 'app/shared/entities/social-sharing';
import {animate, style, transition, trigger} from '@angular/animations';
@Component({
  selector: 'nl-facebook-pages',
  templateUrl: './facebook-pages.component.html',
  styleUrls: ['./facebook-pages.component.css'],
  providers: [NepalyricsFacebookSharingService],
  animations: [
    trigger('displayFacebookPages', [
      transition('void => *', [
        style({ transform: 'translateY(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class FacebookPagesComponent implements OnInit {

  private _accessToken: string;
  @Input()
  set accessToken(token: string) {
    this._accessToken = token;
    if (token)
      this.loadFacebookPages();
  }
  get accessToken(): string {
    return this._accessToken;
  }

  @Input()
  displayFacebookPages: boolean;

  @Output() facebookPageSelected: EventEmitter<SocialSharing> = new EventEmitter<SocialSharing>();


  facebookPages: FacebookPage[] = [];
  selectedFacebookPage: FacebookPage;

  constructor(private nepalyricsFacebookSharingService: NepalyricsFacebookSharingService) { }

  ngOnInit() {
  }

  loadFacebookPages(): void {
    this.nepalyricsFacebookSharingService.getPages(this._accessToken)
      .subscribe(pages => {
        this.facebookPages = pages;
      });
  }
  connect(): void {
    if (this.facebookPageSelected) {

      let socialSharing = new SocialSharing();
      socialSharing.accessToken = this.selectedFacebookPage.accessToken;
      socialSharing.providerKey = this.selectedFacebookPage.id;
      socialSharing.provider = 'facebook';
      this.facebookPageSelected.next(socialSharing);
      this.close();
    }
    else{
      alert('select a page');
    }
  }
  close(): void {
    this.displayFacebookPages = false;
  }
}
