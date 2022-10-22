import {Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'nl-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  private currentTimeout: number;
  public isDelayedRunning = false;
  public animationType = 'nl-bounce';
  public displayMessage;

  @Input()
  public set type(value: string) {
    this.animationType = value;
  }

  @Input()
  public set message(value: string) {
    this.displayMessage = value;
  }

  @Input()
  public set isRunning(value: boolean) {
    if (!value) {
      this.cancelTimeout();
      this.isDelayedRunning = false;
      return;
    }

    if (this.currentTimeout) {
      return;
    }

    this.currentTimeout = window.setTimeout(() => {
      this.isDelayedRunning = value;
      this.cancelTimeout();
    }, this.delay);
  }

  @Input()
  public delay = 0;

  constructor() {
  }

  ngOnInit() {
  }

  private cancelTimeout(): void {
    clearTimeout(this.currentTimeout);
    this.currentTimeout = undefined;
  }

  ngOnDestroy(): any {
    this.cancelTimeout();
  }

}
