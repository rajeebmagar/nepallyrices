
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
@Injectable()
export class UrlHelper {

    getParameterByName(name, url): string {
        if (!url) url = window.location.href;
        var pm = new URL(url.toString()).hash.split('&')
            .filter(function (el) {
                if (el.match(name) !== null) return true;
            });
        if (pm.length > 0) {
            var value = pm[0].split('=')[1];
            return value;
        }
        return '';
    }
    getParamValue(paramName: string, url?:string): string {
        if (!url) url = window.location.href;
        paramName = paramName.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&#]" + paramName + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    getAbsoluteUrl(currentUrl): string {
        // Resolve the base url as the full absolute url subtract the relative url.
        var baseUrl = environment.APP_ENDPOINT;
        var fullUrl = baseUrl + currentUrl;
        return fullUrl;
    }
}