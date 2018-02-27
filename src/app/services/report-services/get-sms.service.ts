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
export class getSMSService {

    baseUrl:string = '';
    institute_id: string;
    Authorization: string;
    headers: Headers;


    /* set default value for each url, header and autherization on service creation */
    constructor(private http: Http, private auth: AuthenticatorService,) {
        this.Authorization = sessionStorage.getItem('Authorization');
        this.institute_id = sessionStorage.getItem('institute_id');
        this.baseUrl = this.auth.getBaseUrl();
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Authorization", this.Authorization);
    }


    fetchSmsReport(obj) {

        obj.from_date = obj.from_date == '' ? moment().format('YYYY-MM-DD') : moment(obj.from_date).format('YYYY-MM-DD');
        obj.to_date = obj.to_date == '' ? '' : moment(obj.to_date).format('YYYY-MM-DD');

        let urlSmsReport = this.baseUrl + "/api/v1/alerts/config/smsReport";

        return this.http.post(urlSmsReport, obj, { headers: this.headers }).map(
            res => {
                return res.json();
            },
            err => {
                return err.json();
            }
        )

    }

}