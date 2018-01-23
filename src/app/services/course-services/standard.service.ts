import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()
export class StandardServices {
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

    getAllStandardListFromServer() {
        let url = this.baseURL + "/api/v1/standards/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        );
    }

    createNewStandard(data) {
        let url = this.baseURL + "/api/v1/standards";
        data.institution_id = this.institute_id;
        return this.http.post(url, data, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            });
    }

    updateStanadardRowData(data , standard_Id) {
        let url =  this.baseURL + "/api/v1/standards/" + standard_Id;
        return this.http.put(url , data , {headers: this.headers}).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

}