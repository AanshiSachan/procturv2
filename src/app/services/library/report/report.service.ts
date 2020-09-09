
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../authenticator.service";

@Injectable()
export class ReportService {

  baseUrl: string = '';
  Authorization: string;
  headers: any;
  headersPost: any;
  institute_id: any;
  userid: any;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService
  ) {
    this.userid = sessionStorage.getItem('userid');
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders();
       this.headers = this.headers.append('Content-Type', 'application/json');
       this.headers = this.headers.append('Authorization', this.Authorization);
       this.headers = this.headers.append("Accept", "*");
       this.headers = this.headers.append("x-proc-inst-id", this.institute_id.toString());
       this.headers = this.headers.append("x-proc-user-id", this.userid.toString());
    })

    this.baseUrl = this.auth.getBaseUrl();
  }

  getLostBookReport(obj){
    let url = this.baseUrl + "/library/report/lostBookReport";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  getScrapBookReport(obj){
    let url = this.baseUrl + "/library/report/scrapBookReport";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  getOverDueBookReport(obj){
    let url = this.baseUrl + "/library/report/overdueBookReport";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  getNeverIssuedBookReport(){
    let url = this.baseUrl + "/library/analytics/never-issued-books";
    return this.http.get(url, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  getFineCollectionReport(obj){
    let url = this.baseUrl + "/library/report/fineCollectionReportBorrowerWise";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  getIssueBookReport(obj){
    let url = this.baseUrl + "/library/report/issuedBookReport";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  getReturnBookReport(obj){
    let url = this.baseUrl + "/library/report/overdueBookReport";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  downloadReceipt(issueBookId){
    let url = this.baseUrl + "/library/book/download?issueBookId="+issueBookId;
    return this.http.get(url, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

}
