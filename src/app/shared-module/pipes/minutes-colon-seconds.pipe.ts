import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesColonSeconds'
})
export class MinutesColonSecondsPipe implements PipeTransform {

  transform(totalSeconds: number): string {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds - (minutes * 60));
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }
  private pad(num) {
    var s = "0" + num;
    return s.substr(s.length - 2);
  }

}
