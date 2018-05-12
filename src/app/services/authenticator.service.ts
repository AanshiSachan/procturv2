import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/* Method declared for future purpose for setting authorization after successfull login */

@Injectable()
export class AuthenticatorService {
    public token: string = null;
    public institute_id: any = null;
    public standard_id: any= null;
    public institute_type: any = null;
    public institution_type: any = null;

    private instituteId = new BehaviorSubject<any>(null);
    private authToken = new BehaviorSubject<any>(null);

    currentInstituteId = this.instituteId.asObservable();
    currentAuthKey = this.authToken.asObservable();


     public baseUrl: string = "http://test999.proctur.com/StdMgmtWebAPI";
    // public baseUrl: string = "https://app.proctur.com/StdMgmtWebAPI";

    constructor() {
        //console.log("Auth constructor called");
        this.getAuthToken();
        this.getInstituteId();
    }


    changeInstituteId(id: string){
        //console.log("institute id changed "+id);
        this.instituteId.next(id);
    }

    changeAuthenticationKey(key: string){
        //console.log("Auth changed " +key);
        this.authToken.next(key);
        this.institute_type = sessionStorage.getItem('institute_type');
    }


    getAuthToken() {
        let token = sessionStorage.getItem('Authorization');
        if (token != null) {
            this.changeAuthenticationKey(token);
        }
    }

    getInstituteType() {
        this.institute_type = sessionStorage.getItem('institute_type');
        if (this.institute_type != null) {
            return this.institute_type;
        }
    }

    getInstituteId() {
        let id = sessionStorage.getItem('institute_id');
        if (id != null && id != undefined) {
            this.changeInstituteId(id);
        }
    }

    getStandardId() {
        this.standard_id = sessionStorage.getItem('standard_id');
        if (this.standard_id != null && this.standard_id != undefined) {
            return this.standard_id;
        }
        else {
        }
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    clearStoredData(){
        this.token = null;
        this.institute_id = null;
        this.standard_id = null;
        this.institute_type = null;
        this.institution_type = null;
        sessionStorage.setItem('Authorization', null);
        sessionStorage.setItem('institute_id', null);
        sessionStorage.setItem('institute_type', null);
    }

}
