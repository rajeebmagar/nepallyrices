declare var require: any
var jwtDecode = require('jwt-decode');
export class JWTHelper{
   public static decodedAccessToken(token:string): any {
        if (token && token.length > 0) {
            return jwtDecode(token);
        }
        return null;
    }
    public static getTokenExpirationDate(token:string):Date{
        var decodedAccessToken = this.decodedAccessToken(token);
        var time = decodedAccessToken.exp;
        return new Date(time*1000);
    }
    public static isTokenExpired(token:string):boolean{
        return new Date()>this.getTokenExpirationDate(token);
    }
}