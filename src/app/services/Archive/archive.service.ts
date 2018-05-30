import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as moment from 'moment';
import { AuthenticatorService } from "../authenticator.service";

@Injectable()
export class archiveService {

    baseUrl: string = '';
    institute_id: string;
    Authorization: string;
    headers: HttpHeaders;

    constructor(private http: HttpClient, private auth1: AuthenticatorService, ) {
        this.auth1.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        });

        this.auth1.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });

        this.baseUrl = this.auth1.getBaseUrl();

    }

    getArchive() {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/courses/" + this.institute_id + "/all";
        return this.http.post(url, { headers: this.headers }).map(
            res => {
                console.log(res);
                return res;
            },
            err => {
                return err;
            })

    }

    getArchiveList() {
        let url = this.baseUrl + "/api/v1/archive/course/report/" + this.institute_id;
        return this.http.post(url, { headers: this.headers }).map(
            res => {
                console.log(res);
            },
            err => {
                return err;
            }
        )
    }

    getStudents() {
        let url = this.baseUrl + "/api/v1/archive/students/" + this.institute_id;
        return this.http.post(url, { headers: this.headers }).map(
            res => {
                console.log(res);
            },
            err => {
                console.log(err);
            })
    }

    getStudentsList() {
        let url = this.baseUrl + "/api/v1/archive/students/report/" + this.institute_id;
        return this.http.post(url, { headers: this.headers }).map(
            res => {
                console.log(res);
            },
            err => {
                console.log(err);
            })
    }


}
