import { Injectable } from '@angular/core';
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
    headers: HttpHeaders;



    /* set default value for each url, header and autherization on service creation */
    constructor(private http: HttpClient, private auth1: AuthenticatorService, ) {
        this.Authorization = sessionStorage.getItem('Authorization');
        this.institute_id = sessionStorage.getItem('institute_id');
        this.baseUrl = this.auth1.getBaseUrl();
        this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    }

    fetchClassList(): Observable<any> {
        let url = this.baseUrl + "/api/v1/batchClassRoom/all/" + this.institute_id;

        return this.http.get(url, { headers: this.headers }).map(
            res => {
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
