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

    baseURL: string = "";
    Authorization: any;
    headers;
    institute_id;

    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": this.Authorization
            }); 
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        // this.institute_id = this.auth.getInstituteId();
        // this.Authorization = this.auth.getAuthToken();
        this.baseURL = this.auth.getBaseUrl();
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

    getTimeTable(obj): Observable<any> {
        obj.institute_id = this.institute_id;
        let url = this.baseURL + "/api/v1/timeTable";

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }


    successCallback(res) {
        return res;
    }

    errorCallBack(err) {
        return err;
    }

    getAllSubjectlist(data): Observable<any> {
        data.inst_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseClassSchedule/fetch";
        return this.http.post(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getCustomClassListFromServer(): Observable<any> {
        let url = this.baseURL + "/api/v1/courseClassSchedule/getCustomClassesList";
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getAllActiveTeachersList(): Observable<any> {
        let url = this.baseURL + "/api/v1/teachers/all/" + this.institute_id + '?active=Y';
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        );
    }


    sendReminderToServer(data) {
        data.inst_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseClassSchedule/sendReminder";
        return this.http.post(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    sendReminderToServerSubject(data) {
        let url = this.baseURL + "/api/v1/coursePlanner/notify";
        return this.http.post(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    remindCourseLevel(obj): Observable<any> {
        let url = this.baseURL + "/api/v1/courseClassSchedule/sendCourseMasterReminder";

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    saveDataOnServer(data) {
        data.inst_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseClassSchedule/update";
        return this.http.post(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    selectedDateScheduleToServer(data) {
        let url = this.baseURL + "/api/v1/courseClassSchedule/copyCourseSchedule";
        return this.http.put(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }


    saveCustomRecurrenceToServer(data) {
        let url = this.baseURL + "/api/v1/courseClassSchedule/updateWeeklySubjectSchedule";
        return this.http.put(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    cancelClassSchedule(data) {
        let url = this.baseURL + "/api/v1/batchClsSched/cancel";
        return this.http.put(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }




    //////////////////////////////////////////////////////////////////////////////
    ///////////////Batch Model////////////////////////////////////////////

    getWeekOfDays() {
        let url = this.baseURL + "/api/v1/masterData/type/DAY_OF_WEEK";
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }


    notifyCancelledClassSchedule(data) {
        let url = this.baseURL + "/api/v1/coursePlanner/notify";
        return this.http.post(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    createWeeklyBatch(data) {
        let url = this.baseURL + "/api/v1/batchClsSched";
        return this.http.put(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    createWeeklyBatchPost(data) {
        let url = this.baseURL + "/api/v1/batchClsSched";
        return this.http.post(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////Home Class///////////////////////////////////////////////

    getSubjectList(data) {
        let url = this.baseURL + "/api/v1/courseMaster/fetch/courses/" + this.institute_id + '/' + data;
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getAllTeachersList(): Observable<any> {
        let url = this.baseURL + "/api/v1/teachers/all/" + this.institute_id + '?active=Y';
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        );
    }

    reScheduleClass(obj): Observable<any> {
        let url = this.baseURL + "/api/v1/batchClsSched/reschedule";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getCombinedDataFromServer(standard_id, subject_id) {
        let url = this.baseURL + "/api/v1/batches/fetchCombinedBatchData/100057?standard_id=" + standard_id + "&subject_id=" + subject_id + "&assigned=N";
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    cancelCourseSchedule(obj) {
        let url = this.baseURL + "/api/v1/courseClassSchedule/cancelMasterClassSchedule";

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