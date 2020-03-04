import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { AuthenticatorService } from "../../authenticator.service";

@Injectable()
export class PostFeeService {

    baseUrl: string = '';
    Authorization: any;
    headers;
    institute_id;


    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });

        this.baseUrl = this.auth.getBaseUrl();
    }


    sendBulkSMS(obj): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + '/api/v1/studentWise/fee/students/sendSMS/' + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    sendBulkFineSMS(obj): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + '/api/v1/studentWise/fee/students/sendFineSMS/' + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    sendPastDues(obj , student_id){
        let url=this.baseUrl + "/api/v1/studentWise/fee/feesReport/pastDues/" + this.institute_id + "/" + student_id;
        return this.http.post(url , obj , {headers:this.headers}).map(
            (data:any)=>{
                return data;
            },
            (error:any)=>{
                return error;
            }
        )
    }

}