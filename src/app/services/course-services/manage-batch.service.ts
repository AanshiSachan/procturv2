
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()

export class ManageBatchService {

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

    successCallback(res) {
        return res;
    }

    errorCallBack(error) {
        return error
    }

    getBatchListFromServer() {
        let url = this.baseURL + "/api/v1/batches/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

    getBatchClassRoomListFromServer() {
        let url = this.baseURL + "/api/v1/batchClassRoom/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

    getMasterCourseListFromServer() {
        let url = this.baseURL + "/api/v1/standards/all/" + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

    getTeachersListFromServer() {
        let url = this.baseURL + "/api/v1/teachers/all/" + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

    getPerticularCourseList(data) {
        let url = this.baseURL + "/api/v1/subjects/standards/" + data + "?active=Y";
        return this.http.get(url, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

    addNewBatch(data) {
        delete data['standard_id'];
        let url = this.baseURL + "/api/v1/batches";
        return this.http.post(url, data, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

    getBatchDetailsForEdit(id) {
        let url = this.baseURL + "/api/v1/batches/" + id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

    updateDataToServer(data, batch_Id) {
        let url = this.baseURL + '/api/v1/batches/' + batch_Id;
        return this.http.put(url, data, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

    getStudentListFromServer(batch_id) {
        let url = this.baseURL + "/api/v1/allStdAsgnment/all/" + this.institute_id + "/" + batch_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

    saveUpdatedList(data, batch_id) {
        data.institute_id = this.institute_id;
        let url = this.baseURL + "/api/v1/allStdAsgnment/" + batch_id;
        return this.http.post(url, data, { headers: this.headers }).pipe(map(
            this.successCallback,
            this.errorCallBack
        ))
    }

       //  Get acadmeic Year Details

       getAcadYear() {
        let url = this.baseURL + "/api/v1/academicYear/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            data => {
                return data;
            },
            err => {
                return err;
            }
        ))
    }

    getFeeTemplate(batch_id) {
        // https://test999.proctur.com/StdMgmtWebAPI/api/v1/studentWise/fee/fee_template_country_wise/100135?course_id=-1&subject_id=1372
        let url = this.baseURL + "/api/v1/studentWise/fee/fee_template_country_wise/" + this.institute_id + "?course_id=-1&subject_id=" + batch_id ;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        ))
    }
}