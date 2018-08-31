import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfitLossServiceService {

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


  fetchExpenseDetails(obj){
   
    let url = this.baseUrl + "/api/v1/expense/all/" + this.institute_id;
    return this.http.post(url , obj , {headers :this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  fetchProfitLossReport(obj){
    
    let url = this.baseUrl + "/api/v1/inventory/item/getProfit_Lost/" +this.institute_id;
    return this.http.post(url , obj , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  fetchIncomeFeesCollection(obj){
  
    let url = this.baseUrl + "/api/v1/income/feesCollection/" + this.institute_id;
    return this.http.post(url , obj , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  fetchIncomeDetails(obj){
    let url = this.baseUrl + "/api/v1/income/all/" + this.institute_id;
    return this.http.post(url , obj , {headers :this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

}
