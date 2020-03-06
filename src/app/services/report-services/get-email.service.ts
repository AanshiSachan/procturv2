import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
        this.baseUrl = this.auth.getBaseUrl();
 
    }

    getEmailMessages(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/alerts/config/emailReport";
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