import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';
import { error } from 'util';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class ClassScheduleService {

    baseURL: string = "http://test999.proctur.com/StdMgmtWebAPI";
    Authorization: any;
    headers;
    institute_id;

    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.institute_id = this.auth.getInstituteId();
        this.Authorization = this.auth.getAuthToken();
        this.headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": this.Authorization
        });
    }

    getAllSubBranches(): Observable<any> {
        let url = this.baseURL + "/api/v1/institutes/all/subBranches/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        );
    }

    getAllMasterCourse(): Observable<any> {
        let url = this.baseURL + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        );
    }

    getAllTeachers(): Observable<any> {
        let url = this.baseURL + "/api/v1/teachers/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        );
    }

    getInstituteSettings(): Observable<any> {
        let url = this.baseURL + "/api/v1/institute/settings/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        );
    }

    getCourseFromMasterById(id): Observable<any> {
        let url = this.baseURL + "/api/v1/courseMaster/fetch/" + this.institute_id + "/" + id;

        return this.http.get(url, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    getStandardSubjectList(stdId, subId, isAssigned): Observable<any> {
        let url = this.baseURL + "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id + "?standard_id=" + stdId + "&subject_id=" + subId + "&assigned=" + isAssigned;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    getBatchDetailsById(id): Observable<any> {
        let url = this.baseURL + "/api/v1/batchClsSched/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getClassFrequencyAll(): Observable<any> {
        let url = this.baseURL + "/api/v1/masterData/type/CLASS_FREQ";

        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    getDayofWeekAll(): Observable<any> {
        let url = this.baseURL + "/api/v1/masterData/type/DAY_OF_WEEK";

        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    

}