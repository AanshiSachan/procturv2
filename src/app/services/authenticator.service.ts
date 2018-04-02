import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

/* Method declared for future purpose for setting authorization after successfull login */

@Injectable()
export class AuthenticatorService {
    public token: string = null;
    public institute_id: any = null;
    public institute_type: any = null;
    public institution_type: any = null;
    public baseUrl: string = "http://test999.proctur.com/StdMgmtWebAPI";
    // public baseUrl: string = "https://app.proctur.com/StdMgmtWebAPI";


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

    getBaseUrl(): string {
        return this.baseUrl;
    }


}
