import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDate'
})
export class ToDatePipe implements PipeTransform {

  transform(value: string): Date {
    var datePart = value.split(/[^0-9]+/);//dd/mm/yyy
    //Integer value representing the month, beginning with 0 for January to 11 for December.
    let date = new Date(Number(datePart[2]),Number(datePart[1])-1,Number(datePart[0]));
    return date;
  }

}
