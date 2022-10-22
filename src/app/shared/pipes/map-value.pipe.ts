import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapValue'
})
export class MapValuePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var data = <Map<any,any>>value;
    return data.get(args);
  }

}
