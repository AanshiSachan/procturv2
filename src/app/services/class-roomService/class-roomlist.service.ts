import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";


@Injectable()
export class ClassRoomService {

    baseUrl: string = '';
    institute_id: string;
    Authorization: string;
    headers;

    constructor(private http: HttpClient, private auth1: AuthenticatorService) {
        this.auth1.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth1.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.baseUrl = this.auth1.getBaseUrl();
    }

    fetchClassList() {
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
        obj.inst_id = this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    updateclassListData(obj) {
        let url = this.baseUrl + "/api/v1/batchClassRoom/" + obj.class_room_id;
        obj.inst_id = this.institute_id;
        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }
}