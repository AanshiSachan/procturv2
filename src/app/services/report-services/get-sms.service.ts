import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';


@Injectable()
export class getSMSService {

    baseUrl: string = 'http://test999.proctur.com/StdMgmtWebAPI';
    institute_id: string;
    Authorization: string;
    headers: Headers;

    /* set default value for each url, header and autherization on service creation */
    constructor(private http: Http) {
        this.Authorization = sessionStorage.getItem('Authorization');
        this.institute_id = sessionStorage.getItem('institute_id');
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Authorization", this.Authorization);
    }


    fetchSmsReport(obj) {

        obj.from_date = obj.from_date == '' ? moment().format('YYYY-MM-DD') : moment(obj.from_date).format('YYYY-MM-DD');
        obj.to_date = obj.to_date == '' ? '' : moment(obj.to_date).format('YYYY-MM-DD');

        let urlSmsReport = this.baseUrl + "/alerts/config/smsReport";

        return this.http.post(urlSmsReport, obj, { headers: this.headers }).map(
            res => {
                return res.json();
            },
            err => {
                return err.json();
            }
        )

        /* let urlSmsReport = "http://test999.proctur.com/Reports";

        let payload = "institution_id=100057&report_type=sms_report&username=18274%7C0&password=admin&from_date=2017-12-24&to_date="

        let headerpost = new Headers();
        headerpost.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        return this.http.post(urlSmsReport, payload, { headers: headerpost }).map(
            res => {
                return res.json().aaData;
            },
            err => {
                return err.json();
            }
        ) */

    }

}