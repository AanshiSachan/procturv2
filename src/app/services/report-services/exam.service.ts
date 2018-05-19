import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticatorService } from "../authenticator.service";


@Injectable()

export class ExamService {

    baseUrl: string = '';
    institute_id: string;
    Authorization: string;
    headers;

    /* set default value for each url, header and autherization on service creation */
    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders(
                { "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.baseUrl = this.auth.getBaseUrl();
    }

    ExamReport(): Observable<any> {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    batchExamReport(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id + "?standard_id=" + obj.standard_id + "&subject_id=" + obj.subject_id + "&assigned=N";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }

        )
    }

    getCourses(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/" + obj
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    getSubject(obj) {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/courses/" + this.institute_id + "/" + obj
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    getExamSchedule(obj) {
        let url = this.baseUrl + "/api/v1/batchExamSched/" + obj
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    viewExamData(obj) {
        let url = this.baseUrl + "/api/v1/reports/StdExam"
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    viewDetailData(obj) {
        let url = this.baseUrl + "/api/v1/reports/StdExam/" + obj
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


}