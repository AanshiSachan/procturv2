import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';

@Injectable()
export class StandardServices {
    baseURL: string = "http://test999.proctur.com/StdMgmtWebAPI";
    urlNewStandard: string;
    headers: Headers;

    constructor(private http: Http) {
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json;charset=UTF-8");
        this.headers.append("Authorization", sessionStorage.getItem('Authorization'));
    }

    createNewStandard(std) {
        this.urlNewStandard = this.baseURL + "/api/v1/standards";
        let data  = JSON.parse(JSON.stringify(std));
        return this.http.post(this.urlNewStandard, data , { headers: this.headers })
        .map(res => {
            return res.json();
        },
        err=>{
            return err.json();
        });
    }
}