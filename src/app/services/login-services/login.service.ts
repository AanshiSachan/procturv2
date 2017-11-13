import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AuthenticatorService } from '../authenticator.service';


@Injectable()
export class LoginService {

  urlLogin: string;
  headers: Headers;
  validateOTPurl: string;
  regenerateOTPurl: string;
  forgotPasswordURL: string;
  baseUrl:string = 'http://test999.proctur.com/StdMgmtWebAPI';

  constructor(private http: Http) {

    this.urlLogin = this.baseUrl +"/api/v1/alternateLogin";
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
  }


  postLoginDetails(data): any {
    console.log(data);
    return this.http.post(this.urlLogin, data, { headers: this.headers }).map(res => {
      return res.json();
    });
  }

  validateOTPCode(data) {
    this.validateOTPurl = this.baseUrl +"/api/v1/alternateLogin/register/validateOTP";
    return this.http.post(this.validateOTPurl, data, { headers: this.headers }).map(res => {
      return res.json();
    })
  }

  regenerateOTP(data) {
    this.regenerateOTPurl = this.baseUrl + "/api/v1/authenticate/regenerateOTP";
    return this.http.post(this.regenerateOTPurl, data, { headers: this.headers }).map(res => {
      return res.json();
    })
  }

  forgotPassowrdServiceMethod(data) {
    this.forgotPasswordURL = this.baseUrl + "/api/v1/alternateLogin/forgotPswd";
    return this.http.post(this.forgotPasswordURL, data, { headers: this.headers }).map(
      res => {
        return res.json();
      })
  }

  logoutUser(): boolean {
    // remove user from local storage to log user out
    sessionStorage.clear();
    localStorage.clear();
    return true;
  }

}
