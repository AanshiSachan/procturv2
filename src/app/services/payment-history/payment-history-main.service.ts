
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import * as moment from 'moment';

@Injectable()
export class PaymentHistoryMainService {

  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService
  ) {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.baseUrl = this.auth.getBaseUrl();
  }

  getPaymentData(obj) {
    obj.from_date = moment(obj.from_date).format('YYYY-MM-DD');
    obj.to_date = moment(obj.to_date).format('YYYY-MM-DD');
    let url = this.baseUrl + "/api/v1/studentWise/fee/feesReport/pastHistory/" + this.institute_id + "/details"
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    ))
  }

  getPerPersonData(fin, i) {
    let url = this.baseUrl + "/api/v1/studentWise/fee/fetchTransactionsForFeeReceipt/" + i + "?financial_year=" + fin;
    return this.http.get(url, { headers: this.headers }).pipe(map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    ))
  }

  updatePerPersonData(obj) {
    let url = this.baseUrl + "/api/v1/studentWise/fee/updateFeeReceipt/" + this.institute_id + "/save";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      (data: any) => {
        return data;
      },
      (error: any) => {
        return error;
      }
    ))
  }

  downloadData(obj){
    let url = this.baseUrl + "/api/v1/studentWise/fee/downloadGSTReport/" + this.institute_id
    return this.http.post(url , obj , {headers:this.headers}).pipe(map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    ))
  }

  //get user list for admin
  getUserList(obj, active) {
    let url = this.baseUrl + "/api/v1/profiles/all/" + this.institute_id + "?active=" + active;
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
        res => { return res; },
        err => { return err; }
    ))
}

}
