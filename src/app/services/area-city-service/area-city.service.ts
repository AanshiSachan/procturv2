import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";

@Injectable()

export class CityAreaService {

    baseUrl: string = '';
    Authorization: any;
    headers;
    institute_id;

    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService,
    ) {
        this.auth.currentAuthKey.subscribe( key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
          }) 
          this.auth.currentInstituteId.subscribe( id => {
            this.institute_id = id;
          });
        // this.institute_id = this.auth.getInstituteId();
        // this.Authorization = this.auth.getAuthToken();
        this.baseUrl = this.auth.getBaseUrl();
        //this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    }

    getAreaList() {
        let url = this.baseUrl + "/api/v1/cityArea/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            err => {
                return err;
            }
        )
    }

    saveNewCity(obj) {
        obj.main_branch_instId = this.institute_id;
        let url = this.baseUrl + "/api/v1/cityArea/create";
        return this.http.post(url, obj, { headers: this.headers }).map(
            data => {
                return data;
            },
            err => {
                return err;
            }
        )
    }


    getBranchList() {
        let url = this.baseUrl + "/api/v1/institutes/all/Branches/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            err => {
                return err;
            }
        )
    }

}