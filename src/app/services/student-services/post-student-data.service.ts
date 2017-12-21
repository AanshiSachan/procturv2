import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AuthenticatorService } from '../authenticator.service';


@Injectable()
export class PostStudentDataService {


    authorization: string;
    institute_id: number;
    headers: Headers;
    baseUrl: string = 'http://test999.proctur.com/StdMgmtWebAPI';

    constructor(private http: Http, private auth: AuthenticatorService) {
        this.authorization = this.auth.getAuthToken();
        this.institute_id = this.auth.getInstituteId();
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Authorization", this.authorization);
     }

    quickAddStudent(form) {

        let urlQuickAdd = this.baseUrl +"/api/v1/students"
        form.dob = moment(form.dob).format('YYYY-MM-DD');
        form.doj = moment(form.doj).format('YYYY-MM-DD');
        /* form.assignedBatches = form.assignedBatches.length == 0 ? null : form.assignedBatches;
        form.batchJoiningDates = form.batchJoiningDates.length == 0 ? null : form.batchJoiningDates; */        
        return this.http.post(urlQuickAdd, form, {headers: this.headers}).map(
            res => {
                return res.json();
            },
            err => {
                return err.json();
            }
        )
    }


    archieveStudents(obj){
        let urlDeleteStudent = this.baseUrl +'/api/v1/archive/students';

        return this.http.post(urlDeleteStudent, obj, {headers: this.headers}).map(
            res => { return res.json()},
            err => { return err.json()}
        )
    }
}

