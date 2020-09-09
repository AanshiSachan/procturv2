
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../../services/authenticator.service";

@Injectable()
export class EnquiryReportService {


  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;


  constructor(private http: HttpClient,
    private auth: AuthenticatorService, ) {

    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    });
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    // this.institute_id = this.auth.getInstituteId();
    // this.Authorization = this.auth.getAuthToken();
    this.baseUrl = this.auth.getBaseUrl();

  }

  counsellorInformation(obj) {
    let url = this.baseUrl + "/api/v1/profiles/" + this.institute_id;
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      (data: any) => {
        return data;
      },
      (error: any) => {
        return error;
      }
    ))
  }

  counsellorDetails(obj){
    let url = this.baseUrl + "/api/v1/enquiry/report/" + this.institute_id;
    return this.http.post(url , obj , {headers : this.headers}).pipe(map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    ))
  }

  sourceData(){
    let url =this.baseUrl + "/api/v1/enquiry_campaign/master/lead_source/" + this.institute_id + "/all"
    return this.http.get(url , {headers : this.headers}).pipe(map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    ))
  }

  referredByDetails(){
    let url = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_referred_by/" + this.institute_id + "/all"
    return this.http.get(url , {headers : this.headers}).pipe(map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    ))
  }

  enquiryCategorySearch(payload){
    let url = this.baseUrl + "/api/v1/enquiry_manager/search/" + this.institute_id;
    return this.http.post(url , payload,{headers : this.headers}).pipe(map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    ))
  }

}
