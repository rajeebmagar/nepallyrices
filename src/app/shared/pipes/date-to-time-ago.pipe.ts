import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'dateToTimeAgo'
})
export class DateToTimeAgoPipe implements PipeTransform {

  transform(date: Date): string {
    return moment(date).fromNow();
  }

}
