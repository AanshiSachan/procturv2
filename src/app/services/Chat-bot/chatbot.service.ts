import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";


@Injectable()

export class ZendAuth {

    Authorization: any;
    headers;
    institute_id;
    getInsName = "";
    getEmailData = "";
    insId = "";

    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService,
    ) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders(
                { "Content-Type": "application/json", "Authorization": this.Authorization });
            this.getEmailData = sessionStorage.getItem('inst_email');
            this.getInsName = sessionStorage.getItem('institute_name');
            this.insId = sessionStorage.getItem('institute_id');
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
    }


    ZendeskAuth(data) {
        data.ticket.description = "Institute Name: " + this.getInsName + ", " + " Institute Id: " + this.insId + ", " + "Email Id: " + this.getEmailData + ", " + "Description: " + data.ticket.description;
        console.log(data);
        let decoded = btoa("nishant@proctur.com/token:1dS8xAwpu5rxeK0fJgdFlw965p0Lq10ohDcdVDsJ");

        let header = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": "Basic " + decoded
        });

        let url = 'https://proctur.zendesk.com/api/v2/tickets.json';
        return this.http.post(url, data, { headers: header }).map(
            data => {
                return data;
            }

        )
    }


}