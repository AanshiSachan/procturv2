import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';

@Injectable()
export class StandardServices {
    baseURL: string;
    createNewStandardURL: string;
    headers: Headers;

    constructor(private http: Http) {
        this.baseURL = "https://app.proctur.com/StdMgmtWebAPI";
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json;charset=UTF-8");
        this.headers.append("Authorization", sessionStorage.getItem('Authorization'));
    }

    createNewStandard(std) {
        this.createNewStandardURL = this.baseURL + "/api/v1/standards";
        let data  = JSON.parse(JSON.stringify(std));
        return this.http.post(this.createNewStandardURL, data , { headers: this.headers })
        .map(res => {
            return res.json();
        },
        err=>{
            return err.json();
        });
    }
}