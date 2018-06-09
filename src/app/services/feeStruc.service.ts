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
        // this.institute_id = this.auth.getInstituteId();
        // this.Authorization = this.auth.getAuthToken();
        this.baseUrl = this.auth.getBaseUrl();

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


    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////Fee Type////////////////////////////////////////


    getAllFeeType() {
        let url = this.baseUrl + "/api/v1/batchFeeSched/feeType/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    upadateFeeType(data) {
        let url = this.baseUrl + "/api/v1/batchFeeSched/feeType/" + this.institute_id;
        return this.http.post(url, data, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    fetchFeeDetail(id): Observable<any> {
        let url = this.baseUrl + "/api/v1/student_wise/feeStructure/fetch/" + this.institute_id + "/" + id;

        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }

        )
    }

    updateFeeTemplate(data) {
        let url = this.baseUrl + "/api/v1/student_wise/feeStructure/update/" + this.institute_id;
        return this.http.post(url, data, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }


    getAdditionalFeeDeatails(id) {
        let url = this.baseUrl + "/api/v1/batchFeeSched/feeType/" + id + "/details";
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    // Create Fee Template

    getMasterCourse() {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    getCourse(name) {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/" + name;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    // Lang Model Changes

    getAllStandard() {
        let url = this.baseUrl + "/api/v1/standards/all/" + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    getCoursesOfStandard(id) {
        let url = this.baseUrl + "/api/v1/subjects/standards/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }
}