import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AuthenticatorService } from "../authenticator.service";


@Injectable()
export class postEmailService {


    baseUrl:string = '';
    institute_id: string;
    Authorization: string;
    headers: Headers;


    /* set default value for each url, header and autherization on service creation */
    constructor(private http: Http, private auth: AuthenticatorService,) {
        this.auth.currentAuthKey.subscribe( key => {
            this.Authorization = key;
          }) 
          this.auth.currentInstituteId.subscribe( id => {
            this.institute_id = id;
          });
        // this.Authorization = sessionStorage.getItem('Authorization');
        // this.institute_id = sessionStorage.getItem('institute_id');
        this.baseUrl = this.auth.getBaseUrl();
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Authorization", this.Authorization);
    }


}
