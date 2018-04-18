import { Injectable ,} from '@angular/core';
import {HttpClient,  HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import {Observable} from 'rxjs/observable';
import { error } from 'protractor';
import{ResponseContentType} from '@angular/http';
@Injectable()
export class AttendanceReportServiceService {
  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;
  standard_id;
  subject_id;
  assigned;
  constructor(private http:HttpClient , private auth: AuthenticatorService) { 

    this.institute_id = this.auth.getInstituteId();

    this.Authorization = this.auth.getAuthToken();
    //console.log(this.institute_id);
    this.baseUrl = this.auth.getBaseUrl();
    this.headers = new HttpHeaders(
      { "Content-Type": "application/json", "Authorization": this.Authorization });
      
  }
  ngOnInit(){
    this.getMasterCourse();
  }
  getMasterCourse(){
    let url=this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all" 
    return this.http.get(url , {headers:this.headers}).map(
      data =>{
        console.log(data);
        return data;
      },
      error=>{
        return error;
      }
    )
  }
  getCourses(obj){
    let url=this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/" + obj
    return this.http.get(url, {headers:this.headers}).map(
      data=>{
        return data;
      },
      error=>{
        return error;
      }
      
    )
  }
  getSubject(obj){
    let url=this.baseUrl + "/api/v1/courseMaster/fetch/courses/" + this.institute_id + "/" + obj
    return this.http.get(url, {headers:this.headers}).map(
      data =>{
        return data;
      },
      error=>{
        return error;
      }
      
    )

  }
  postDataToTable(obj){
    let url=this.baseUrl + "/api/v1/reports/attendance";
    return this.http.post(url ,obj, {headers:this.headers}).map(
      data =>{
        return data;
      },
      error =>{
        return error;
      }
    )
  }
  postDataToTablePro(obj){
    let url=this.baseUrl + "/api/v1/reports/attendance";
    return this.http.post(url ,obj, {headers:this.headers}).map(
      data =>{
        return data;
      },
      error =>{
        return error;
      }
    )
  }
  postDetailedData(obj){
    let url=this.baseUrl + "/api/v1/reports/attendance/monthlyAttendanceReport";
    return this.http.post(url, obj, {headers:this.headers}).map(
      data =>{
        return data;
      },
      error=>{
        return error;
      }

    )
  }
  /* =========================================================================== */
  /* =========================================================================== */
/*for professional*/

  masterCoursePro(obj){

    let url=this.baseUrl + "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id +  "?standard_id=" + obj.standard_id +"&subject_id=" + obj.subject_id + "&assigned=N" ;
    return this.http.get(url, {headers:this.headers}).map(
      data=>{
        return data;
      },
      error=>{
        return error;
      }
    )

  }
  // excelTableDownload(body){

  //   let user_token:string = this.Authorization.getToken();
  //   this.headers.append('Authorization', 'Bearer' + user_token);  
  //   return this.http.post(this.excelTableDownload(body),  {headers:this.headers, responseType:ResponseContentType.Blob} ,body ).map((res)=>new Blob([res._body],{ type: 'application/vnd.ms-excel' })) 
  // }
}
