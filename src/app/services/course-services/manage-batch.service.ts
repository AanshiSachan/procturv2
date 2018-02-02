import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';
import { error } from 'util';

@Injectable()

export class ManageBatchService {

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

    successCallback(res) {
        return res;
    }

    errorCallBack(error) {
        return error
    }

    getBatchListFromServer() {
        let url = this.baseURL + "/api/v1/batches/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getBatchClassRoomListFromServer() {
        let url = this.baseURL + "/api/v1/batchClassRoom/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getMasterCourseListFromServer() {
        let url = this.baseURL + "/api/v1/standards/all/" + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getTeachersListFromServer() {
        let url = this.baseURL + "/api/v1/teachers/all/" + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getPerticularCourseList(data) {
        let url = this.baseURL + "/api/v1/subjects/standards/" + data + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    addNewBatch(data) {
        delete data['standard_id'];
        let url = this.baseURL + "/api/v1/batches" ;
        return this.http.post(url,data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )   
    }

}