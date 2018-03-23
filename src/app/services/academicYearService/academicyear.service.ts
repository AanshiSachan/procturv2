import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import {Observable} from 'rxjs/observable';
 
@Injectable()
export class AcademicyearService {

  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService,
  ) {
    this.institute_id = this.auth.getInstituteId();
    this.Authorization = this.auth.getAuthToken();
    this.baseUrl = this.auth.getBaseUrl();
    this.headers = new HttpHeaders(
      { "Content-Type": "application/json", "Authorization": this.Authorization });
  }


  getServices(){

    let url= this.baseUrl + "/api/v1/academicYear/all/" + this.institute_id;
    return this.http.get(url, {headers: this.headers}).map(
      data => {
        console.log(data);
        return data;
    },
    error => {
        return error;
    }
    )
  }
  

}
