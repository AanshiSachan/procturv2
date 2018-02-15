import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "./authenticator.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class WidgetService {

    baseUrl = 'http://test999.proctur.com/StdMgmtWebAPI';
    Authorization: any;
    headers;
    institute_id;


    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.institute_id = this.auth.getInstituteId();
        this.Authorization = this.auth.getAuthToken();
        this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    }


    fetchSchedWidgetData(obj): Observable<any> {
        
        let url = this.baseUrl + "/api/v1/dashboard/admin//todayClassSchedule/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { console.log(res); return res; },
            err => { return err; }
        );
    }


    fetchFeeWidgetData(obj): Observable<any> {
        
        let url = this.baseUrl + "/studentWise/fee/students/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }



}