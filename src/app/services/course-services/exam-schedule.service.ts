import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()

export class ExamCourseService {

    baseURL: string = "";
    Authorization: any;
    headers;
    institute_id;

    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService,
    ) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.baseURL = this.auth.getBaseUrl();

    }

    // Function For Lang Model


    getCombinedList(standard, subject_id) {
        let url = this.baseURL + "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id + "?standard_id=" + standard + "&subject_id=" + subject_id + "&assigned=N";
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    getExamSchedule(id) {
        let url = this.baseURL + "/api/v1/batchExamSched/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    putRequestExamSchedule(data) {
        let url = this.baseURL + "/api/v1/batchExamSched";
        return this.http.put(url, data, { headers: this.headers }).map(
            res => { return res; },
            err => { return err }
        )
    }

    postRequestExamSchedule(data) {
        let url = this.baseURL + "/api/v1/batchExamSched";
        return this.http.post(url, data, { headers: this.headers }).map(
            res => { return res; },
            err => { return err }
        )
    }

    serverRequestToSaveSchedule(data, Type) {
        let url = this.baseURL + "/api/v1/batchExamSched";
        if (Type == "post") {
            return this.http.post(url, data, { headers: this.headers }).map(
                res => { return res; },
                err => { return err; }
            )
        } else {
            return this.http.put(url, data, { headers: this.headers }).map(
                res => { return res; },
                err => { return err; }
            )
        }
    }

    notifyStudentExam(id) {
        let url = this.baseURL + "/api/v1/batchExamSched/notify/" + this.institute_id + "/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    fetchStudentList(data) {
        let url = this.baseURL + "/api/v1/attendance/exam";
        return this.http.post(url, data, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    markAttendance(data) {
        let url = this.baseURL + "/api/v1/attendance/exam";
        return this.http.put(url, data, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    cancelExamSchedule(obj) {
        let url = this.baseURL + "/api/v1/batchExamSched/cancel";
        return this.http.put(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    notifyCancelledClass(obj) {
        let url = this.baseURL + "/api/v1/coursePlanner/notify";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    uncancelClassSchedule(obj) {
        let url = this.baseURL + "/api/v1/batchExamSched/unCancel";
        return this.http.put(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    ///////////////////////////////////


    /// For Course Model ///

    getMasterCourse() {
        let url = this.baseURL + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    getSchedule(obj) {
        obj.inst_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseExamSchedule/fetch";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }



}