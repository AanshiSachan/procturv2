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
export class FeeStrucService {



    baseUrl = 'http://test999.proctur.com/StdMgmtWebAPI';
    Authorization: any;
    headers;
    institute_id;


    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.institute_id = this.auth.getInstituteId();
        this.Authorization = this.auth.getAuthToken();
        this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    }


    fetchFeeStruc(): Observable<any> {

        let url = this.baseUrl + "/api/v1/student_wise/feeStructure/fetchAll/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
            return err;
            }   
        )

    }


    fetchFeeDetail(id): Observable<any> {
        let url = this.baseUrl +"/api/v1/student_wise/feeStructure/fetch/" +this.institute_id +"/" +id;

        return this.http.get(url, {headers: this.headers}).map(
            res => { return res; },
            err => { return err; }
        )
    }

}