import { Component, OnInit, HostListener } from '@angular/core';
@Component({
  selector: 'nl-home-navigation-bar',
  templateUrl: './home-navigation-bar.component.html',
  styleUrls: ['./home-navigation-bar.component.css']
})
export class HomeNavigationBarComponent implements OnInit {

  constructor() { }
  public navIsTransparent: boolean = true;
  thresholdTop=70;
  ngOnInit() {
  }
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (this.navIsTransparent && number > this.thresholdTop) {
      this.navIsTransparent = false;
    } else if (!this.navIsTransparent && number < this.thresholdTop) {
      this.navIsTransparent = true;
    }
  }
}
