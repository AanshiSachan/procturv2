
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';

import {catchError, retryWhen, mergeMap, take, delay, concat} from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatorService } from '../services/authenticator.service';
import { Router } from '@angular/router';
import { Toast, ToasterService, ToasterConfig } from 'angular2-toaster';

@Injectable()
export class I1 implements HttpInterceptor {

    constructor(private auth: AuthenticatorService,
        private router: Router,
        private toasterService: ToasterService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            retryWhen(error => {
                return error.pipe(
                    mergeMap((err) => {
                        console.log('example te', err);
                        if (err instanceof HttpErrorResponse && err.status === 504) { // timeout and retry after 60 seconds
                            return observableOf(err.status).pipe(delay(60000));
                        }
                        /* Bad Request */
                        else if (err instanceof HttpErrorResponse && err.status === 400) {
                            let obj = {
                                type: 'info',
                                title: err.error.message,
                                body: ''
                            };
                            //To generate a toaster error uncomment below line
                            //this.alert.changeErrorObject(JSON.stringify(obj));
                            return observableThrowError(err);
                        }
                        /* Not Found */
                        else if (err instanceof HttpErrorResponse && err.status === 404) {

                        }
                        /* Request Timeout */
                        else if (err instanceof HttpErrorResponse && err.status === 408) {

                        }
                        /* Internal Server Error */
                        else if (err instanceof HttpErrorResponse && err.status === 500) {
                            return observableThrowError(err);
                        }
                        /* Bad Gateway */
                        else if (err instanceof HttpErrorResponse && err.status === 502) {

                        }
                        /* Service Unavailable */
                        else if (err instanceof HttpErrorResponse && err.status === 503) {

                        }
                        /* Gateway Timeout */
                        else if (err instanceof HttpErrorResponse && err.status === 504) {

                        }

                        else if(err instanceof HttpErrorResponse && err.status === 403) {
                            this.toasterService.clear();
                            this.auth.clearStoredData();
                            this.auth.changeAuthenticationKey(null);
                            this.auth.changeInstituteId(null);                            
                            sessionStorage.clear();
                            this.router.navigateByUrl('/authPage');
                        }

                        return observableThrowError({ error: err.error });
                    }),
                    take(1),
                    //.concat(next.handle(req));
                    concat(observableThrowError({ error: 'Sorry, there was an error (after 1 retries)' })),);
            }));
    }
}

@Injectable()
export class I2 implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                return observableThrowError(err);
            }));
    }
}
