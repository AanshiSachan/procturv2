
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";

@Injectable()

export class UserService {

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
            this.headers = new HttpHeaders(
                { "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.baseUrl = this.auth.getBaseUrl();
    }

    getUserList(obj, active) {
        let url = this.baseUrl + "/api/v1/profiles/all/" + this.institute_id + "?active=" + active;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    getRoles() {
        let url = this.baseUrl + "/api/v1/roleApi/allRoles/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    fetchUserDetails(id) {
        let url = this.baseUrl + "/api/v1/profiles/" + id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    sendSmS(obj) {
        let url = this.baseUrl + "/api/v1/profiles/sendAPPSMS/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    getItemList(id) {
        let url = this.baseUrl + "/api/v1/inventory/item/fetchForUserAllocation/" + id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    getAllotedHistroy(id) {
        let url = this.baseUrl + "/api/v1/inventory/item/user/txHistory/" + id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    allocateItem(obj) {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/inventory/item/user/allocate";
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    deleteInventory(id) {
        let url = this.baseUrl + "/api/v1/inventory/item/txHistory/" + id;
        return this.http.delete(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    createUser(obj) {
        obj.institute_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/profiles";
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    updateUserDetails(obj , id){
        obj.institute_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/profiles/" + id;
        return this.http.put(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

}