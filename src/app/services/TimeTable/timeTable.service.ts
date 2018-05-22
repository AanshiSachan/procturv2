import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as moment from 'moment';
import { AuthenticatorService } from "../authenticator.service";

@Injectable()
export class timeTableService {

    baseUrl: string = '';
    institute_id: string;
    Authorization: string;
    headers: HttpHeaders;

    /* set default value for each url, header and autherization on service creation */
    constructor(private http: HttpClient, private auth1: AuthenticatorService, ) {
        this.Authorization = sessionStorage.getItem('Authorization');
        this.institute_id = sessionStorage.getItem('institute_id');
        this.baseUrl = this.auth1.getBaseUrl();
        this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    }

    getMasterCourses(): Observable<any> {

        let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";

        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            })
    }

    getCoursesData(obj) {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/" + obj
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return <any>res;
            },
            err => {
                return err;
            })

    }

    getSubjectData(obj) {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/courses/" + this.institute_id + "/" + obj
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return <any>res;
            },
            err => {
                return err;
            }
        )
    }

    getTeachersName() {
        let url = this.baseUrl + "/api/v1/teachers/all/" + this.institute_id + "?active=Y"
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return <any>res;
            },
            err => {
                return err;
            }
        )
    }

    getTimeTable(obj) {
        let url = this.baseUrl + "/api/v1/timeTable";
        obj.institute_id = this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return <any>res;
            },
            err => {
                return err;
            }
        )
    }

    getProData(standard_id, subject_id) {
        let url = this.baseUrl + "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id + "?standard_id=" + standard_id + "&subject_id=" + subject_id + "&assigned=N";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return <any>res;
            },
            err => {
                return err;
            }
        )
    }

}