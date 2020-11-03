
import {map} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticatorService } from "../../../../services/authenticator.service";


@Injectable()
export class monitoringService {

    baseUrl: string = '';
    institute_id: string;
    Authorization: string;
    headers: HttpHeaders;

    /* set default value for each url, header and autherization on service creation */
    constructor(private http: HttpClient, private auth: AuthenticatorService, ) {
        this.institute_id = sessionStorage.getItem('institute_id');

        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        });

        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });

        this.baseUrl = this.auth.getBaseUrl();

    }

    fetchFeeStackMonitor(): Observable<any> {

        let url = this.baseUrl + "/api/v1/studentWise/fee/students/highCharts/" +this.institute_id;

        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        ))
    }


    fetchFeeMonitor(obj): Observable<any> {

        let url = this.baseUrl + "/api/v1/studentWise/fee/students/highChartsRender";

        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        ))

    }


}