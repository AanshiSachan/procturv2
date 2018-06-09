import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../authenticator.service";
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class PostFeeService {

    baseUrl: string = '';
    Authorization: any;
    headers;
    institute_id;


    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });

        this.baseUrl = this.auth.getBaseUrl();
    }


    sendBulkSMS(obj): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + '/api/v1/studentWise/fee/students/sendSMS/' + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    sendBulkFineSMS(obj): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + '/api/v1/studentWise/fee/students/sendFineSMS/' + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

}