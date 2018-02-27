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
    public baseUrl:string = "http://test999.proctur.com/StdMgmtWebAPI"


    constructor() {
        // set token if saved in session storage
        this.institute_id = sessionStorage.getItem('institute_id');
        this.token = sessionStorage.getItem('Authorization');
        this.institute_type = sessionStorage.getItem('institute_type');
    }

    getAuthToken(){
        if(this.token != null){
            return this.token;
        }
        else{
        }
    }

    getInstituteType(){
        if(this.institute_type != null){
            return this.institute_type;
        }
        else{
        }
    }

    getInstituteId(){
        if(this.institute_id != null){
            return this.institute_id;
        }
        else{
        }
    }

    getBaseUrl(): string{
        return this.baseUrl;
    }


}
