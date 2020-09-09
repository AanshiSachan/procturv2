
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import * as moment from 'moment';

@Injectable()
export class OnlinePaymentServiceService {
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

  getAllPaymentRecords(obj){
    obj.from_date = moment(obj.from_date).format('YYYY-MM-DD');
    obj.to_date = moment(obj.to_date).format('YYYY-MM-DD');
    let url= this.baseUrl + "/api/v1/studentWise/fee/feesReport/onlinePayment/pastHistory/" + this.institute_id + "/details";
    return this.http.post(url ,obj, {headers:this.headers}).pipe(map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    ))
  }
}
