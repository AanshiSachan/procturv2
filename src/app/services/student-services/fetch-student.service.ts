import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import { instituteInfo } from '../../model/instituteinfo';
import { Students } from '../../model/student-data';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AuthenticatorService } from '../authenticator.service';


@Injectable()
export class FetchStudentService {

  studentFees: any;
  url: string;
  baseUrl: string = '';
  authorization: string;
  institute_id: number;
  headers: Headers;

  constructor(private http: Http, private auth: AuthenticatorService) {
    this.authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.baseUrl = this.auth.getBaseUrl();
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.authorization);
  }

  fetchAllStudentDetails(instituteData: instituteInfo): any {

    let instituteFormData = JSON.parse(JSON.stringify(instituteData));
    let urlStudentList = this.baseUrl + "/api/v1/students/manage/" + this.institute_id;

    return this.http.post(urlStudentList, instituteData, { headers: this.headers })
      .map(res => {
        return res.json();
      });
  }


  downloadStudentTableasXls(form) {
    let urlDownloadXlsStudent = this.baseUrl + "/api/v1/students/all/download/" + this.institute_id;

    return this.http.post(urlDownloadXlsStudent, form, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }
    )

  }


  getStudentById(id) {

    let urlStudentId = this.baseUrl + "/api/v1/students/" + id;

    return this.http.get(urlStudentId, { headers: this.headers }).map(
      res => {
        return res.json();
      }
    )
  }



  fetchBulkUpdateStatusReport() {
    let urlstudentReport = this.baseUrl + "/api/v1/bulkUpload/" + this.institute_id;

    let obj = { func_type: "studentBulkUpload" };

    return this.http.post(urlstudentReport, obj, { headers: this.headers }).map(
      res => { return res.json() }
    )
  }


  fetchDownloadTemplate(): Observable<any> {

    let urlStudentUploadTemplate = this.baseUrl + "/api/v1/students/download/bulkUploadStudentsTemplate";

    return this.http.get(urlStudentUploadTemplate, { headers: this.headers }).map(
      res => {
        return res.json();
      }
    )

  }

  fetchStudentFeeDetailById(id): Observable<any> {

    let urlFeeById = this.baseUrl + "/api/v1/studentWise/fee/schedule/fetch/" + this.institute_id + "/" + id;

    return this.http.get(urlFeeById, { headers: this.headers }).map(
      res => {
        this.studentFees = res.json();
        return res.json();
      },
      err => {
        return err.json();
      })
  }

  getStoredFees(){
    return this.studentFees;
  }

  fetchSuccess(id): Observable<any> {

    let url = this.baseUrl + "/api/v1/bulkUpload/100058/success/download/" + id;

    return this.http.get(url, { headers: this.headers }).map(
      res => { return res.json(); },
      err => { return err.json(); }
    );

  }

  fetchFailure(id): Observable<any> {

    let url = this.baseUrl + "/api/v1/bulkUpload/100058/download/" + id;

    return this.http.get(url, { headers: this.headers }).map(
      res => { return res.json(); },
      err => { return err.json(); }
    );

  }

  // Mark LEave For Student

  getStudentLeaveData(id) {
    let url = this.baseUrl + "/api/v1/studentleaves/" + id;

    return this.http.get(url, { headers: this.headers }).map(
      res => { return res.json(); },
      err => { return err.json(); }
    );
  }

  markLeaveForDays(obj) {
    let url = this.baseUrl + "/api/v1/studentleaves";
    return this.http.post(url, obj, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }
    )
  }

  cancelLeaveOfDay(id) {
    let url = this.baseUrl + "/api/v1/studentleaves/cancel/" + id;
    return this.http.delete(url, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }
    )
  }

  getFeeReceiptById(id){
    let url = this.baseUrl +"/api/v1/studentWise/fee/" +11791 +"/feeReceipt/" +id +"/download?fin_yr=17-18";
    return this.http.get(url, {headers: this.headers}).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }
    )
  }


}
