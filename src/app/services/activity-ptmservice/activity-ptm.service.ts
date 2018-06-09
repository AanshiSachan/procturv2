import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import * as moment from 'moment';

@Injectable()
export class ActivityPtmService {
  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;

  constructor(private http: HttpClient, private auth: AuthenticatorService)
   {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.baseUrl = this.auth.getBaseUrl();
  }

  getBatches(obj){
    let isActive = obj.is_active == 1 ? "Y" : "N";
    let url = this.baseUrl + "/api/v1/batches/all/" + this.institute_id + "?";
    return this.http.get(url , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

}
  