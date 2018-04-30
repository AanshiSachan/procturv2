import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as moment from 'moment';
import { AuthenticatorService } from './authenticator.service';

@Injectable()
export class EventManagmentService {
  baseUrl: string = '';
  institute_id: string;
  Authorization: string;
  headers: HttpHeaders;


  constructor(private http: HttpClient, private auth1: AuthenticatorService, ) {
    this.Authorization = sessionStorage.getItem('Authorization');
    this.institute_id = sessionStorage.getItem('institute_id');
    this.baseUrl = this.auth1.getBaseUrl();
    this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
}

getListEventDesc(obj){
let url = this.baseUrl + "/api/v1/holiday_manager/getDetail/" + this.institute_id;
//obj.institute_id= this.institute_id;
return this.http.post(url, obj, {headers:this.headers}).map(
  res=>{
    return res
  },
  error=>{
    return error
  },
)}
saveEventDescData(obj){
  let url = this.baseUrl +"/api/v1/holiday_manager/create/";
  return this.http.post(url,obj,{headers: this.headers}).map(
    res=>{
      return res
    },
    error=>{
      return error
    },
  )}
  
sendNotifiation(obj){
  let url = this.baseUrl +"/api/v1/pushNotification/send/";
  return this.http.post(url,obj,{headers: this.headers}).map(
    res=>{
      return res
    },
    error=>{
      return error
    },
  )}
}



