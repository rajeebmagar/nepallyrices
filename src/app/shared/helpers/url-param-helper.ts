import { Injectable } from "@angular/core";

@Injectable()
export class UrlParamHelper {
    buildUrlParams(values:any[], paramName:string):string{
        let params = values.reduce((previousValue,paramValue,index)=>{
                              return previousValue.concat(`${paramName}[${index}]=${paramValue}&`);
                            },'');
        return params.substring(0,params.length-1);
      }
}