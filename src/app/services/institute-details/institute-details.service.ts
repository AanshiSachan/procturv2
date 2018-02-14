import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()

export class InstituteDetailService {

    baseURL: string = "http://test999.proctur.com/StdMgmtWebAPI";
    Authorization: any;
    headers;
    institute_id;

    constructor(private http: HttpClient, private auth: AuthenticatorService) {
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

    getInstituDetailsAll() {
        let url = this.baseURL + "/api/v1/institutes/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getInstituteLogoDetailsFromServer() {
        let url = this.baseURL + "/api/v1/institutes/getlogo/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getSubBranchDetails() {
        let url = this.baseURL + "/api/v1/institutes/all/subBranches/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getPlanDetails() {
        let url = this.baseURL + "/api/v1/proctur/getAllPlans";
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getOptionDetails() {
        let url = this.baseURL + "/api/v1/proctur/getAllOptions";
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getKycTypeDetails() {
        let url = this.baseURL + "/api/v1/masterData/type/KYC_DOCUMENT_TYPE";
        return this.http.get(url, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    updateDetailsToServer(data) {
        data.institute_id = this.institute_id;
        let url = this.baseURL + "/api/v1/institutes/" + this.institute_id;
        return this.http.put(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getPayementInfoFromServer() {
        let data = {
            inst_id: this.institute_id
        }
        let url = this.baseURL + "/api/v1/institute/payment/getReport/";
        return this.http.post(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getSmsInfoFromServer() {
        let data = {
            institution_id: this.institute_id
        }
        let url = this.baseURL + "/api/v1/institute/SMS/transaction/getReport";
        return this.http.post(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

    getDownloadLimitFromServer() {
        let data = {
            institution_id: this.institute_id
        }
        let url = this.baseURL + "/api/v1/institute/download_limit/transaction/getReport";
        return this.http.post(url, data, { headers: this.headers }).map(
            this.successCallback,
            this.errorCallBack
        )
    }

}