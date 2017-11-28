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
    /* this.url = "http://test999.proctur.com/ResponseList";
    let instituteFormData = `institute_id=${instituteData.institute_id}&function_type=${instituteData.function_type}&username=${instituteData.username}&password=${instituteData.password}&school=${instituteData.school}&standard_id=${instituteData.standard_id}&batch_id=${instituteData.batch_id}&is_load=${instituteData.is_load}&name=${instituteData.name}&is_active=${instituteData.is_active}&mobile=${instituteData.mobile}&language_inst_status=${instituteData.language_inst_status}&subject_id=${instituteData.subject_id}&slot_id=${instituteData.slot_id}&master_course_name=${instituteData.master_course_name}&course_id=${instituteData.course_id}&start_index=${instituteData.start_index}&batch_size=${instituteData.batch_size}`;
    return this.http.post(this.url, instituteFormData, { headers: this.headers })
    .map(res => {
      return res.json().aaData
    }) */

    let instituteFormData = JSON.parse(JSON.stringify(instituteData));
    let urlStudentList = this.baseUrl + "/api/v1/students/manage/" + this.institute_id;

    return this.http.post(urlStudentList, instituteData, { headers: this.headers })
      .map(res => {
        return res.json();
      });
  }

}
