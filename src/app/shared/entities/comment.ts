import {User} from './user';

export class Comment {
    id:number;
    comment:string;
    user:User;
    edited:boolean;
}