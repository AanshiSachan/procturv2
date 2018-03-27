import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()

export class SubjectApiService {

    baseURL: string = "";
    Authorization: any;
    headers;
    institute_id;

    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService,
    ) {
        this.institute_id = this.auth.getInstituteId();
        this.Authorization = this.auth.getAuthToken();
        this.baseURL = this.auth.getBaseUrl();
        this.headers = new HttpHeaders(
            { "Content-Type": "application/json", "Authorization": this.Authorization });
    }

    getAllSubjectListFromServer() {
        let url = this.baseURL + "/api/v1/subjects/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        );
    }


    updateSubjectRowData(data, id) {
        let url = this.baseURL + "/api/v1/subjects/" + id;
        return this.http.put(url, data, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        );
    }

    getAllStandardName() {
        let url = this.baseURL + '/api/v1/standards/all/' + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        )
    }

    createNewSubject(data) {
        let url = this.baseURL + '/api/v1/subjects';
        return this.http.post(url, data, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        )
    }

    deleteSubject(data) {
        let url = this.baseURL + '/api/v1/subjects/' + data;
        return this.http.delete(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        )
    }

}