import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { AuthenticatorService } from '../authenticator.service';


@Injectable()
export class PostStudentDataService {


    authorization: string;
    institute_id: number;
    headers: any;
    baseUrl: string = '';

    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.auth.currentAuthKey.subscribe(key => {
            this.authorization = key;
            this.headers = new HttpHeaders(
                { "Content-Type": "application/json", "Authorization": this.authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.baseUrl = this.auth.getBaseUrl();
    }

    quickAddStudent(form) {
        let urlQuickAdd = this.baseUrl + "/api/v1/students"
        form.dob = form.dob = (form.dob == '' || form.dob == 'Invalid date' || form.dob == null) ? '' : moment(form.dob).format('YYYY-MM-DD');
        form.doj = moment(form.doj).format('YYYY-MM-DD');
        /* form.assignedBatches = form.assignedBatches.length == 0 ? null : form.assignedBatches;
        form.batchJoiningDates = form.batchJoiningDates.length == 0 ? null : form.batchJoiningDates; */
        return this.http.post(urlQuickAdd, form, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
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
                return res;
            },
            err => {
                return err;
            }
        )
    }


    archieveStudents(obj) {
        let urlDeleteStudent = this.baseUrl + '/api/v1/archive/students';

        return this.http.post(urlDeleteStudent, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }


    updateComment(obj, id) {
        let urlUpdateComment = this.baseUrl + '/api/v1/students/comment/' + id;

        return this.http.put(urlUpdateComment, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
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
            res => { return res }
        )

    }



    deleteInstitute(id) {

        let urlInstituteDeleter = this.baseUrl + "/api/v1/schools/" + id;

        return this.http.delete(urlInstituteDeleter, { headers: this.headers }).map(
            res => { return res; }
        )
    }


    allocateInventory(obj) {
        let urlInventory = this.baseUrl + "/api/v1/inventory/item/allocate";
        return this.http.post(urlInventory, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        );
    }


    getAllocatedHistory(id) {
        let urlInventory = this.baseUrl + "/api/v1/inventory/item/student/txHistory/" + id;
        return this.http.get(urlInventory, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        );
    }

    deleteInventory(id) {
        let urlInventory = this.baseUrl + "/api/v1/inventory/item/txHistory/" + id;
        return this.http.delete(urlInventory, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        );
    }


    allocateStudentInventory(obj) {

        let urlInventory = this.baseUrl + "/api/v1/inventory/item/allocate/multiple";

        return this.http.post(urlInventory, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        );
    }

    allocateStudentFees(obj) {
        if (obj.hasOwnProperty('paid_date')) {
            obj.paid_date = moment(obj.paid_date).format("YYYY-MM-DD");
        }
        let urlFeeUpdate = this.baseUrl + "/api/v1/studentWise/fee/schedule/students/save/" + this.institute_id;

        return this.http.post(urlFeeUpdate, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            });
    }


    addChequePdc(obj) {
        let urlAddCheque: string = this.baseUrl + "/api/v1/student_cheque/createList";

        return this.http.post(urlAddCheque, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }


    updateFeeDetails(obj): Observable<any> {

        let urlUpdateFee = this.baseUrl + "/api/v1/student_cheque/update";

        return this.http.put(urlUpdateFee, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }


    deletePdcById(id): Observable<any> {
        let urlDeletePdc = this.baseUrl + "/api/v1/student_cheque/delete/" + this.institute_id + "/" + id;
        return this.http.delete(urlDeletePdc, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }


    generateAcknowledge(chid, id, email): Observable<any> {
        let urlsend = this.baseUrl + "/api/v1/student_cheque/generateAck/" + this.institute_id + "/" + id + "?ChequeIds=" + chid + "&sendEmail=" + email;
        return this.http.post(urlsend, null, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    sendAcknowledge(chid, id): Observable<any> {
        let urlsend = this.baseUrl + "/api/v1/student_cheque/generateAck/" + this.institute_id + "/" + id + "?ChequeIds=" + chid + "&sendEmail=Y";

        return this.http.post(urlsend, null, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    uploadStudentBulk(obj): Observable<any> {
        let urlPostXlsDocument = this.baseUrl + "/api/v1/students/studentBulkUploadV2";

        return this.http.post(urlPostXlsDocument, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    generateFeeReceipt(id, feeid): Observable<any> {
        let url = this.baseUrl + "/api/v1/studentWise/fee/" + id + "/feeReceipt/" + feeid + "/download?emailSent=Y";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    payPartialFeeAmount(obj): any {
        let url = this.baseUrl + "/api/v1/studentWise/fee/students/" + this.institute_id + "/save";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }

        )

    }

}




