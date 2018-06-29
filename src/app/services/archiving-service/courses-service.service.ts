import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import * as moment from 'moment';

@Injectable()
export class CoursesServiceService {
  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;

  constructor(private http: HttpClient, private auth: AuthenticatorService)
   {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.baseUrl = this.auth.getBaseUrl();
  }

  getCoursesList(){
    let url = this.baseUrl + "/api/v1/courseMaster/fetch/courses/" + this.institute_id + "/all"
    return this.http.get(url ,{headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  courses(obj){
    let url= this.baseUrl + "/api/v1/archive/course"
    return this.http.post(url , obj , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  batches(obj){
    let url= this.baseUrl + "/api/v1/archive/batch"
    return this.http.post(url , obj , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }
  getBatches(){
    let url = this.baseUrl + "/api/v1/batches/all/" + this.institute_id;
    return this.http.get(url , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  courseArchiveStatus(){
    let url = this.baseUrl + "/api/v1/archive/course/report/" + this.institute_id;
    return this.http.get(url , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  batchArchiveStatus(){
    let url = this.baseUrl + "/api/v1/archive/batch/report/" + this.institute_id;
    return this.http.get(url , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  studentsArchiveData(){
    let url = this.baseUrl + "/api/v1/archive/students/" + this.institute_id;
    return this.http.get(url , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

}
