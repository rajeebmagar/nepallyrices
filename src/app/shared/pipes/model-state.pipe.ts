import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modelState'
})
export class ModelStatePipe implements PipeTransform {

  transform(errors: any): Array<string> {
    if(errors.modelState){
      errors = errors.modelState
    }
    else if(errors.message){ 
      errors = [errors.message]; //if response contains message object
    }
    var tmp = new Array<string>();
    for (var k in errors) {
      if(errors[k] instanceof  Array){
          errors[k].forEach(function(k){                   
            tmp.push(k);
          });
      }else{
        tmp.push(errors[k]);  
      }     
    }
    return tmp; 
  }
}
