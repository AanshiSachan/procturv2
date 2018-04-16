import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

/* Method declared for future purpose for setting authorization after successfull login */

@Injectable()
export class AuthenticatorService {
    public token: string = null;
    public institute_id: any = null;
    public standard_id: any= null;
    public institute_type: any = null;
    public institution_type: any = null;

<<<<<<< HEAD
    //public baseUrl: string = "http://test999.proctur.com/StdMgmtWebAPI";
    public baseUrl: string = "https://app.proctur.com/StdMgmtWebAPI";
=======
    public baseUrl: string = "http://test999.proctur.com/StdMgmtWebAPI";
   //public baseUrl: string = "https://app.proctur.com/StdMgmtWebAPI";
>>>>>>> b791418c1931a2e12e1796bddef966b006f03f7f

    constructor() {

    }

    getAuthToken() {
        this.token = sessionStorage.getItem('Authorization');
        if (this.token != null) {
            return this.token;
        }
        else {
        }
    }

    getInstituteType() {
        this.institute_type = sessionStorage.getItem('institute_type');
        if (this.institute_type != null) {
            return this.institute_type;
        }
        else {
        }
    }

    getInstituteId() {
        this.institute_id = sessionStorage.getItem('institute_id');
        if (this.institute_id != null && this.institute_id != undefined) {
            return this.institute_id;
        }
        else {
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
    }

}
