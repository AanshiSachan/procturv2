import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";


@Injectable()

export class SlotApiService {

    baseUrl: string = '';
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
        this.baseUrl = this.auth.getBaseUrl();

    }

    //get all slots

    getAllSlots() {
        let url = this.baseUrl + '/api/v1/inst_slot/all/' + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    //add new slots

    addNewSlotToList(data) {
        data.institution_id = this.institute_id;
        let url = this.baseUrl + '/api/v1/inst_slot/';
        return this.http.post(url, data, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    // update slot 

    updateSlotName(data) {
        data.institution_id = this.institute_id;
        let url = this.baseUrl + '/api/v1/inst_slot/' + data.slot_id;
        return this.http.put(url, data, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }


}