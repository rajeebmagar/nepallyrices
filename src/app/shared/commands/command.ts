import {Observable} from 'rxjs';
export interface Command<T> {
    content:T;
    execute():void;
    initialize():void;
    isExecuted:boolean;
    showCommand:boolean;
    title:string;
    executedTitle:string;
}
