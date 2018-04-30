import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as moment from 'moment';
import { AuthenticatorService } from "../authenticator.service";

@Injectable()
export class getEmailService {
    baseUrl: string = '';
    institute_id: string;
    Authorization: string;
    headers: HttpHeaders;


    /* set default value for each url, header and autherization on service creation */
    constructor(private http: HttpClient, private auth: AuthenticatorService, ) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        // this.Authorization = sessionStorage.getItem('Authorization');
        // this.institute_id = sessionStorage.getItem('institute_id');
        this.baseUrl = this.auth.getBaseUrl();
 
    }

    getEmailMessages(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/alerts/config/emailReport";
        obj.from_date = moment(obj.from_date).format("YYYY-MM-DD")
        obj.to_date = moment(obj.to_date).format("YYYY-MM-DD")
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    /*    fetchSmsReport(obj) {
    
            obj.from_date = obj.from_date == '' ? moment().format('YYYY-MM-DD') : moment(obj.from_date).format('YYYY-MM-DD');
            obj.to_date = obj.to_date == '' ? '' : moment(obj.to_date).format('YYYY-MM-DD');
    
            let urlSmsReport = this.baseUrl + "/api/v1/alerts/config/smsReport";
    
            return this.http.post(urlSmsReport, obj, { headers: this.headers }).map(
                res => {
                    return res.json();
                },
                err => {
                    return err.json();
                }
            )
    
        }
    */



}