import { Injectable } from '@angular/core';
import {Headers,Http } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as moment from 'moment';
import { AuthenticatorService } from "../authenticator.service";


@Injectable()
export class ClassRoomService {

    baseUrl: string = '';
    institute_id: string;
    Authorization: string;
    headers;

   constructor(private http: HttpClient, private auth1: AuthenticatorService) {
        this.auth1.currentAuthKey.subscribe( key => {
          this.Authorization = key;
          this.headers = new Headers();
          this.headers.append("Content-Type", "application/json");
          this.headers.append("Authorization", this.Authorization);
         }) 
        this.auth1.currentInstituteId.subscribe( id => {
          this.institute_id = id;
        });
        this.baseUrl = this.auth1.getBaseUrl();
}
    
    fetchClassList(): Observable<any> {
        console.log(this.baseUrl);
        let url = this.baseUrl + "/api/v1/batchClassRoom/all/" + this.institute_id;

        return this.http.get(url, { headers: this.headers }).map(
            res => {
                console.log(res);
                return res;
            },
            err => {
                return err;
            })
    }

    saveClassroomDetail(obj) {
        
        let url = this.baseUrl + "/api/v1/batchClassRoom/";
        obj.inst_id= this.institute_id;

        return this.http.post(url,obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    updateclassListData(obj){
        let url = this.baseUrl + "/api/v1/batchClassRoom/" +obj.class_room_id;
        obj.inst_id= this.institute_id;
        return this.http.put(url,obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }
}