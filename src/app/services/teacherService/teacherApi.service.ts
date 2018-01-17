import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";

@Injectable()

export class TeacherAPIService {

    baseUrl = 'http://test999.proctur.com/StdMgmtWebAPI';
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

    // List Section Of Teacher

    getAllTeacherList() {
        let url = this.baseUrl + "/api/v1/teachers/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }


    // Add Section Of Teacher

    addNewTeacherDetails(data) {
        let url = this.baseUrl + '/api/v1/teachers';
        data.institution_id = this.institute_id;
        return this.http.post(url, data, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    getSelectedTeacherInfo(data) {
        let url = this.baseUrl + '/api/v1/teachers/' + data;
        return this.http.get(url, { headers: this.headers }).subscribe(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

}