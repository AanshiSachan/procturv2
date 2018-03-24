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
    baseUrl: string = '';

    constructor(private http: Http, private auth: AuthenticatorService) {
        this.authorization = this.auth.getAuthToken();
        this.institute_id = this.auth.getInstituteId();
        this.baseUrl = this.auth.getBaseUrl();
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Authorization", this.authorization);
    }

    quickAddStudent(form) {
        let urlQuickAdd = this.baseUrl + "/api/v1/students"
        form.dob = form.dob = (form.dob == '' || form.dob == 'Invalid date' || form.dob == null) ? '' : moment(form.dob).format('YYYY-MM-DD');
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
        let urlQuickEdit = this.baseUrl + "/api/v1/students/" + id;
        form.dob = form.dob = (form.dob == '' || form.dob == 'Invalid date' || form.dob == null) ? '' : moment(form.dob).format('YYYY-MM-DD');
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



    allocateStudentInventory(obj) {

        let urlInventory = this.baseUrl + "/api/v1/inventory/item/allocate/multiple";

        return this.http.post(urlInventory, obj, { headers: this.headers }).map(
            res => {
                return res.json();
            },
            err => {
                return err.json();
            }
        );
    }

    allocateStudentFees(obj) {
        obj.paid_date = moment(obj.paid_date).format("YYYY-MM-DD");
        let urlFeeUpdate = this.baseUrl + "/api/v1/studentWise/fee/schedule/students/save/" + this.institute_id;

        return this.http.post(urlFeeUpdate, obj, { headers: this.headers }).map(
            res => {
                return res.json();
            },
            err => {
                return err.json();
            });
    }


    addChequePdc(obj) {
        let urlAddCheque: string = this.baseUrl + "/api/v1/student_cheque/createList";

        return this.http.post(urlAddCheque, obj, { headers: this.headers }).map(
            res => { return res.json(); },
            err => { return err.json(); }
        )
    }


    updateFeeDetails(obj): Observable<any> {

        let urlUpdateFee = this.baseUrl + "/api/v1/student_cheque/update";

        return this.http.put(urlUpdateFee, obj, { headers: this.headers }).map(
            res => { return res.json(); },
            err => { return err.json(); }
        )
    }


    deletePdcById(id): Observable<any> {
        let urlDeletePdc = this.baseUrl + "/api/v1/student_cheque/delete/" + this.institute_id + "/" + id;
        return this.http.delete(urlDeletePdc, { headers: this.headers }).map(
            res => { return res.json(); },
            err => { return err.json(); }
        )
    }


    generateAcknowledge(arr, id, email): Observable<any> {
        let urlsend = this.baseUrl + "/api/v1/student_cheque/generateAck/" + this.institute_id + "/" + id + "?ChequeIds=" + arr + "&sendEmail=" + email;

        return this.http.post(urlsend, null, { headers: this.headers }).map(
            res => { return res.json(); },
            err => { return err.json(); }
        )
    }

    sendAcknowledge(arr: any[], id): Observable<any> {
        let urlsend = this.baseUrl + "/api/v1/student_cheque/generateAck/" + this.institute_id + "/" + id + "?ChequeIds=" + arr.join(',') + "&sendEmail=Y";

        return this.http.post(urlsend, null, { headers: this.headers }).map(
            res => { return res.json(); },
            err => { return err.json(); }
        )
    }

    uploadStudentBulk(obj): Observable<any> {
        let urlPostXlsDocument = this.baseUrl + "/api/v1/students/bulkUpload";

        return this.http.post(urlPostXlsDocument, obj, { headers: this.headers }).map(
            res => { return res.json(); },
            err => { return err.json(); }
        )
    }

    generateFeeReceipt(id, feeid): Observable<any> {

        let url = this.baseUrl + "/api/v1/studentWise/fee/" + id + "/feeReceipt/" + feeid + "/download?emailSent=Y";

        return this.http.get(url, { headers: this.headers }).map(
            res => {
                console.log(res);
                return res;
            },
            err => {
                return err;
            }
        )
    }

}




