
import {map} from 'rxjs/operators';
import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../../services/authenticator.service";
import * as moment from 'moment';

@Injectable()
export class AttendanceReportServiceService {
  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;
  standard_id;
  subject_id;
  assigned;

  constructor(private http: HttpClient, private auth: AuthenticatorService) {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    // this.institute_id = this.auth.getInstituteId();
    // this.Authorization = this.auth.getAuthToken();
    //console.log(this.institute_id);
    this.baseUrl = this.auth.getBaseUrl();
    //this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });

  }

  getMasterCourse() {
    let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all"
    return this.http.get(url, { headers: this.headers }).pipe(map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    ))
  }

  getCourses(obj) {
    let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/" + obj
    return this.http.get(url, { headers: this.headers }).pipe(map(
      data => {
        return data;
      },
      error => {
        return error;
      }

    ))
  }
  getSubject(obj) {

    let url = this.baseUrl + "/api/v1/courseMaster/fetch/courses/" + this.institute_id + "/" + obj
    return this.http.get(url, { headers: this.headers }).pipe(map(
      data => {
        return data;
      },
      error => {
        return error;
      }

    ))

  }

  postDataToTable(obj) {

    obj.from_date = moment(obj.from_date).format('YYYY-MM-DD');
    obj.to_date = moment(obj.to_date).format('YYYY-MM-DD');
    if (obj.from_date == "Invalid date") {
      obj.from_date = "";
    }
    if (obj.to_date == "Invalid date") {
      obj.to_date = "";
    }
    let url = this.baseUrl + "/api/v1/reports/attendance";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    ))
  }

  postDataToTablePro(obj) {

    obj.from_date = moment(obj.from_date).format('YYYY-MM-DD');
    obj.to_date = moment(obj.to_date).format('YYYY-MM-DD');
    if (obj.from_date == "Invalid date") {
      obj.from_date = "";
    }
    if (obj.to_date == "Invalid date") {
      obj.to_date = "";
    }
    let url = this.baseUrl + "/api/v1/reports/attendance";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    ))
  }
  postDetailedData(obj) {
    let url = this.baseUrl + "/api/v1/reports/attendance/monthlyAttendanceReport";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      data => {
        return data;
      },
      error => {
        return error;
      }

    ))
  }
  /* =========================================================================== */
  /* =========================================================================== */
  /*for professional*/

  fetchMasterCourseProfessional(obj) {

    let url = this.baseUrl + "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id + "?standard_id=" + obj.standard_id + "&subject_id=" + obj.subject_id + "&assigned=N";
    return this.http.get(url, { headers: this.headers }).pipe(map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    ))

  }
  // excelTableDownload(body){

  //   let user_token:string = this.Authorization.getToken();
  //   this.headers.append('Authorization', 'Bearer' + user_token);
  //   return this.http.post(this.excelTableDownload(body),  {headers:this.headers, responseType:ResponseContentType.Blob} ,body ).map((res)=>new Blob([res._body],{ type: 'application/vnd.ms-excel' }))
  // }
}
