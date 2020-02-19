import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class I1 implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .retryWhen(error => {
                return error
                    .flatMap((err) => {
                        if (err instanceof HttpErrorResponse && err.status === 504) { // timeout and retry after 60 seconds
                            return Observable.of(err.status).delay(60000);
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
                            return Observable.throw(err);
                        }
                        /* Not Found */
                        else if (err instanceof HttpErrorResponse && err.status === 404) {

                        }
                        /* Request Timeout */
                        else if (err instanceof HttpErrorResponse && err.status === 408) {

                        }
                        /* Internal Server Error */
                        else if (err instanceof HttpErrorResponse && err.status === 500) {
                            return Observable.throw(err);
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

                        return Observable.throw({ error: 'No retry' });
                    })
                    .take(1)
                    //.concat(next.handle(req));
                    .concat(Observable.throw({ error: 'Sorry, there was an error (after 1 retries)' }));
            });
    }
}

@Injectable()
export class I2 implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .catch(err => {
                return Observable.throw(err);
            });
    }
}
