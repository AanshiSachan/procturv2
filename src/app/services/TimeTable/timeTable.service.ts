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
                // console.log(res);

            },
            err => {
                return err;
            })
    }

    getCoursesData(obj){
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id +"/" + obj
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return <any>res;
               // console.log(res);

            },
            err => {
                return err;
            })

    }
    
    getSubjectData(obj){
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/courses/" + this.institute_id +"/" + obj
        return this.http.get(url, { headers: this.headers }).map(
            res => {
            return <any>res;
                //console.log(res);

            },
            err => {
                return err;
            })

    }

    getTeachersName() {
        let url = this.baseUrl + "/api/v1/teachers/all/" + this.institute_id + "?active=Y"
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                console.log(res);

            },
            err => {
                return err;
            })
    }

  
}