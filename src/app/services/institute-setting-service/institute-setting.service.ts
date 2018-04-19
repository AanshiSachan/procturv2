import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()

export class InstituteSettingService {

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
            this.headers = new HttpHeaders(
                { "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        // this.institute_id = this.auth.getInstituteId();
        // this.Authorization = this.auth.getAuthToken();
        this.baseURL = this.auth.getBaseUrl();

    }

    successCallback(res) {
        return res;
    }

    errorCallBack(error) {
        return error
    }


    getInstituteSettingFromServer() {
        let url = this.baseURL + "/api/v1/institute/settings/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    saveSettingsToServer(data) {
        data.institute_id = this.institute_id;
        let url = this.baseURL + "/api/v1/institute/settings/";
        return this.http.put(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

}