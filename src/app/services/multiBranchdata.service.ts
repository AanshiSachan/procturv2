import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from './authenticator.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class MultiBranchDataService {

    baseUrl: string = '';
    Authorization: any;
    headers;
    institute_id;
    branchesList: any = [];
    mainBranchID: any = "";
    branchData: any = "";
    subBranchSelected: any = new BehaviorSubject(false);

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
        this.baseUrl = this.auth.getBaseUrl();
        this.isSubBranchSelected();
    }

    getAllBranches() {
        let url = this.baseUrl + '/api/v1/institutes/all/subBranches/' + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            data => { return data; },
            error => { return error; }
        )
    }

    setSelectedBranchData(data) {
        this.branchData = data;
    }

    getSelectedBranchData() {
        return this.branchData;
    }

    isSubBranchSelected() {
        let data = sessionStorage.getItem('mainBranchId');
        if (data != "" && data != null && data != undefined) {
            this.subBranchSelected.next(true);
        }
    }

    getSubBranchLoginInfo(id) {
        let url = this.baseUrl + "/api/v1/institutes/login/subBranch/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            data => { return data; },
            error => { return error; }
        )
    }

    loginToMainBranch(id) {
        let url = this.baseUrl + "/api/v1/institutes/login/mainBranch/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            data => { return data; },
            error => { return error; }
        )
    }
}

