import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class LoadInterceptor/*  implements HttpInterceptor  */{
  
/*   intercept(req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> 
    { */
/*   const authHeader = '';
     const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
     return next.handle(authReq);
 */
/*       const duplicate = req.clone({ params: req.params.set('filter', 'completed') })       
      return next.handle(req).do(evt => {
      console.log('---> status:', evt.type);
      console.log('---> filter:', req.params.get('filter'));
      console.log('yipee its working');
     }); 
    }*/
}

