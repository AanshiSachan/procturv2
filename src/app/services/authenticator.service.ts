import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
 
/* Method declared for future purpose for setting authorization after successfull login */

@Injectable()
export class AuthenticatorService {
    public token: string = null;
    public institute_id: number = null;
    public institute_type: any;

    constructor() {
        // set token if saved in local storage
        //this.institute_id = JSON.parse(localStorage.getItem('institute_id'));
        ///this.token = JSON.parse(localStorage.getItem('token'));
        this.institute_id = 100123;
        this.token = 'MzE0Njl8MDphZG1pbkAxMjM6MTAwMTIz';
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