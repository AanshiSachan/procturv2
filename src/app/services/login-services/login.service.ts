import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthenticatorService } from '../authenticator.service';


@Injectable()
export class LoginService {

  urlLogin: string;
  headers: Headers;
  validateOTPurl: string;
  regenerateOTPurl: string;
  forgotPasswordURL: string;
  baseUrl:string = 'http://test999.proctur.com/StdMgmtWebAPI';


  /* institute name and username subscriber */
  private instituteNameSource = new BehaviorSubject<string>('');
  private userNameSource = new BehaviorSubject<string>('');
  private overlayMenu = new BehaviorSubject<boolean>(false);
  private sideNavSource = new BehaviorSubject<string>('');

  currentInstitute = this.instituteNameSource.asObservable();
  currentSidenav = this.sideNavSource.asObservable();
  currentUsername = this.userNameSource.asObservable();
  currentMenuState = this.overlayMenu.asObservable();

  changeInstituteStatus(institute: string){
    this.instituteNameSource.next(institute);
  }

  changeSidenavStatus(sidenav: string){
    this.sideNavSource.next(sidenav);
  }
  
  changeNameStatus(name: string){
    this.userNameSource.next(name);
  }

  changeMenuStatus(menu: boolean){
    this.overlayMenu.next(menu);
  }

  constructor(private http: Http) {
    this.urlLogin = this.baseUrl +"/api/v1/alternateLogin";
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
  }


  postLoginDetails(data): any {
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
