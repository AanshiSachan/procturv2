
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()
export class StandardServices {
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
        this.baseURL = this.auth.getBaseUrl();
    }

    getAllStandardListFromServer() {
        let url = this.baseURL + "/api/v1/standards/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        ));
    }

    createNewStandard(data) {
        let url = this.baseURL + "/api/v1/standards";
        data.institution_id = this.institute_id;
        return this.http.post(url, data, { headers: this.headers }).pipe(map(
            res => {
                return res;
            },
            err => {
                return err;
            }));
    }

    updateStanadardRowData(data, standard_Id) {
        let url = this.baseURL + "/api/v1/standards/" + standard_Id;
        return this.http.put(url, data, { headers: this.headers }).pipe(map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        ))
    }

    deleteStandard(id) {
        let url = this.baseURL + "/api/v1/standards/" + id;
        return this.http.delete(url, { headers: this.headers }).pipe(map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        ))
    }

}