import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";

@Injectable()
export class CounsellorServiceService {


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
    return this.http.post(url, obj, { headers: this.headers }).map(
      (data: any) => {
        return data;
      },
      (error: any) => {
        return error;
      }
    )
  }

  counsellorDetails(obj){
    let url = this.baseUrl + "/api/v1/enquiry/report/" + this.institute_id;
    return this.http.post(url , obj , {headers : this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }


}
