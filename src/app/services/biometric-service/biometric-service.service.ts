import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import { Observable } from 'rxjs/observable';
import * as moment from 'moment';
@Injectable()
export class BiometricServiceService {
  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;
  constructor(private http: HttpClient, private auth: AuthenticatorService) {
    this.auth.currentAuthKey.subscribe(key => {
    this.Authorization = key;
    this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
  })
  this.auth.currentInstituteId.subscribe(id => {
    this.institute_id = id;
  });
  this.baseUrl = this.auth.getBaseUrl();
    }
    getAllData(){
      let url=this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all"
      return this.http.get(url , {headers:this.headers}).map(
        (data)=>{
            return data;
        },
        (error)=>{
          return error;
        }
      )
    }
    getCourses(obj){
      let url=this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/" + obj
      return this.http.get(url , {headers:this.headers}).map(
        (data:any)=>{
          return data;
        },
        (error)=>{
          return error;
        }
      )
    }
    getSubjects(obj){
      let url=this.baseUrl + "/api/v1/courseMaster/fetch/courses/" + this.institute_id + "/" + obj;
      return this.http.get(url , {headers:this.headers}).map(
        (data:any)=>{
          return data;
        },
        (error:any)=>{
          return error;
        }
      ) 
    }
    getAttendanceReport(obj){
      obj.biometric_attendance_date=moment(obj.biometric_attendance_date).format('YYYY-MM-DD');
      obj.institute_id = this.institute_id;
      let url=this.baseUrl + "/api/v1/students/manage/" + this.institute_id;
      return this.http.post(url , obj ,{headers:this.headers} ).map(
        (data : any)=>{
          return data;
        },
        (error)=>{
          return error;
        }
      )
    }
    getAttendanceReportTeachers(obj){
      obj.biometric_attendance_date=moment(obj.biometric_attendance_date).format('YYYY-MM-DD');
      let url=this.baseUrl + "/api/v1/teachers/manage/" +this.institute_id;
      return this.http.post(url, obj ,{headers:this.headers}).map(
        (data :any)=>{
          return data;
        },
        (error:any)=>{
          return error;
        }
      )
    }
    getAttendanceReportOthers(obj){
      obj.biometric_attendance_date=moment(obj.biometric_attendance_date).format('YYYY-MM-DD');
      let isActive = obj.is_active_status == 1? "Y": "N";
      let url=this.baseUrl + "/api/v1/profiles/all/" + this.institute_id + "?active=" +isActive;
      return this.http.post(url , obj, {headers:this.headers}).map(
        (data:any)=>{
          return data;
        },
        (error:any)=>{
          return error;
        }
      )
    }
    getAllFinalReport(obj){
      let url=this.baseUrl + "/api/v1/biometricAttendance/report";
      return this.http.post(url, obj , {headers:this.headers}).map(
        (data:any)=>{
          return data;
        },
        (error:any)=>{
          return error;
        }
      )
    }
    fetchAbsentiesData(obj){
      obj.from_date = moment(obj.from_date).format('YYYY-MM-DD');
      let url =this.baseUrl + "/api/v1/attendance/fetchAbsentsStudentsData";
      return this.http.post(url , obj ,{headers:this.headers}).map(
        (data:any)=>{
          return data;
        },
        (error:any)=>{
          return error;
        }
      )
    }

    fetchMasterCourseProfessional(obj) {
    let url = this.baseUrl + "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id + "?standard_id=" + obj.standard_id + "&subject_id=" + obj.subject_id + "&assigned=N";
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    )
  }

  fetchCourseProfessional(standardId){
    let url = this.baseUrl + "/api/v1/subjects/standards/"+standardId;
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    )
  }

  fetchAbsenteesListProfessional(obj){
    let url = this.baseUrl + "/api/v1/attendance/fetchAbsentsStudentsData/";
    return this.http.post(url, obj,{ headers: this.headers }).map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    )
  }

  }


