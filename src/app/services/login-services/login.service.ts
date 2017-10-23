import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import {AuthenticatorService} from '../authenticator.service';


@Injectable()
export class LoginService {

  urlLogin: string;
  headers: Headers;


  constructor(private http: Http) { 

    this.urlLogin = "https://app.proctur.com/StdMgmtWebAPI/api/v1/alternateLogin";
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
  }


  postLoginDetails(data): any{
    console.log(data);
    return this.http.post(this.urlLogin, data, {headers: this.headers}).map(res => {
      return res.json();
    });
  }


  logoutUser(): boolean{
    // remove user from local storage to log user out
    sessionStorage.clear();
    return true;
  }

}
