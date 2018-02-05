import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';
import { error } from 'util';

@Injectable()

export class CourseListService {

    baseURL: string = "http://test999.proctur.com/StdMgmtWebAPI";
    Authorization: any;
    headers;
    institute_id;

    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService,
    ) {
        this.institute_id = this.auth.getInstituteId();
        this.Authorization = this.auth.getAuthToken();
        this.headers = new HttpHeaders(
            { "Content-Type": "application/json", "Authorization": this.Authorization });
    }

    getCourseListFromServer() {
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

    getStandardListFromServer() {
        let url = this.baseURL + "/api/v1/standards/all/" + this.institute_id + '?active=Y';
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        );
    }

    getSubjectListOfStandard(data) {
        let url = this.baseURL + "/api/v1/subjects/standards/" + data + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    getTeacherListFromServer() {
        let url = this.baseURL + "/api/v1/teachers/all/" + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        )
    }

    /////// Edit Couse //////

    getSeletedMasterCourseEdit(course_name) {
        let url = this.baseURL + "/api/v1/courseMaster/fetch/" + this.institute_id + '/' + course_name;
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }


    ////// Edit Save Course /////

    saveCourseDetails(data) {
        data.inst_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseMaster/create";
        return this.http.post(url, data, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    /// Edit Component Update Course //////////

    updateDetailsInEdit(data) {
        data.inst_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseMaster/update";
        return this.http.put(url, data, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    /// Edit Component Delete Subject //////////

    deleteSubjectFromServer(subjectId) {
        let url = this.baseURL + "/api/v1/courseMaster/deleteSubject/" + subjectId;
        return this.http.put(url, '', { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }


}