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
            alert('You are not authorized to view the content, please login to continue');
        }
    }

    getInstituteType(){
        if(this.institute_type != null){
            return this.institute_type;
        }
        else{
            alert('You are not authorized to view the content, please login to continue');
        }
    }

    getInstituteId(){
        if(this.institute_id != null){
            return this.institute_id;
        }
        else{
            alert('something went wrong, please refresh or try again later');
        }
    }
}