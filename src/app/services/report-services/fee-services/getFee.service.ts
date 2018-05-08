import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../authenticator.service";
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class GetFeeService {

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


    getBatchDetails(obj): Observable<any> {

        let url = this.baseUrl + '/api/v1/batches/fetchCombinedBatchData/' + this.institute_id + '?standard_id=' + obj.standard_id + '&subject_id=' + obj.subject_id + '&assigned=N'

        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )

    }


    getMasterCourses(): Observable<any> {

        let url = this.baseUrl + '/api/v1/courseMaster/fetch/' + this.institute_id + '/all'

        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )

    }

    getFeeReportData(obj): Observable<any> {

        let url = this.baseUrl + '/api/v1/studentWise/fee/students/' + this.institute_id

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )

    }

}