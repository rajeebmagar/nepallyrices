import { Injectable } from "@angular/core";
import { Observable, throwError, BehaviorSubject, of } from "rxjs";
import { appsetting } from "app-settings/app-setting";
import { environment } from "environments/environment";
import { JWTHelper } from "app/shared/helpers/jwt-helper";
import { UserAuthService } from "app/identity/user-auth-service.service";
import { TokenRefreshService } from "app/shared/token-refresh.service";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, switchMap, finalize, filter, take } from "rxjs/operators";
import { AuthService } from "app/identity/auth.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private CLIENT_KEY = `${appsetting.CLIENT_KEY}`;
  private API_TOKEN_URL: string = `${environment.API_ENDPOINT}/` + "token";
  private isRefreshingAccessToken: boolean;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private userAuthServiceService: UserAuthService,
    private authService: AuthService,
    private tokenRefreshService: TokenRefreshService
  ) {
    /*
    this.tokenRefreshService.requestToRefreshToken$.subscribe(() => {
      if (!this.refreshingAccessToken) {
        console.log('request to do refresh token');
        this.updateAccessToken().subscribe();
      }
    })*/
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = this.getAuthenticatedRequest(req);
    // send cloned request with header to the next handler.
    return next
      .handle(authReq)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleUnauthorizedError(error, req, next)
        )
      );
  }
  private getAuthenticatedRequest(request: HttpRequest<any>): HttpRequest<any> {
    // Get the auth token from the service.
    const authToken = this.userAuthServiceService.getAuthorizationToken();
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    return request.clone({
      headers: request.headers.set("Authorization", authToken),
    });
  }

  private handleUnauthorizedError(
    error: HttpErrorResponse,
    req: HttpRequest<any>,
    next: HttpHandler
  ) {
    if (
      error &&
      error.status === 401 &&
      this.userAuthServiceService.isRefreshTokenAvailable()
    ) {
      if (this.isRefreshingAccessToken) {
        // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
        // which means the new token is ready and we can retry the request again
        return this.refreshTokenSubject.pipe(
          filter((result) => result !== null),
          take(1),
          switchMap(() => {
            return next.handle(this.getAuthenticatedRequest(req));
          })
        );
      } else {
        this.isRefreshingAccessToken = true;

        // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
        this.refreshTokenSubject.next(null);

        return this.refreshAccessToken().pipe(
          switchMap((jwt) => {
            this.refreshTokenSubject.next(jwt);
            return next.handle(this.getAuthenticatedRequest(req));
          }),
          finalize(() => (this.isRefreshingAccessToken = false))
        );
      }
    } else {
      return throwError(error);
    }
  }

  private refreshAccessToken(): Observable<JsonWebToken> {
    return this.authService.loginWithRefreshToken();
  }
}
