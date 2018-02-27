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



    baseUrl:string = '';
    Authorization: any;
    headers;
    institute_id;


    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.institute_id = this.auth.getInstituteId();
        this.Authorization = this.auth.getAuthToken();
        this.baseUrl = this.auth.getBaseUrl();
        this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    }


    fetchSchedWidgetData(obj): Observable<any> {

        let url = this.baseUrl + "/api/v1/dashboard/admin//todayClassSchedule/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }


    fetchFeeWidgetData(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/studentWise/fee/students/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }


    getInstituteSettings(): Observable<any> {
        let url = this.baseUrl + "/api/v1/institute/settings/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }

    getAllplan(): Observable<any> {
        let url = this.baseUrl + "/api/v1/proctur/getAllPlans";
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }

    getAttendance(obj): any {
        let url = this.baseUrl + "/api/v1/attendance";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getAllteachers(): Observable<any> {
        let url = this.baseUrl + "/api/v1/teachers/all/" + this.institute_id + "?active=Y";

        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    updateAttendance(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/attendance";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    cancelClassSchedule(obj) {
        let url = this.baseUrl + "/api/v1/batchClsSched/cancel";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    cancelCourseSchedule(obj) {
        let url = this.baseUrl + "/api/v1/courseClassSchedule/cancelMasterClassSchedule";

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }    


    notifyStudentSchedule(obj) {
        let url = this.baseUrl + "/api/v1/coursePlanner/notify";

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }


    reScheduleClass(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/batchClsSched/reschedule";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    fetchCourseLevelWidgetData(obj) {
        let url = this.baseUrl + '/api/v1/courseClassSchedule/fetchMasterCourseDetails/todaySchedule';
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    fetchCourseAttendance(obj) {
        let url = this.baseUrl + '/api/v1/attendance/course';
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    updateCourseAttendance(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/attendance/course";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    remindCourseLevel(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/courseClassSchedule/sendCourseMasterReminder";

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

}