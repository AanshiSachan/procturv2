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

  url: string;
  baseUrl: string = 'http://test999.proctur.com/StdMgmtWebAPI';
  authorization: string;
  institute_id: number;
  headers: Headers;

  constructor(private http: Http, private auth: AuthenticatorService) {
    this.authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
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



  downloadStudentTableasXls(form){
    let urlDownloadXlsStudent = this.baseUrl +"/api/v1/students/all/download/" +this.institute_id;

    return this.http.post(urlDownloadXlsStudent, form, {headers: this.headers}).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }
    )

  }


  getStudentById(id){

    let urlStudentId = this.baseUrl +"/api/v1/students/" +id;

    return this.http.get(urlStudentId, {headers: this.headers}).map(
      res => {
        return res.json();
      }
    )
    
  }

}
