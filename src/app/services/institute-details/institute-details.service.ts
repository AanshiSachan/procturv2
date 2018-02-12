import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()

export class InstituteDetailService {

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

    getInstituteDetailsFromServer() {
        let url = this.baseURL + "/api/v1/institutes/getlogo/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

}