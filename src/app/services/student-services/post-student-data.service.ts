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

        let urlQuickAdd = this.baseUrl + "/api/v1/students"
        form.dob = moment(form.dob).format('YYYY-MM-DD');
        form.doj = moment(form.doj).format('YYYY-MM-DD');
        /* form.assignedBatches = form.assignedBatches.length == 0 ? null : form.assignedBatches;
        form.batchJoiningDates = form.batchJoiningDates.length == 0 ? null : form.batchJoiningDates; */
        return this.http.post(urlQuickAdd, form, { headers: this.headers }).map(
            res => {
                return res.json();
            },
            err => {
                return err.json();
            }
        )
    }


    quickEditStudent(form, id) {

        let urlQuickEdit = this.baseUrl + "/api/v1/students/" +id;
        form.dob = moment(form.dob).format('YYYY-MM-DD');
        form.doj = moment(form.doj).format('YYYY-MM-DD');
        /* form.assignedBatches = form.assignedBatches.length == 0 ? null : form.assignedBatches;
        form.batchJoiningDates = form.batchJoiningDates.length == 0 ? null : form.batchJoiningDates; */
        return this.http.put(urlQuickEdit, form, { headers: this.headers }).map(
            res => {
                return res.json();
            },
            err => {
                return err.json();
            }
        )
    }


    archieveStudents(obj) {
        let urlDeleteStudent = this.baseUrl + '/api/v1/archive/students';

        return this.http.post(urlDeleteStudent, obj, { headers: this.headers }).map(
            res => { return res.json() },
            err => { return err.json() }
        )
    }


    updateComment(obj, id) {
        let urlUpdateComment = this.baseUrl + '/api/v1/students/comment/' + id;

        return this.http.put(urlUpdateComment, obj, { headers: this.headers }).map(
            res => { return res.json() },
            err => { return err.json() }
        )
    }


    updateInstituteDetails(id, req) {

        let urlInstituteUpdater = this.baseUrl + "/api/v1/schools/" + id;

        let data = {
            school_name: req.school_name,
            is_active: "Y",
            institution_id: this.institute_id
        }

        return this.http.put(urlInstituteUpdater, data, { headers: this.headers }).map(
            res => { return res.json(); }
        )

    }



    deleteInstitute(id) {

        let urlInstituteDeleter = this.baseUrl + "/api/v1/schools/" + id;

        return this.http.delete(urlInstituteDeleter, { headers: this.headers }).map(
            res => { return res.json(); }
        )
    }


    allocateStudentInventory(id, obj){

        let urlInventory = this.baseUrl +"/api/v1/inventory/item/allocate";

        return this.http.post(urlInventory, obj, {headers: this.headers}).map(
            res => {
                return res.json();
            },
            err => {
                return err.json();
            });
    }

    allocateStudentFees(obj){
        let urlFeeUpdate = this.baseUrl +"/api/v1/studentWise/fee/schedule/students/save/" +this.institute_id;

        return this.http.post(urlFeeUpdate, obj, {headers: this.headers}).map(
            res => {
                return res.json();
            },
            err => {
                return err.json();
            });
    }

}

