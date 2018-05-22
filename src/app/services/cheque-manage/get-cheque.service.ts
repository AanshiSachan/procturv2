import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as moment from 'moment';
import { AuthenticatorService } from "../authenticator.service";


@Injectable()
export class getCheque {

    baseUrl: string = '';
    institute_id: string;
    Authorization: string;
    headers: HttpHeaders;

    /* set default value for each url, header and autherization on service creation */
    constructor(private http: HttpClient, private auth1: AuthenticatorService, ) {
        this.Authorization = sessionStorage.getItem('Authorization');
        this.institute_id = sessionStorage.getItem('institute_id');

        this.auth1.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        });

        this.auth1.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });

        this.baseUrl = this.auth1.getBaseUrl();

    }


    downloadResource(obj): Observable<any> {
        let url = this.baseUrl +"/api/v1/studentWise/fee/" +obj.student_id +"/feeReceipt/" +obj.receipt_id +"/download?fin_yr=" +obj.fin +"&emailSent=" +obj.email;

        return this.http.get(url, {headers: this.headers}).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }



    updatePDCPayment(obj): Observable<any> {
        let url = this.baseUrl +"/api/v1/studentWise/fee/students/" +this.institute_id +"/save";

        return this.http.post(url, obj, {headers: this.headers}).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    
    getChequeTypes(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/chequeDetails/studentWiseFee/" + this.institute_id;

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            });
    }


    updateChequeStatus(obj): Observable<any> {

        let url = this.baseUrl + '/api/v1/chequeDetails/studentWiseFee/updateChequeStatus/' + this.institute_id;

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        );

    }

    fetchStudentFeeDetails(id): Observable<any> {

        let obj = {
            from_date: "",
            to_date: ""
        }

        let url = this.baseUrl + '/api/v1/studentWise/fee/dueDetails/payment/' + this.institute_id + '/' + id;

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        );

    }

    fetchAllChequeStudent(id): Observable<any> {

        let obj = { cheque_status: "1" }

        let url = this.baseUrl + '/api/v1/student_cheque/getAll/' + this.institute_id + '/' + id;

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        );

    }

    fetchPdcChequeDetails(id): Observable<any> {

        let url = this.baseUrl + '/api/v1/student_cheque/getDetail/' + this.institute_id + '/' + id;

        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        );

    }



}