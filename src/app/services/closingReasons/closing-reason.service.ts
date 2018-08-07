import { Injectable } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ClosingReasonService {

  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService,
  ) {
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

  getAllReasons() {
    let url = this.baseUrl + "/api/v2/enquiry_manager/fetchEnquiryClosingReason/" + this.institute_id;
    return this.http.get(url, { headers: this.headers }).map(
      (data: any) => {
        return data;
      },
      (error: any) => {
        return error;
      }
    )
  }

  createReason(obj) {
    let url = this.baseUrl + "/api/v2/enquiry_manager/enquiryClosingReason"
    return this.http.post(url, obj, { headers: this.headers }).map(
      (data: any) => {
        return data;
      },
      (error: any) => {
        return error;
      }
    )
  }

  updateClosingReason(obj , id){
    let url =this.baseUrl + "/api/v2/enquiry_manager/updateEnquiryClosingReason/" + id;
    return this.http.put(url , obj , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }
}
