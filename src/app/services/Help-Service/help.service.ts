import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";


@Injectable()

export class ZendAuth {

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
    }


    ZendeskAuth(data) {

        let decoded = btoa("nishant@proctur.com/token:1dS8xAwpu5rxeK0fJgdFlw965p0Lq10ohDcdVDsJ");

        let header = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": "Basic " +decoded
        });

        let url = 'https://proctur.zendesk.com/api/v2/tickets.json';
        return this.http.post(url, data, { headers: header }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }


}