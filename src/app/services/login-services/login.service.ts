import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthenticatorService } from '../authenticator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class LoginService {

  urlLogin: string;
  headers: any;
  validateOTPurl: string;
  regenerateOTPurl: string;
  forgotPasswordURL: string;
  baseUrl: string = '';
  Authorization: any = '';
  public instituteList: string[] = ['100057', '100058', '100123', '100180', '100126', '100127', '100174', '100118', '100321', '100423', '100495', '100496', '100497', '100498', '100202', '100203', '100204', '100391', '100213', '100220', '100221', '100392', '100410', '100444', '100231', '100302', '100380', '100438', '100568', '100580'];

  /* 100533 100423 for divya video purpose */

  /* institute name and username subscriber */
  private instituteNameSource = new BehaviorSubject<string>('');
  private userNameSource = new BehaviorSubject<string>('');
  private overlayMenu = new BehaviorSubject<boolean>(false);
  private sideNavSource = new BehaviorSubject<string>('');
  private permissionSource = new BehaviorSubject<any>('');
  private userTypeSource = new BehaviorSubject<any>('');

  currentInstitute = this.instituteNameSource.asObservable();
  currentSidenav = this.sideNavSource.asObservable();
  currentUsername = this.userNameSource.asObservable();
  currentMenuState = this.overlayMenu.asObservable();
  currentPermissions = this.permissionSource.asObservable();
  currentUserType = this.userTypeSource.asObservable();


  changePermissions(data: any) {
    this.permissionSource.next(data);
  }

  changeUserType(id: string | number) {
    this.userTypeSource.next(id);
  }

  changeInstituteStatus(institute: string) {
    this.instituteNameSource.next(institute);
  }

  changeSidenavStatus(sidenav: string) {
    this.sideNavSource.next(sidenav);
  }

  changeNameStatus(name: string) {
    this.userNameSource.next(name);
  }

  changeMenuStatus(menu: boolean) {
    this.overlayMenu.next(menu);
  }

  constructor(private http: HttpClient, private auth: AuthenticatorService) {
    this.baseUrl = this.auth.getBaseUrl();
    this.urlLogin = this.baseUrl + "/api/v1/alternateLogin";
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders(
        { "Content-Type": "application/json", "Authorization": this.Authorization });
    })
  }


  postLoginDetails(data): any {
    return this.http.post(this.urlLogin, data, { headers: this.headers }).map(res => {
      return res;
    });
  }

  validateOTPCode(data) {
    this.validateOTPurl = this.baseUrl + "/api/v1/alternateLogin/register/validateOTP";
    return this.http.post(this.validateOTPurl, data, { headers: this.headers }).map(res => {
      return res;
    })
  }

  regenerateOTP(data) {
    this.regenerateOTPurl = this.baseUrl + "/api/v1/authenticate/regenerateOTP";
    return this.http.post(this.regenerateOTPurl, data, { headers: this.headers }).map(res => {
      return res;
    })
  }

  forgotPassowrdServiceMethod(data) {
    this.forgotPasswordURL = this.baseUrl + "/api/v1/alternateLogin/forgotPswd";
    return this.http.post(this.forgotPasswordURL, data, { headers: this.headers }).map(
      res => {
        return res;
      })
  }

  logoutUser(): boolean {
    // remove user from local storage to log user out
    this.auth.clearStoredData();
    this.auth.changeAuthenticationKey(null);
    this.auth.changeInstituteId(null);
    this.changeSidenavStatus('unauthorized');
    sessionStorage.clear();
    localStorage.clear();
    return true;
  }

  getAllInstituteId() {
    return this.instituteList;
  }

  changePasswordService(obj) {
    let url = this.baseUrl + "/api/v1/changePwd";
    return this.http.post(url, obj, { headers: this.headers }).map(
      res => { return res; },
      err => { return err; }
    )
  }

  storeInstituteInfoToSession() {
    let url = this.baseUrl + "/api/v1/institutes/" + sessionStorage.getItem('institute_id');
    return this.http.get(url, {headers: this.headers}).map(
      res => { return res; },
      err => { return err; }
    );
  }

}
