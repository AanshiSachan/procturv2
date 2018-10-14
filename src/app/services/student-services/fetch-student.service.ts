import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { instituteInfo } from '../../model/instituteinfo';
import { Students } from '../../model/student-data';
import { Observable } from 'rxjs/Observable';
import { AuthenticatorService } from '../authenticator.service';


@Injectable()
export class FetchStudentService {

  studentFees: any;
  url: string;
  baseUrl: string = '';
  authorization: string;
  institute_id: number;
  headers: any;

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

  fetchAllStudentDetails(instituteData: instituteInfo): any {
    let instituteFormData = JSON.parse(JSON.stringify(instituteData));
    //let urlStudentList = this.baseUrl + "/api/v1/students/manage/" + this.institute_id;
    let urlStudentList = this.baseUrl + "/api/v1/students/manage/v2/" + this.institute_id;
    return this.http.post(urlStudentList, instituteData, { headers: this.headers })
      .map(res => {
        return res;
      });
  }

  downloadStudentTableasXls(form) {
    let urlDownloadXlsStudent = this.baseUrl + "/api/v1/students/all/download/" + this.institute_id;

    return this.http.post(urlDownloadXlsStudent, form, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )

  }

  getStudentById(id) {

    let urlStudentId = this.baseUrl + "/api/v1/students/" + id;

    return this.http.get(urlStudentId, { headers: this.headers }).map(
      res => {
        return res;
      }
    )
  }

  fetchBulkUpdateStatusReport() {
    let urlstudentReport = this.baseUrl + "/api/v1/bulkUpload/" + this.institute_id;

    let obj = { func_type: "studentBulkUpload" };

    return this.http.post(urlstudentReport, obj, { headers: this.headers }).map(
      res => { return res }
    )
  }

  fetchDownloadTemplate(): Observable<any> {

    let urlStudentUploadTemplate = this.baseUrl + "/api/v1/students/download/bulkUploadStudentsTemplate";

    return this.http.get(urlStudentUploadTemplate, { headers: this.headers }).map(
      res => {
        return res;
      }
    )

  }

  fetchStudentFeeDetailById(id): Observable<any> {

    let urlFeeById = this.baseUrl + "/api/v1/studentWise/fee/schedule/fetch/" + this.institute_id + "/" + id;

    return this.http.get(urlFeeById, { headers: this.headers }).map(
      res => {
        this.studentFees = res;
        return res;
      },
      err => {
        return err;
      })
  }

  getStoredFees() {
    return this.studentFees;
  }

  fetchSuccess(id): Observable<any> {

    let url = this.baseUrl + "/api/v1/bulkUpload/100058/success/download/" + id;

    return this.http.get(url, { headers: this.headers }).map(
      res => { return res; },
      err => { return err; }
    );

  }

  fetchFailure(id): Observable<any> {

    let url = this.baseUrl + "/api/v1/bulkUpload/100058/download/" + id;

    return this.http.get(url, { headers: this.headers }).map(
      res => { return res; },
      err => { return err; }
    );

  }

  // Mark LEave For Student

  getStudentLeaveData(id) {
    let url = this.baseUrl + "/api/v1/studentleaves/" + id;

    return this.http.get(url, { headers: this.headers }).map(
      res => { return res; },
      err => { return err; }
    );
  }

  markLeaveForDays(obj) {
    let url = this.baseUrl + "/api/v1/studentleaves";
    return this.http.post(url, obj, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  cancelLeaveOfDay(id) {
    let url = this.baseUrl + "/api/v1/studentleaves/cancel/" + id;
    return this.http.delete(url, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  getFeeReceiptById(sid, id) {
    let url = this.baseUrl + "/api/v1/studentWise/fee/" + sid + "/feeReceipt/" + id + "/download"
    //?fin_yr=17-18;
    return this.http.get(url, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  emailReceiptById(sid, id): any {
    let url = this.baseUrl + "/api/v1/studentWise/fee/" + sid + "/feeReceipt/" + id + "/download?emailSent=Y";
    //fin_yr=18-19& 
    return this.http.get(url, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  getStudentCourseDetails(id): Observable<any> {
    let url = this.baseUrl + "/api/v1/studentWise/fee/" + this.institute_id + "/" + id;
    return this.http.get(url, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  getStudentPartialPaymentHistory(student_id: any, schedule_id: any): Observable<any> {
    let url = this.baseUrl + "/api/v1/studentWise/fee/schedule/paymentHistory/fetch/" + this.institute_id + "/" + student_id + "/" + schedule_id;
    return this.http.get(url, { headers: this.headers }).map(
      res => { return res; },
      err => { return err; }
    )
  }

}
